import { INewsRepository } from '../domain/repositories/news-repository.interface.js';
import { ArticleEntity } from '../domain/entities/article.entity.js';
import { NewsArticleDto, NewsFilterQueryDto } from '../application/dtos/news.dtos.js';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service.js';
import { ArticleStatus } from '@prisma/client';

export class PrismaNewsRepository implements INewsRepository {
  private prisma = PrismaService.getInstance();

  async findPublished(filters: NewsFilterQueryDto): Promise<{ items: NewsArticleDto[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      status: ArticleStatus.PUBLISHED,
    };

    if (filters.category) {
      where.category = {
        equals: filters.category,
        mode: 'insensitive',
      };
    }

    const [articles, total] = await Promise.all([
      this.prisma.newsArticle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: { name: true, email: true },
          },
        },
      }),
      this.prisma.newsArticle.count({ where }),
    ]);

    return {
      items: articles.map((a) => this.mapToDto(a)),
      total,
    };
  }

  async findBySlug(slug: string): Promise<NewsArticleDto | null> {
    const article = await this.prisma.newsArticle.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    if (!article) return null;
    return this.mapToDto(article);
  }

  async findById(id: string): Promise<ArticleEntity | null> {
    const article = await this.prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!article) return null;

    return ArticleEntity.create(
      {
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        contentHtml: article.contentHtml,
        coverImage: article.coverImage,
        authorId: article.authorId,
        category: article.category,
        status: article.status,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      },
      article.id
    );
  }

  async save(article: ArticleEntity): Promise<NewsArticleDto> {
    const created = await this.prisma.newsArticle.create({
      data: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        contentHtml: article.contentHtml,
        coverImage: article.coverImage,
        authorId: article.authorId,
        category: article.category,
        status: article.status,
        publishedAt: article.publishedAt,
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    return this.mapToDto(created);
  }

  async update(id: string, article: ArticleEntity): Promise<NewsArticleDto> {
    const updated = await this.prisma.newsArticle.update({
      where: { id },
      data: {
        title: article.title,
        summary: article.summary,
        contentHtml: article.contentHtml,
        coverImage: article.coverImage,
        category: article.category,
        status: article.status,
        publishedAt: article.publishedAt,
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    return this.mapToDto(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.newsArticle.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  private mapToDto(a: any): NewsArticleDto {
    return {
      id: a.id,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      contentHtml: a.contentHtml,
      coverImage: a.coverImage,
      authorId: a.authorId,
      authorName: a.author?.name || a.author?.email || 'AutoVersus Editorial Team',
      category: a.category,
      status: a.status,
      publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
      createdAt: a.createdAt.toISOString(),
    };
  }
}
