import { Parcel } from './types';

export const demoParcels: Parcel[] = [
  {
    tracking_number: 'TRKDEMO001',
    sender: {
      name: 'Alice Sender',
      email: 'alice.sender@example.com',
      phone: '555-1111',
      address: '123 Sender Lane',
    },
    recipient: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      phone: '555-1234',
      address: '123 Main St',
    },
    courier_id: 'CR001',
    courier_name: 'John Doe',
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
      name: 'Bob Sender',
      email: 'bob.sender@example.com',
      phone: '555-2222',
      address: '456 Sender Ave',
    },
    recipient: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '555-5678',
      address: '456 Market St',
    },
    courier_id: 'CR002',
    courier_name: 'Jane Smith',
    status: 'delivered',
    estimated_delivery: '2025-05-07T18:00:00Z',
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
