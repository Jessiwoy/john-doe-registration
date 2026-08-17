// registrationService.ts
import type { ClientRegistrationFormData } from '../schemas/clientRegistrationSchema';
import type { Color } from '../types/color';
import { api } from './api';

export async function getColors() {
  const response = await api.get<Color[]>('/colors');

  return response.data;
}

export async function createClient(data: ClientRegistrationFormData) {
  await api.post('/clients', data);
}
