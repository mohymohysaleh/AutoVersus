import { INewsRepository } from '../../domain/repositories/news-repository.interface.js';
import { UpdateArticleDto, NewsArticleDto } from '../dtos/news.dtos.js';
import { ArticleEntity } from '../../domain/entities/article.entity.js';
import { ArticleStatus } from '@prisma/client';

export class UpdateArticleUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(id: string, dto: UpdateArticleDto): Promise<NewsArticleDto> {
    const existing = await this.newsRepository.findById(id);
    if (!existing) {
      const error: any = new Error(`Article with id '${id}' was not found.`);
      error.statusCode = 404;
      throw error;
    }

    const newStatus = dto.status !== undefined ? dto.status : existing.status;
    const publishedAt =
      newStatus === ArticleStatus.PUBLISHED && !existing.publishedAt ? new Date() : existing.publishedAt;

    const updated = ArticleEntity.create(
      {
        title: dto.title !== undefined ? dto.title : existing.title,
        slug: existing.slug,
        summary: dto.summary !== undefined ? dto.summary : existing.summary,
        contentHtml: dto.contentHtml !== undefined ? dto.contentHtml : existing.contentHtml,
        coverImage: dto.coverImage !== undefined ? dto.coverImage : existing.coverImage,
        authorId: existing.authorId,
        category: dto.category !== undefined ? dto.category : existing.category,
        status: newStatus,
        publishedAt,
      },
      existing.id
    );

    return this.newsRepository.update(id, updated);
  }
}
