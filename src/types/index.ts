// types.ts

// Customer structure
export interface Customer {
  customerId?: number | string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: string; //
}

// Courier details
export interface Courier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

// A single tracking update in the parcel's history
export interface TrackingUpdate {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

// Parcel object
export interface Parcel {
  tracking_number: string;
  sender: Customer;
  recipient: Customer;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  service_type?: string;
  tracking_history?: TrackingUpdate[];
  courier_id?: string;
  courier_name?: string;
  estimated_delivery?: string;
  status?: string;
}

// Response structure after creating a parcel
export interface ParcelCreationResponse {
  parcel: Parcel;
  success: boolean;
  message?: string;
}

// Courier login/auth response
export interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    name: string;
    role: string;
  };
  success: boolean;
  message?: string;
}