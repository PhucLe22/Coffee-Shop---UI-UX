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
  lat?: number;
  lng?: number;
  label: string;
  isDefault?: boolean;
}

export interface UpdateAddressBody {
  receiverName?: string;
  receiverPhone?: string;
  addressLine?: string;
  lat?: number;
  lng?: number;
  label?: string;
  isDefault?: boolean;
}

export interface AddressAutocompleteItem {
  formatted: string;
  address_line1: string;
  address_line2: string;
  street: string | null;
  housenumber: string | null;
  city: string;
  state: string | null;
  postcode: string | null;
  country: string;
  lat: number;
  lon: number;
  result_type: string;
  rank: {
    confidence: number;
    confidence_city_level: number;
  };
}

export interface AddressAutocompleteQuery {
  text: string;
  limit?: number;
}
