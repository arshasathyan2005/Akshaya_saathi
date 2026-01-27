/*
  # Create Services Table for Akshaya Center Guide

  1. New Tables
    - `services`
      - `id` (uuid, primary key) - Unique identifier for each service
      - `service_name` (text) - Name of the service
      - `category` (text) - Category (Certificates, ID Services, Education, Pension & Welfare, Utility Services)
      - `description` (text) - Detailed description of the service
      - `documents_required` (text[]) - Array of required documents
      - `procedure_steps` (text[]) - Array of step-by-step procedure
      - `fees` (text) - Fee information
      - `processing_time` (text) - Expected processing time
      - `notes` (text) - Important notes or tips
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `services` table
    - Add policy for public users to read all services
    - Add policy for authenticated admin users to insert, update, and delete services
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  documents_required text[] DEFAULT '{}',
  procedure_steps text[] DEFAULT '{}',
  fees text DEFAULT '',
  processing_time text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON services
  FOR DELETE
  TO authenticated
  USING (true);