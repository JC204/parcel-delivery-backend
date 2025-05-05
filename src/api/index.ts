import { Parcel, TrackingUpdate, Courier } from '../types';

// Will be replaced by deploy-all.sh — must use double quotes
export const API_URL = import.meta.env.VITE_API_URL;

export async function trackParcel(trackingNumber: string): Promise<Parcel> {
  const res = await fetch(`${API_URL}/parcels/${trackingNumber}`);
  if (!res.ok) throw new Error("Failed to fetch tracking information");
   console.log("API_URL is:", API_URL);
  console.log("Tracking fetch URL:", `${API_URL}/track/${trackingNumber}`);
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
  const data: Parcel[] = await res.json(); // Explicitly cast to Parcel[]
  return data;
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

export async function loginCourier(courierId: string, password: string): Promise<Courier> {
  const res = await fetch(`${API_URL}/couriers/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courier_id: courierId, password }),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Login failed");
  }
  return res.json();
}


export async function createTestParcel(): Promise<Parcel> {
  const res = await fetch(`${API_URL}/test/create-parcel`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to create test parcel");
  return res.json();
}