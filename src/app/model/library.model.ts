// src/app/model/library.model.ts
export interface LibraryGame {
  id: number;
  title: string;
  image_url: string;
  description: string; 
  category: string;
  // size_gb?: number; // field นี้ไม่มีใน DB
}