import { INewsRepository } from '../../domain/repositories/news-repository.interface.js';
import { CreateArticleDto, NewsArticleDto } from '../dtos/news.dtos.js';
import { ArticleEntity } from '../../domain/entities/article.entity.js';
import { ArticleStatus } from '@prisma/client';

export class CreateArticleUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(dto: CreateArticleDto): Promise<NewsArticleDto> {
    const slug = dto.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existing = await this.newsRepository.findBySlug(slug);
    if (existing) {
      const error: any = new Error(`Article with title/slug '${slug}' already exists.`);
      error.statusCode = 409;
      throw error;
    }

    const status = dto.status || ArticleStatus.DRAFT;
    const publishedAt = status === ArticleStatus.PUBLISHED ? new Date() : null;

    const article = ArticleEntity.create({
      title: dto.title,
      slug,
      summary: dto.summary,
      contentHtml: dto.contentHtml,
      coverImage: dto.coverImage || null,
      authorId: dto.authorId,
      category: dto.category,
      status,
      publishedAt,
    });

    return this.newsRepository.save(article);
  }
}
