export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          service_name: string;
          category: string;
          description: string;
          documents_required: string[];
          procedure_steps: string[];
          fees: string;
          processing_time: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_name: string;
          category: string;
          description: string;
          documents_required?: string[];
          procedure_steps?: string[];
          fees?: string;
          processing_time?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_name?: string;
          category?: string;
          description?: string;
          documents_required?: string[];
          procedure_steps?: string[];
          fees?: string;
          processing_time?: string;
          notes?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Service = Database['public']['Tables']['services']['Row'];
