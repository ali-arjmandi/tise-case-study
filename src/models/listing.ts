export interface Owner {
  id: string;
  username: string;
  name: string;
  picture: string;
}

export interface Listing {
  id: string;
  createdAt: string;
  title: string;
  caption: string;
  size: string;
  category: string;
  askingPrice: number;
  currency: string;
  sold: boolean;
  owner: Owner;
  primaryImage: string;
  secondaryImage: string | null;
}

export interface ListingResponse extends Listing {
  likeCount: number;
  liked: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}
