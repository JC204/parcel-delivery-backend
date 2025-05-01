import { Parcel, TrackingUpdate, Courier } from '../types';

// Will be replaced by deploy-all.sh — must use double quotes
export const API_URL = "https://2fb5-2603-3005-2b2c-a680-ccd2-f95-e23c-47fd.ngrok-free.app";

export async function trackParcel(trackingNumber: string): Promise<Parcel> {
  const res = await fetch(`${API_URL}/parcels/track/${trackingNumber}`);
  if (!res.ok) throw new Error("Failed to fetch tracking information");
  return res.json();
}

export async function submitParcel(
  parcelData: Omit<Parcel, 'tracking_number' | 'tracking_history'>
): Promise<Parcel> {
  const res = await fetch(`${API_URL}/parcels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parcelData),
  });
  if (!res.ok) throw new Error("Failed to submit parcel");
  return res.json();
}

export async function getCouriers(): Promise<Courier[]> {
  const res = await fetch(`${API_URL}/couriers`);
  if (!res.ok) throw new Error("Failed to fetch couriers");
  return res.json();
}

export async function getParcelsByCourier(courierId: string): Promise<Parcel[]> {
  const res = await fetch(`${API_URL}/couriers/${courierId}/parcels`);
  if (!res.ok) throw new Error("Failed to fetch courier parcels");
  return res.json();
}

export async function updateParcelStatus(
  trackingNumber: string,
  update: TrackingUpdate
): Promise<Parcel> {
  const res = await fetch(`${API_URL}/parcels/${trackingNumber}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  if (!res.ok) throw new Error("Failed to update parcel status");
  return res.json();
}

export async function createTestParcel(): Promise<Parcel> {
  const res = await fetch(`${API_URL}/test/create-parcel`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to create test parcel");
  return res.json();
}