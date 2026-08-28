export interface NewsArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string; // 'Electric', 'First Drives', 'Industry News', 'Price Tracker'
  summary: string;
  contentHtml?: string;
  coverImage: string;
  authorName: string;
  authorAvatar?: string;
  publishedDate: string;
  readTime: string;
  isFeatured?: boolean;
}
