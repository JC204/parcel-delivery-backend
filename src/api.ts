import { Parcel } from './types';
import { demoParcels } from './demoParcels';

export const trackParcel = async (trackingNumber: string): Promise<Parcel | null> => {
  return demoParcels.find((p: Parcel) => p.tracking_number === trackingNumber) || null;
};

export const submitParcel = async (parcelData: any): Promise<Parcel> => {
  const newParcel: Parcel = {
    ...parcelData,
    tracking_number: 'DEMO' + Math.floor(Math.random() * 100000),
    courier_id: 1,
    courier_name: 'Demo Courier',
    status: 'Created',
    estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    tracking_history: [
      {
        status: 'Created',
        location: 'System',
        timestamp: new Date().toISOString(),
        description: 'Parcel created and assigned to demo courier.',
      },
    ],
  };

  demoParcels.push(newParcel);
  return newParcel;
};
