// Tipos y interfaces compartidas para proyectos

export interface ProjectLocation {
  city: string;
  province: string;
  region: string;
}

export interface InvestmentDetails {
  purchase_price: number;
  reform_cost: number | null;
  total_investment: number;
  current_value: number | null;
  monthly_rent: number | null;
  annual_return: number;
}

export interface ProjectImage {
  url: string;
  filename: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: ProjectLocation;
  type: string;
  short_description: string;
  description: string;
  main_image: ProjectImage | null;
  gallery: ProjectImage[];
  images: ProjectImage[];
  status: string;
  year: number;
  featured: boolean;
  is_public: boolean;
  investment_details: InvestmentDetails;
  features: string[];
}

export interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  update_type: string;
  attachments: { url: string; filename: string }[];
  published_at: string;
}

export interface ProjectMessage {
  id: string;
  user_id: string;
  user_name: string;
  subject: string;
  content: string;
  created_at: string;
  parent_id?: string | null;
}
