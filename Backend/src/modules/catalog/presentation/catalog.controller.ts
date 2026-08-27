import { Request, Response, NextFunction } from 'express';
import { PrismaCatalogRepository } from '../infrastructure/prisma-catalog.repository.js';
import { ListBrandsUseCase } from '../application/use-cases/list-brands.use-case.js';
import { GetVariantDetailsUseCase } from '../application/use-cases/get-variant-details.use-case.js';
import { SearchVehiclesUseCase } from '../application/use-cases/search-vehicles.use-case.js';

export class CatalogController {
  private catalogRepo = new PrismaCatalogRepository();
  private listBrandsUseCase = new ListBrandsUseCase(this.catalogRepo);
  private getVariantDetailsUseCase = new GetVariantDetailsUseCase(this.catalogRepo);
  private searchVehiclesUseCase = new SearchVehiclesUseCase(this.catalogRepo);

  public getBrands = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brands = await this.listBrandsUseCase.execute();
      res.json({
        success: true,
        data: brands,
      });
    } catch (error) {
      next(error);
    }
  };

  public getVariantBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const variant = await this.getVariantDetailsUseCase.execute(slug as string);

      if (!variant) {
        return res.status(404).json({
          success: false,
          error: {
            message: `Vehicle variant with slug '${slug}' was not found.`,
            statusCode: 404,
          },
        });
      }

      res.json({
        success: true,
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  };

  public searchVehicles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bodyType, brandSlug, minPriceEGP, maxPriceEGP, fuelType, transmission, page, limit } = req.query;

      const filters = {
        bodyType: bodyType as string | undefined,
        brandSlug: brandSlug as string | undefined,
        minPriceEGP: minPriceEGP ? Number(minPriceEGP) : undefined,
        maxPriceEGP: maxPriceEGP ? Number(maxPriceEGP) : undefined,
        fuelType: fuelType as string | undefined,
        transmission: transmission as string | undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      };

      const result = await this.searchVehiclesUseCase.execute(filters);

      res.json({
        success: true,
        data: result.items,
        meta: {
          total: result.total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(result.total / filters.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
