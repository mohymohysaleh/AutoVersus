import { Entity } from '../../../../shared/domain/entity.base.js';
import { ArticleStatus } from '@prisma/client';

export interface ArticleProps {
  title: string;
  slug: string;
  summary: string;
  contentHtml: string;
  coverImage?: string | null;
  authorId: string;
  category: string;
  status: ArticleStatus;
  publishedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ArticleEntity extends Entity<ArticleProps> {
  private constructor(props: ArticleProps, id?: string) {
    super(props, id);
  }

  public static create(props: ArticleProps, id?: string): ArticleEntity {
    return new ArticleEntity(props, id);
  }

  get title(): string { return this.props.title; }
  get slug(): string { return this.props.slug; }
  get summary(): string { return this.props.summary; }
  get contentHtml(): string { return this.props.contentHtml; }
  get coverImage(): string | null | undefined { return this.props.coverImage; }
  get authorId(): string { return this.props.authorId; }
  get category(): string { return this.props.category; }
  get status(): ArticleStatus { return this.props.status; }
  get publishedAt(): Date | null | undefined { return this.props.publishedAt; }

  public publish(): void {
    (this.props as any).status = ArticleStatus.PUBLISHED;
    (this.props as any).publishedAt = new Date();
  }
}
