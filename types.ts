// types.ts dosyasının TAMAMI şöyle olmalı (Eksikleri ekleyin):

export interface Image {
  id: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
}

// YENİ EKLENECEK KISIMLAR:
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
  attribute: Attribute;
}
// -----------------------

export interface Product {
  id: string;
  category: Category;
  name: string;
  price: string | number;
  isFeatured: boolean;
  images: Image[];
  // YENİ: Ürüne varyasyonları ekliyoruz
  attributes?: AttributeValue[]; 
}