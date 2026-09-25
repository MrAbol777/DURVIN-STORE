export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  href: string;
  image: string;
  imagePosition: string;
};

export type ProductImage = {
  src: string;
  position: string;
};

export type ProductAttribute = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  image: string;
  imagePosition: string;
  images: ProductImage[];
  shortDescription: string;
  description: string;
  attributes: ProductAttribute[];
  inStock: boolean;
  stockCount: number;
  createdAt: string;
};
