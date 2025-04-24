// Customer information
export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Courier details
export interface Courier {
  id?: number;
  name: string;
  email?: string;
  phone: string;
  status: 'available' | 'assigned' | 'busy';
}

// Individual tracking update (history)
export interface TrackingUpdate {
  id?: number;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | string;
  note?: string;
  location?: string;
  timestamp?: string;
  description: string
}

// Main Parcel object used throughout app
export interface Parcel {
  id?: number;
  tracking_number: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered';
  sender: Customer;
  recipient: Customer;
  weight: number;
  description: string;
  created_at?: string;
  courier_id?: number;
  courier?: Courier;
  tracking_updates?: TrackingUpdate[]; // Used for full timeline/history view
  history?: TrackingUpdate[];         // Alias for old naming convention
}
