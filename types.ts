// types.ts

export interface Image {
  id: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Attribute {
  id: string;
  name: string;
  valueType: string;
}

export interface AttributeValue {
  id: string;
  name: string;
  value: string;
  attributeId: string;
  attribute?: Attribute;
  // Prisma uyumluluğu için tarih alanlarını ekliyoruz
  createdAt?: Date; 
  updatedAt?: Date;
}

export interface Product {
  id: string;
  category: Category | null;
  name: string;
  price: string | number;
  isFeatured: boolean;
  isArchived?: boolean; // Admin tarafında kullanılabiliyor
  images: Image[];
  attributes?: AttributeValue[]; 
  description?: string;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}