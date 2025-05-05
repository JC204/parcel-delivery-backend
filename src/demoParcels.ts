import { Parcel } from './types';

export const demoParcels: Parcel[] = [
  {
    tracking_number: 'TRKDEMO001',
    sender: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-1234',
      address: '123 Main St',
    },
    recipient: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '555-5678',
      address: '456 Maple Ave',
    },
    courier_id: 'CR001',
    courier_name: 'Courier A',
    status: 'in transit',
    estimated_delivery: '2025-05-07T16:00:00Z',
    tracking_history: [
      {
        status: 'shipped',
        location: 'Warehouse A',
        timestamp: '2025-05-04T08:00:00Z',
        description: 'Parcel has left the warehouse',
      }
    ]
  },
  {
    tracking_number: 'TRKDEMO002',
    sender: {
      name: 'Alice Sender',
      email: 'alice@example.com',
      phone: '555-8765',
      address: '789 Sender Blvd',
    },
    recipient: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '555-4321',
      address: '321 Receiver Rd',
    },
    courier_id: 'CR002',
    courier_name: 'Courier B',
    status: 'delivered',
    estimated_delivery: '2025-05-08T14:30:00Z',
    tracking_history: [
      {
        status: 'out for delivery',
        location: 'City Hub',
        timestamp: '2025-05-04T12:00:00Z',
        description: 'Parcel is out for delivery',
      }
    ]
  }
];
