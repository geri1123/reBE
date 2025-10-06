import { IAttributeRepo } from "../../repositories/attributes/IattributeRepo.js";
import { IProductImageRepo } from "../../repositories/productImages/IProductImageRepo.js";
import { IProductRepository } from "../../repositories/products/IProductRepository.js";
import { uploadFileToFirebase } from "../../utils/firebaseUpload/firebaseUploader.js";
import { CreateProductInput } from "../../types/CreateProduct.js";
import { SupportedLang } from "../../locales/index.js";
export interface CreateProductServiceInput extends CreateProductInput {
  files?: Express.Multer.File[];
}


export class Create {
  constructor(
    private productsRepo: IProductRepository,
    private productImagesRepo: IProductImageRepo,
    private attributeRepo: IAttributeRepo
  ) {}

  async execute(input: CreateProductServiceInput, language: SupportedLang) {
    const { userId, agencyId, files, ...productData } = input;

    // ---- Validate attributes ----
    let attributes: { attributeId: number; attributeValueId: number }[] = [];

    if (productData.attributes && Array.isArray(productData.attributes)) {
      attributes = productData.attributes
        .map(attr => ({
          attributeId: parseInt(attr.attributeId as any),
          attributeValueId: parseInt(attr.attributeValueId as any),
        }))
        .filter(attr => !isNaN(attr.attributeId) && !isNaN(attr.attributeValueId));

      if (attributes.length > 0) {
        const validAttributeIds = await this.attributeRepo.getValidAttributeIdsBySubcategory(
          productData.subcategoryId
        );

        for (const attr of attributes) {
          if (!validAttributeIds.includes(attr.attributeId)) {
            throw new Error(
              `Attribute ${attr.attributeId} does not belong to subcategory ${productData.subcategoryId}`
            );
          }
        }
      }
    }

    // ---- Create product ----
    const product = await this.productsRepo.createProduct({
      ...productData,
      userId,
      agencyId,
      attributes: attributes.length > 0 ? attributes : undefined,
    });

    // ---- Upload images ----
    if (files && Array.isArray(files)) {
      await Promise.all(
        files.map(async (file) => {
          const imageUrl = await uploadFileToFirebase(file, "product_images");

          await this.productImagesRepo.addImage({
            imageUrl,
            product: { connect: { id: product.id } },
            user: { connect: { id: userId } },
          });
        })
      );
    }

    // ---- Return complete product with all relations ----
    return await this.productsRepo.getProductWithRelations(product.id, language);
  }
}



// export class Create {
//   constructor(
//     private productsRepo: IProductRepository,
//     private productImagesRepo: IProductImageRepo,
//     private attributeRepo: IAttributeRepo
//   ) {}
//   // Main service method to handle product creation
//   async execute(input: CreateProductServiceInput) {
//     const { userId, agencyId, files, ...productData } = input;

//     // ---- Validate attributes ----
//     let attributes: { attributeId: number; attributeValueId: number }[] = [];

//     if (productData.attributes && Array.isArray(productData.attributes)) {
//       attributes = productData.attributes
//         .map(attr => ({
//           attributeId: parseInt(attr.attributeId as any),
//           attributeValueId: parseInt(attr.attributeValueId as any),
//         }))
//         .filter(attr => !isNaN(attr.attributeId) && !isNaN(attr.attributeValueId));

//       if (attributes.length > 0) {
//         const validAttributeIds = await this.attributeRepo.getValidAttributeIdsBySubcategory(
//           productData.subcategoryId
//         );

//         for (const attr of attributes) {
//           if (!validAttributeIds.includes(attr.attributeId)) {
//             throw new Error(
//               `Attribute ${attr.attributeId} does not belong to subcategory ${productData.subcategoryId}`
//             );
//           }
//         }
//       }
//     }

//     // ---- Create product ----
//     const product = await this.productsRepo.createProduct({
//       ...productData,
//       userId,
//       agencyId,
//       attributes: attributes.length > 0 ? attributes : undefined,
//     });

//     // ---- Upload images ----
//     if (files && Array.isArray(files)) {
//       await Promise.all(
//         files.map(async (file) => {
//           const imageUrl = await uploadFileToFirebase(file, "product_images");

//           await this.productImagesRepo.addImage({
//             imageUrl,
//             product: { connect: { id: product.id } },
//             user: { connect: { id: userId } },
//           });
//         })
//       );
//     }

//     return product;
//   }
// }
