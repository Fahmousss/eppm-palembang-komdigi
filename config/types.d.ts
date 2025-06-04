import { ExternalPathString, RelativePathString } from "expo-router";
import { ReactNode } from "react";

export type ContentType = 'all'| 'berita' | 'infografis' | 'pengumuman'
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  created_at: Date;
}

export interface MenuItem{
  id: string,
  title: string,
  icon: ReactNode,
  bgColor: string,
  route: RelativePathString | ExternalPathString,
  textColor?: string,
}
export interface Content{
  id: string;
  title:string;
  type: ContentType;
  description:string;
  content: string | Record<string, any>;
  image_url: string | undefined;
  is_active:boolean;
  created_by: string;
  created_at: string;
}

// Update the Category interface to match the API response
export interface Category {
  id: number | string
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface ComplaintAttachment {
  id?: number
  complaint_id?: number
  file_name: string
  file_path?: string
  file_type: string
  file_size?:number
  uri: string
  type: string
  name: string
  created_at?: string
  updated_at?: string
}

export interface Complaint {
  id?: number
  user_id?: number | string
  title: string
  category_id: string
  category?: string
  location: string
  description: string
  status?: "menunggu" | "proses" | "selesai" | "ditolak"
  created_at?: string
  updated_at?: string
  attachments?: ComplaintAttachment[]
}
