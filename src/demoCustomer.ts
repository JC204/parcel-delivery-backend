// src/demoCustomers.ts
import { Customer } from './types';

export const demoCustomers: (Customer & { customerId: string; password: string })[] = [
  {
    customerId: 'CUST001',
    password: 'john123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-1234',
    address: '123 Main St',
  },
  {
    customerId: 'CUST002',
    password: 'jane123',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-5678',
    address: '456 Maple Ave',
  },
  {
    customerId: 'CUST003',
    password: 'alice123',
    name: 'Alice Sender',
    email: 'alice@example.com',
    phone: '555-8765',
    address: '789 Sender Blvd',
  },
  {
    customerId: 'CUST004',
    password: 'bob123',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '555-4321',
    address: '321 Receiver Rd',
  }
];
