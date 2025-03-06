export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ExclusionFormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  documentType: string;
  identificationNumber: string;
  address: Address;
}

export type ExclusionStatus = 'clear' | 'excluded' | 'warning';

export interface DatabaseResult {
  databaseId: string;
  databaseName: string;
  searchDate: string;
  searchUrl: string;
  status: ExclusionStatus;
  details: string;
  referenceId?: string;
}

export interface ExclusionResult {
  resultId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  identificationNumber: string;
  documentType: string;
  email: string;
  address?: Address;
  status: ExclusionStatus;
  message: string;
  checkDate: string;
  listFound?: string;
  databaseResults: DatabaseResult[];
}
