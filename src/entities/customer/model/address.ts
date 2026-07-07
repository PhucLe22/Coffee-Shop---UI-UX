export interface Address {
  id: string;
  receiverName: string;
  receiverPhone: string;
  addressLine: string;
  lat: number;
  lng: number;
  isDefault: boolean;
  label: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressBody {
  receiverName: string;
  receiverPhone: string;
  addressLine: string;
  label: string;
  isDefault?: boolean;
}

export interface UpdateAddressBody {
  receiverName?: string;
  receiverPhone?: string;
  addressLine?: string;
  label?: string;
  isDefault?: boolean;
}
