export interface Image {
  id: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  price: string | number;
  isFeatured: boolean;
  images: Image[];
}