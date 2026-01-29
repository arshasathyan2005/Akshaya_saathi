// Firebase Firestore types
export interface Service {
  id: string;
  service_name: string;
  category: string;
  description: string;
  documents_required: string[];
  procedure_steps: string[];
  fees: string;
  processing_time: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceInput {
  service_name: string;
  category: string;
  description: string;
  documents_required?: string[];
  procedure_steps?: string[];
  fees?: string;
  processing_time?: string;
  notes?: string;
}

export interface Center {
  id: string;
  place: string;
  phone_number: string;
  services: string[]; // Array of service IDs available at this center
}

export interface AdminUser {
  id: string; // Firebase Auth UID
  email: string;
  centerId: string; // Links admin to their center
  role: 'admin';
}
