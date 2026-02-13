export type FieldType = 'soccer' | 'baseball' | 'football' | 'multi-purpose' | 'tennis' | 'basketball';

export type Surface = 'grass' | 'turf' | 'dirt' | 'clay' | 'hardcourt';

export interface Field {
  id: number;
  name: string;
  field_type: FieldType;
  surface: Surface | null;
  location: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFieldInput {
  name: string;
  field_type: FieldType;
  surface?: Surface | null;
  location?: string | null;
}

export type UpdateFieldInput = Partial<CreateFieldInput>;
