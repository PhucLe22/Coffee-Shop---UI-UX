export interface Option {
  id: string;
  name: string;
  basePrice: number;
  sortOrder: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OptionGroup {
  id: string;
  name: string;
  isRequired: boolean;
  isMultiple: boolean;
  sortOrder: number;
  isActive: boolean;
  options: Option[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OptionGroupValue {
  optionId: string;
  price: number;
}

export interface UpdateProductOptionGroupPayload {
  sortOrder: number;
  optionValues: OptionGroupValue[];
}
