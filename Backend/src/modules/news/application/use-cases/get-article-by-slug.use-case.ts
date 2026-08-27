import { INewsRepository } from '../../domain/repositories/news-repository.interface.js';
import { NewsArticleDto } from '../dtos/news.dtos.js';

export class GetArticleBySlugUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(slug: string): Promise<NewsArticleDto | null> {
    return this.newsRepository.findBySlug(slug);
  }
}
