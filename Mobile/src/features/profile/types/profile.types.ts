export interface SavedVehicle {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  slug: string;
}

export interface SavedComparisonItem {
  id: string;
  title: string;
  createdDate: string;
  leftCarImage: string;
  rightCarImage: string;
  variantSlugs: string[];
}

export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  country: string;
  currency: string;
  language: string;
  measurement: string;
}
