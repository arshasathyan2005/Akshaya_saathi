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
