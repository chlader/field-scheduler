export type FieldType = 'soccer' | 'baseball' | 'football' | 'multi-purpose' | 'tennis' | 'basketball';

export type Surface = 'grass' | 'turf' | 'dirt' | 'clay' | 'hardcourt';

export type Amenity = 'lights' | 'restrooms' | 'parking' | 'bleachers' | 'scoreboard' | 'concessions' | 'water_fountain';

export interface Field {
  id: number;
  name: string;
  field_type: FieldType;
  surface: Surface | null;
  location: string | null;
  amenities: Amenity[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFieldInput {
  name: string;
  field_type: FieldType;
  surface?: Surface | null;
  location?: string | null;
  amenities?: Amenity[];
}

export type UpdateFieldInput = Partial<CreateFieldInput>;
