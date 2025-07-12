export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  image?: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  sort_order: number;
  priority?: string;
  country?: string;
  state?: string;
  city?: string;
  skills?: string[];
  publish_date?: string;
  is_featured?: boolean;
  is_active?: boolean;
  category: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: 'active' | 'inactive';
}

export interface BlogFilters {
  search?: string;
  status?: string;
  category_id?: number;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
}

export interface BlogFormData {
  title: string;
  content: string;
  image?: File | string;
  status: string;
  tags: string[];
  category_id: number;
  priority?: string;
  country?: string;
  state?: string;
  city?: string;
  skills?: string[];
  publish_date?: string;
  is_featured?: boolean;
  is_active?: boolean;
}