import { PrismaClient, Product } from "@prisma/client";
import { CreateProduct ,CreateProductInput} from "../../types/CreateProduct.js";
import { SupportedLang } from "../../locales/index.js";
import { IProductRepository } from "./IProductRepository.js";

export class ProductsRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}
  
  async createProduct(
    data:CreateProductInput
   
  ): Promise<Product> {
    // Create product first
    const product = await this.prisma.product.create({
      data: {
        title: data.title,
        price: data.price,
        description: data.description,
        cityId: data.cityId,
          streetAddress: data.streetAddress, 
        subcategoryId: data.subcategoryId,
        listingTypeId: data.listingTypeId,
        userId: data.userId,
        agencyId: data.agencyId,
        area:data.area,
        buildYear: data.buildYear,
        status: data.status || "draft",
      },
    });

    console.log('Created product with ID:', product.id);

    // ---- Add product attributes if provided ----
    if (data.attributes && Array.isArray(data.attributes) && data.attributes.length > 0) {
      console.log('Adding attributes:', data.attributes);
      
      try {
        const attributePromises = data.attributes.map(attr => {
          console.log(`Creating ProductAttributeValue: productId=${product.id}, attributeId=${attr.attributeId}, attributeValueId=${attr.attributeValueId}`);
          
          return this.prisma.productAttributeValue.create({
            data: {
              productId: product.id,
              attributeId: attr.attributeId,
              attributeValueId: attr.attributeValueId,
            },
          });
        });

        const createdAttributes = await Promise.all(attributePromises);
        console.log('Successfully created attributes:', createdAttributes.length);
      } catch (error) {
        console.error('Error creating product attributes:', error);
        // Optionally delete the product if attribute creation fails
        throw new Error(`Failed to create product attributes`);
      }
    } else {
      console.log('No attributes to add');
    }

    return product;
  }
async getProductWithRelations(productId: number, language: SupportedLang) {
  return this.prisma.product.findUnique({
    where: { id: productId },
    include: {
      image: true,
      city: true,
      subcategory: {
        include: {
          subcategorytranslation: {
            where: { language }, 
          },
        },
      },
      listingType: {
        include: {
          listing_type_translation: {
            where: { language },
          },
        },
      },
      attributes: {
        include: {
          attribute: {
            include: {
              attributeTranslation: {
                where: { language },
              },
            },
          },
          attributeValue: {
            include: {
              attributeValueTranslations: {
                where: { language },
              },
            },
          },
        },
      },
    },
  });
}
  
}