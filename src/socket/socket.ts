import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { config } from '../config/config.js';
import { UnauthorizedError } from '../errors/BaseError.js';
import { UserRepositoryPrisma } from '../repositories/user/UserRepositoryPrisma.js';
import { AgencyRepository } from '../repositories/agency/AgencyRepository.js';
import { prisma } from '../config/prisma.js';
interface DecodedToken extends jwt.JwtPayload {
  userId: number;
  username: string;
  role: string;
  agencyId?: number | null;
}

interface AuthenticatedSocket extends Socket {
  userId?: number;
  agencyId?: number;
  user?: DecodedToken;
}

const UserUpdates = new UserRepositoryPrisma(prisma);
const AgencyQueries = new AgencyRepository(prisma);

const userSockets = new Map<number, string>();

// Store last active update time per userId (in ms timestamp)
const lastActiveCache = new Map<number, number>();

const UPDATE_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes throttle

let io: Server;

export function setupSocket(ioServer: Server) {
  io = ioServer;

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie || '';
      const cookies = cookie.parse(rawCookie);
      const token = cookies.token;

      if (!token) {
        return next(new Error('Authentication error: token not found in cookies'));
      }

      if (!config.secret.jwtSecret) {
        throw new Error('JWT secret not configured');
      }

      const decoded = jwt.verify(token, config.secret.jwtSecret);

      if (
        typeof decoded !== 'object' ||
        decoded === null ||
        !('userId' in decoded) ||
        !('username' in decoded) ||
        !('role' in decoded)
      ) {
        throw new UnauthorizedError('Invalid token payload structure');
      }

      const user = decoded as DecodedToken;

      socket.user = user;
      socket.userId = user.userId;

      if (user.role === 'agency_owner') {
        const agency = await AgencyQueries.findByOwnerUserId(user.userId);
        if (agency) {
          socket.agencyId = agency.id;
        }
      }

      // Throttle last_active DB update:
      const now = Date.now();
      const lastUpdate = lastActiveCache.get(user.userId) ?? 0;

      if (now - lastUpdate > UPDATE_THROTTLE_MS) {
        await UserUpdates.updateFieldsById(user.userId, { last_active: new Date() });
        lastActiveCache.set(user.userId, now);
      }

      next();
    } catch (err) {
      console.error('❌ Socket auth error:', err);
      next(new UnauthorizedError('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    if (!socket.userId) {
      socket.disconnect();
      return;
    }

    userSockets.set(socket.userId, socket.id);
    socket.join(`user_${socket.userId}`);

    console.log(`✅ User ${socket.userId} connected (agencyId: ${socket.agencyId ?? 'none'})`);

    socket.on('disconnect', () => {
      userSockets.delete(socket.userId!);
      console.log(`❌ User ${socket.userId} disconnected`);
    });
  });
}

export function getSocketInstance() {
  return io;
}

export function getUserSocketId(userId: number): string | undefined {
  return userSockets.get(userId);
}


// import { Server, Socket } from 'socket.io';
// import jwt from 'jsonwebtoken';
// import cookie from 'cookie';
// import { config } from '../config/config.js';
// import { UnauthorizedError } from '../errors/BaseError.js';
// import { UserRepositoryPrisma } from '../repositories/user/UserRepositoryPrisma.js';
// import { AgencyRepository } from '../repositories/agency/AgencyRepository.js';

// interface DecodedToken extends jwt.JwtPayload {
//   userId: number;
//   username: string;
//   role: string;
//   agencyId?: number | null;
// }

// interface AuthenticatedSocket extends Socket {
//   userId?: number;
//   agencyId?: number;
//   user?: DecodedToken;
// }

// const UserUpdates = new UserRepositoryPrisma();
// const AgencyQueries = new AgencyRepository();

// const userSockets = new Map<number, string>();
// let io: Server;

// export function setupSocket(ioServer: Server) {
//   io = ioServer;

//   io.use(async (socket: AuthenticatedSocket, next) => {
//     try {
//       const rawCookie = socket.handshake.headers.cookie || '';
//       const cookies = cookie.parse(rawCookie);
//       const token = cookies.token;

//       if (!token) {
//         return next(new Error('Authentication error: token not found in cookies'));
//       }

//       if (!config.secret.jwtSecret) {
//         throw new Error('JWT secret not configured');
//       }

//       const decoded = jwt.verify(token, config.secret.jwtSecret);

//       if (
//         typeof decoded !== 'object' ||
//         decoded === null ||
//         !('userId' in decoded) ||
//         !('username' in decoded) ||
//         !('role' in decoded)
//       ) {
//         throw new UnauthorizedError('Invalid token payload structure');
//       }

//       const user = decoded as DecodedToken;

//       socket.user = user;
//       socket.userId = user.userId;

//       if (user.role === 'agency_owner') {
//         const agency = await AgencyQueries.findByOwnerUserId(user.userId);
//         if (agency) {
//           socket.agencyId = agency.id;
//         }
//       }

//       await UserUpdates.updateFieldsById(user.userId, { last_active: new Date() });

//       next();
//     } catch (err) {
//       console.error('❌ Socket auth error:', err);
//       next(new UnauthorizedError('Invalid or expired token'));
//     }
//   });

//   io.on('connection', (socket: AuthenticatedSocket) => {
//     if (!socket.userId) {
//       socket.disconnect();
//       return;
//     }

//     userSockets.set(socket.userId, socket.id);
//     socket.join(`user_${socket.userId}`);

//     console.log(`✅ User ${socket.userId} connected (agencyId: ${socket.agencyId ?? 'none'})`);

//     socket.on('disconnect', () => {
//       userSockets.delete(socket.userId!);
//       console.log(`❌ User ${socket.userId} disconnected`);
//     });
//   });
// }

// export function getSocketInstance() {
//   return io;
// }

// export function getUserSocketId(userId: number): string | undefined {
//   return userSockets.get(userId);
// }
