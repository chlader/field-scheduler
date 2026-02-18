export type FieldType = 'soccer' | 'baseball' | 'football' | 'multi-purpose' | 'tennis' | 'basketball' | 'softball' | 'lacrosse' | 'rugby' | 'cricket' | 'pickleball' | 'volleyball';

export type Surface = 'grass' | 'turf' | 'dirt' | 'clay' | 'hardcourt';

export interface Field {
  id: number;
  name: string;
  field_type: FieldType;
  surface: Surface | null;
  location: string | null;
  description: string | null;
  size: string | null;
  photo_url: string | null;
  has_lights: boolean;
  has_parking: boolean;
  is_indoor: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFieldInput {
  name: string;
  field_type: FieldType;
  surface?: Surface | null;
  location?: string | null;
  description?: string | null;
  size?: string | null;
  photo_url?: string | null;
  has_lights?: boolean;
  has_parking?: boolean;
  is_indoor?: boolean;
}

export type UpdateFieldInput = Partial<CreateFieldInput>;
