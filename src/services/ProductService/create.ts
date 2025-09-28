import { IAttributeRepo } from "../../repositories/attributes/IattributeRepo.js";
import { IProductImageRepo } from "../../repositories/productImages/IProductImageRepo.js";
import { IProductRepository } from "../../repositories/products/IProductRepository.js";
import { uploadFileToFirebase } from "../../utils/firebaseUpload/firebaseUploader.js";
export class Create {
  constructor(
    private productsRepo:IProductRepository,
    private productImagesRepo:IProductImageRepo,
    private attributeRepo:IAttributeRepo
  ) {}

  // Main service method to handle product creation
  async execute({
    userId,
    agencyId,
    productData,
    attributesData,
    files,
  }: {
    userId: number;
    agencyId?: number;
    productData: {
      title: string;
      price: number;
      description: string;
      streetAddress:string;
      cityId: number;
      subcategoryId: number;
      listingTypeId: number;
   area: number | null;
    buildYear: number | null;
      };
    attributesData?: { attributeId: number; attributeValueId: number }[];
    files?: Express.Multer.File[];
  }) {
    // ---- Validate attributes ----
    let attributes: { attributeId: number; attributeValueId: number }[] = [];

    if (attributesData && Array.isArray(attributesData)) {
      attributes = attributesData
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
      agencyId: agencyId ?? undefined,
      attributes: attributes.length > 0 ? attributes : undefined,
    });

   
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
    return product;
  }
}
