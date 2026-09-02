import { apiClient } from './api';

export interface Service {
  id: number;
  slug: string;
  title: string;
  title_ko?: string;
  description?: string;
  icon?: string;
  hero_title?: string;
  hero_description?: string;
  hero_button_text?: string;
  hero_info?: Array<{
    title: string;
    description: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: number;
  code: string;
  name: string;
  name_ru: string;
  name_ko?: string;
  is_active: boolean;
  created_at: string;
}

export interface TariffRow {
  id: number;
  tariff_id: number;
  category: string;
  price: string;
  delivery: string;
  note: string;
  has_close_icon: boolean;
  sort_order: number;
}

export interface Tariff {
  id: number;
  service_id: number;
  country_id: number;
  tariff_type: string;
  columns: string[];
  notes: string[];
  min_weight?: number;
  delivery_info?: string;
  is_active: boolean;
  country_code: string;
  country_name: string;
  rows?: TariffRow[];
  created_at: string;
  updated_at: string;
}

export interface ServiceComparison {
  id: number;
  service_slug: string;
  title: string;
  columns: string[];
  rows: Array<{
    title: string;
    air?: string | string[];
    container?: string | string[];
  }>;
  created_at: string;
}

export interface CompanyInfo {
  id: number;
  section: string;
  title?: string;
  content?: string;
  image_url?: string;
  contact_info?: {
    phone?: string;
    email?: string;
    address?: string;
    working_hours?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class ContentService {
  // Получить все услуги
  async getAllServices(): Promise<Service[]> {
    const response = await apiClient.get<Service[]>('/api/content/services');
    return response;
  }

  // Получить услугу по slug
  async getServiceBySlug(slug: string): Promise<Service> {
    const response = await apiClient.get<Service>(`/api/content/services/${slug}`);
    return response;
  }

  // Получить тарифы для услуги
  async getTariffs(
  serviceSlug: string,
  countryCode?: string
): Promise<Tariff[]> {
  const endpoint = countryCode
    ? `/api/content/services/${serviceSlug}/tariffs?country=${encodeURIComponent(countryCode)}`
    : `/api/content/services/${serviceSlug}/tariffs`;

  const response = await apiClient.get<Tariff[]>(endpoint);

  return response;
}

  // Получить все страны
  async getAllCountries(): Promise<Country[]> {
    const response = await apiClient.get<Country[]>('/api/content/countries');
    return response;
  }

  // Получить сравнение услуг
  async getServiceComparison(serviceSlug: string): Promise<ServiceComparison> {
    const response = await apiClient.get<ServiceComparison>(`/api/content/services/${serviceSlug}/comparison`);
    return response;
  }

  // Получить информацию о компании
  async getCompanyInfo(section: string): Promise<CompanyInfo> {
    const response = await apiClient.get<CompanyInfo>(`/api/content/company/${section}`);
    return response;
  }
}

export const contentService = new ContentService();
