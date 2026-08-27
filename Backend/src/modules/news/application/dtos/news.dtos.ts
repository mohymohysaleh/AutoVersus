import { ArticleStatus } from '@prisma/client';

export interface NewsArticleDto {
  id: string;
  title: string;
  slug: string;
  summary: string;
  contentHtml: string;
  coverImage: string | null;
  authorId: string;
  authorName?: string | null;
  category: string;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
}

export interface NewsFilterQueryDto {
  category?: string;
  page?: number;
  limit?: number;
}

export interface CreateArticleDto {
  title: string;
  summary: string;
  contentHtml: string;
  coverImage?: string;
  category: string;
  status?: ArticleStatus;
  authorId: string;
}

export interface UpdateArticleDto {
  title?: string;
  summary?: string;
  contentHtml?: string;
  coverImage?: string;
  category?: string;
  status?: ArticleStatus;
}
