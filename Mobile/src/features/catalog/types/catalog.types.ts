export interface CarItem {
  id: string;
  brand: string;
  model: string;
  trimName: string;
  fullTitle: string;
  price: string;
  priceAmount: number;
  imageUrl: string;
  slug: string;
  category: 'EV' | 'Hybrid' | 'Petrol' | 'Diesel';
  bodyType: string;
  rangeKm?: number;
  fuelConsumption?: string;
  transmission: 'Auto' | 'Manual';
  seats: number;
  horsepower?: number;
}

export interface FilterState {
  maxPrice: number;
  fuelTypes: string[];
  transmissions: string[];
  seats: string[];
}
