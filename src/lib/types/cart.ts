export type CartItemBase = {
  lineId: string;
  quantity: number;
  unitPriceClp: number;
  nameEs: string;
  nameEn: string;
  imageUrl: string | null;
};

export type PackageCartItem = CartItemBase & {
  type: "package";
  packageId: string;
  slug: string;
  startDate?: string;
};

export type ExperienceCartItem = CartItemBase & {
  type: "experience";
  experienceId: string;
  slug: string;
  selectedDate?: string;
};

export type ProductCartItem = CartItemBase & {
  type: "product";
  productId: string;
  slug: string;
};

export type CartItem = PackageCartItem | ExperienceCartItem | ProductCartItem;
