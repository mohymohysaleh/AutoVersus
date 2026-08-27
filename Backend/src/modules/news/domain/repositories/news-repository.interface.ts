import { ArticleEntity } from '../entities/article.entity.js';
import { NewsArticleDto, NewsFilterQueryDto } from '../../application/dtos/news.dtos.js';

export interface INewsRepository {
  findPublished(filters: NewsFilterQueryDto): Promise<{ items: NewsArticleDto[]; total: number }>;
  findBySlug(slug: string): Promise<NewsArticleDto | null>;
  findById(id: string): Promise<ArticleEntity | null>;
  save(article: ArticleEntity): Promise<NewsArticleDto>;
  update(id: string, article: ArticleEntity): Promise<NewsArticleDto>;
  delete(id: string): Promise<boolean>;
}
