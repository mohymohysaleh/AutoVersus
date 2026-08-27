import { INewsRepository } from '../../domain/repositories/news-repository.interface.js';
import { NewsArticleDto, NewsFilterQueryDto } from '../dtos/news.dtos.js';

export class GetPublishedArticlesUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(filters: NewsFilterQueryDto): Promise<{ items: NewsArticleDto[]; total: number }> {
    return this.newsRepository.findPublished(filters);
  }
}
