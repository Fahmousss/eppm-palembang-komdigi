export type ContentType = 'berita' | 'infografis' | 'pengumuman'

export interface Content{
  id: number;
  title:string;
  type: ContentType;
  content: string | Record<string, any>;
  image_url: string | null;
  is_active:boolean;
  created_by: string;
  created_at: string;
}