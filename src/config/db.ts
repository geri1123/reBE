
// export const db = drizzle(pool);
// export default pool;

// import mysql from 'mysql2/promise';
// import { config } from './config.js';
// import { drizzle } from 'drizzle-orm/mysql2';


// const pool = mysql.createPool({
//   host: config.db.host,
//   port: config.db.port,
//   user: config.db.user,
//   password: config.db.password,
//   database: config.db.name,
//   waitForConnections: true,
//   connectionLimit: 10,
//   maxIdle: 10,
//   idleTimeout: 60000,
//   queueLimit: 0,
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 0,
// });

// // Test connection (optional)
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log('✅ Connected to MySQL database');
//     connection.release();
//   } catch (error) {
//     console.error('❌ MySQL connection error:', error);
//     process.exit(1);
//   }
// })();
