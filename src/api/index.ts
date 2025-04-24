import axios from 'axios';
import { Parcel, Courier } from '../types';

const API_URL = 'https://9c54-2601-18f-687-72f0-b159-2473-9d0d-a242.ngrok-free.app'
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const trackParcel = async (trackingNumber: string): Promise<Parcel> => {
  const response = await api.get(`/parcels/track/${trackingNumber}`);
  return response.data.parcel;
};

export const createParcel = async (parcelData: any) => {
  const response = await api.post('/parcels', parcelData);
  return response.data;
};

export const assignCourier = async (trackingNumber: string, courierId: string) => {
  const response = await api.post(`/parcels/${trackingNumber}/assign-courier`, {
    courier_id: courierId
  });
  return response.data;
};

export const addTrackingUpdate = async (
  trackingNumber: string,
  updateData: {
    status: string;
    note: string;
  }
) => {
  const response = await api.post(`/parcels/${trackingNumber}/update`, updateData);
  return response.data;
};

export const getAvailableCouriers = async (): Promise<Record<string, Courier>> => {
  const response = await api.get('/couriers');
  return response.data.couriers;
};