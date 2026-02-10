import type {
  Field,
  CreateFieldInput,
  UpdateFieldInput,
  AvailabilitySlot,
  CreateAvailabilitySlotInput,
  WeekAvailabilityResponse,
} from './types';

export class ApiClient {
  constructor(private baseUrl: string) {}

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `API error: ${res.status}`);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
  }

  // Fields
  getFields(): Promise<Field[]> {
    return this.request('/api/fields');
  }

  getField(id: number): Promise<Field> {
    return this.request(`/api/fields/${id}`);
  }

  createField(input: CreateFieldInput): Promise<Field> {
    return this.request('/api/fields', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  updateField(id: number, input: UpdateFieldInput): Promise<Field> {
    return this.request(`/api/fields/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  }

  deleteField(id: number): Promise<void> {
    return this.request(`/api/fields/${id}`, { method: 'DELETE' });
  }

  // Availability
  getAvailability(fieldId: number): Promise<AvailabilitySlot[]> {
    return this.request(`/api/fields/${fieldId}/availability`);
  }

  createAvailabilitySlot(fieldId: number, input: CreateAvailabilitySlotInput): Promise<AvailabilitySlot> {
    return this.request(`/api/fields/${fieldId}/availability`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  deleteAvailabilitySlot(slotId: number): Promise<void> {
    return this.request(`/api/availability/${slotId}`, { method: 'DELETE' });
  }

  getWeekAvailability(date: string): Promise<WeekAvailabilityResponse> {
    return this.request(`/api/availability/week?date=${date}`);
  }
}
