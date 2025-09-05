import { Request, Response, NextFunction } from "express";
import { prisma } from '../../config/prisma.js';
import { ProductsRepository } from "../../repositories/products/ProductsRepository.js";
import { ProductImagesRepository } from "../../repositories/productImages/ProductImagesRepo.js";
import { UnauthorizedError } from "../../errors/BaseError.js";

const productsRepo = new ProductsRepository(prisma);
const productImagesRepo = new ProductImagesRepository(prisma);

export async function CreateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const agencyId = req.agencyId;

    if (!userId) throw new UnauthorizedError("User not authenticated");

    // Parse body
    const productData = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      description: req.body.description,
      cityId: parseInt(req.body.cityId),
      subcategoryId: parseInt(req.body.subcategoryId),
      listingTypeId: parseInt(req.body.listingTypeId),
      attributes: req.body.attributes, // Array of { attributeId, value }
    };

    // Validate required fields
    if (!productData.title || isNaN(productData.price) || isNaN(productData.cityId) ||
        isNaN(productData.subcategoryId) || isNaN(productData.listingTypeId)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ Create product with attributes
    const product = await productsRepo.createProduct({
      ...productData,
      userId,
      agencyId: agencyId ?? undefined,
    });

    // 2️⃣ Save images
    if (req.files && Array.isArray(req.files)) {
      await Promise.all(
        req.files.map((file: Express.Multer.File) =>
          productImagesRepo.addImage({
            imageUrl: file.path.replace(/\\/g, '/'),
            product: { connect: { id: product.id } },
            user: { connect: { id: userId } },
          })
        )
      );
    }

    // 3️⃣ Fetch product with images attached
    const images = await productImagesRepo.getImagesByProduct(product.id);

    res.status(201).json({
      success: true,
      product: {
        ...product,
        images,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}


// import { Request, Response, NextFunction } from "express";
// import { prisma } from '../../config/prisma.js';
// import { ProductsRepository } from "../../repositories/products/ProductsRepository.js";
// import { ProductImagesRepository } from "../../repositories/productImages/ProductImagesRepo.js";
// import { UnauthorizedError } from "../../errors/BaseError.js";

// const productsRepo = new ProductsRepository(prisma);
// const productImagesRepo = new ProductImagesRepository(prisma);

// export async function CreateProduct(req: Request, res: Response, next: NextFunction) {
//   try {
//     const userId = req.userId;
//     const agencyId = req.agencyId;

//     if (!userId) throw new UnauthorizedError("User not authenticated");

//     // Parse body
//     const productData = {
//       title: req.body.title,
//       price: parseFloat(req.body.price),
//       description: req.body.description,
//       cityId: parseInt(req.body.cityId),
//       subcategoryId: parseInt(req.body.subcategoryId),
//       listingTypeId: parseInt(req.body.listingTypeId),
//     };

//     // Validate required fields
//     if (!productData.title || isNaN(productData.price) || isNaN(productData.cityId) ||
//         isNaN(productData.subcategoryId) || isNaN(productData.listingTypeId)) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // 1️⃣ Create product
//     const product = await productsRepo.createProduct({
//       ...productData,
//       userId,
//       agencyId: agencyId ?? undefined,
//     });

//     // 2️⃣ Save images
//     if (req.files && Array.isArray(req.files)) {
//       await Promise.all(
//         req.files.map((file: Express.Multer.File) =>
//           productImagesRepo.addImage({
//             imageUrl: file.path.replace(/\\/g, '/'),
//             product: { connect: { id: product.id } },
//             user: { connect: { id: userId } },
//           })
//         )
//       );
//     }

//     // 3️⃣ Fetch product with images attached
//     const images = await productImagesRepo.getImagesByProduct(product.id);

//     res.status(201).json({
//       success: true,
//       product: {
//         ...product,
//         images, 
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// }

// import { Request, Response, NextFunction } from "express";
// import { prisma } from '../../config/prisma.js';
// import { ProductsRepository } from "../../repositories/products/ProductsRepository.js";
// import { ProductImagesRepository } from "../../repositories/productImages/ProductImagesRepo.js";
// import { UnauthorizedError } from "../../errors/BaseError.js";

// const productsRepo = new ProductsRepository(prisma);
// const productImagesRepo = new ProductImagesRepository(prisma);

// export async function CreateProduct(req: Request, res: Response, next: NextFunction) {
//   try {
//     const userId = req.userId;
//     const agencyId = req.agencyId;

//     if (!userId) throw new UnauthorizedError("User not authenticated");

//     // Make sure fields exist in req.body
//     console.log('REQ BODY:', req.body);
//     console.log('REQ FILES:', req.files);

//     // Convert strings to numbers
//     const productData = {
//       title: req.body.title,
//       price: parseFloat(req.body.price),
//       description: req.body.description,
//       cityId: parseInt(req.body.cityId),
//       subcategoryId: parseInt(req.body.subcategoryId),
//       listingTypeId: parseInt(req.body.listingTypeId),
//     };

//     // Validate required fields
//     if (!productData.title || isNaN(productData.price) || isNaN(productData.cityId) ||
//         isNaN(productData.subcategoryId) || isNaN(productData.listingTypeId)) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // 1️⃣ Create product
//     const product = await productsRepo.createProduct({
//       ...productData,
//       userId,
//       agencyId: agencyId ?? undefined,
//     });

//     // 2️⃣ Save images
//  if (req.files && Array.isArray(req.files)) {
//   await Promise.all(
//     req.files.map((file: Express.Multer.File) =>
//       productImagesRepo.addImage({
//         imageUrl: file.path.replace(/\\/g, '/'),
//         product: { connect: { id: product.id } },
//         user: { connect: { id: userId } },
//       })
//     )
//   );
// }

//     // Return product with uploaded images
//     const images = await productImagesRepo.getImagesByProduct(product.id);

//     res.status(201).json({ success: true, product, images });
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// }
