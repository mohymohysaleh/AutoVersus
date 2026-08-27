import { Request, Response, NextFunction } from 'express';
import { PrismaNewsRepository } from '../infrastructure/prisma-news.repository.js';
import { GetPublishedArticlesUseCase } from '../application/use-cases/get-published-articles.use-case.js';
import { GetArticleBySlugUseCase } from '../application/use-cases/get-article-by-slug.use-case.js';
import { CreateArticleUseCase } from '../application/use-cases/create-article.use-case.js';
import { UpdateArticleUseCase } from '../application/use-cases/update-article.use-case.js';
import { AuthenticatedRequest } from '../../../shared/presentation/middlewares/auth.middleware.js';

export class NewsController {
  private newsRepo = new PrismaNewsRepository();

  private getPublishedArticlesUseCase = new GetPublishedArticlesUseCase(this.newsRepo);
  private getArticleBySlugUseCase = new GetArticleBySlugUseCase(this.newsRepo);
  private createArticleUseCase = new CreateArticleUseCase(this.newsRepo);
  private updateArticleUseCase = new UpdateArticleUseCase(this.newsRepo);

  public getArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, page, limit } = req.query;

      const result = await this.getPublishedArticlesUseCase.execute({
        category: category as string | undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      });

      res.json({
        success: true,
        data: result.items,
        meta: {
          total: result.total,
          page: page ? Number(page) : 1,
          limit: limit ? Number(limit) : 10,
          totalPages: Math.ceil(result.total / (limit ? Number(limit) : 10)),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const article = await this.getArticleBySlugUseCase.execute(slug as string);

      if (!article) {
        return res.status(404).json({
          success: false,
          error: {
            message: `Article with slug '${slug}' was not found.`,
            statusCode: 404,
          },
        });
      }

      res.json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  };

  public createArticle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { title, summary, contentHtml, coverImage, category, status } = req.body;
      const authorId = req.user!.userId;

      if (!title || !summary || !contentHtml || !category) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Title, summary, contentHtml, and category are required fields.',
            statusCode: 400,
          },
        });
      }

      const article = await this.createArticleUseCase.execute({
        title,
        summary,
        contentHtml,
        coverImage,
        category,
        status,
        authorId,
      });

      res.status(201).json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateArticle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, summary, contentHtml, coverImage, category, status } = req.body;

      const updated = await this.updateArticleUseCase.execute(id as string, {
        title,
        summary,
        contentHtml,
        coverImage,
        category,
        status,
      });

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteArticle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const success = await this.newsRepo.delete(id as string);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: {
            message: `Article with id '${id}' was not found.`,
            statusCode: 404,
          },
        });
      }

      res.json({
        success: true,
        message: 'Article successfully deleted.',
      });
    } catch (error) {
      next(error);
    }
  };
}
