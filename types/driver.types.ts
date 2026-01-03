// Driver License Status
export type LicenseStatus = "Valid" | "Expired" | "Suspended" | "Pending Verification";

// Driver Availability Status
export type AvailabilityStatus = "Available" | "On Duty" | "Off Duty" | "On Leave";

// Driver Profile
export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiry: string; // ISO 8601 date
  licenseStatus: LicenseStatus;
  licenseVerifiedAt: string | null;
  yearsOfExperience: number;
  emergencyContact: string;
  emergencyContactPhone: string;
  availabilityStatus: AvailabilityStatus;
  totalRides: number;
  totalDistance: number;
  averageRating: number;
  totalRatings: number;
  lastWorkingDate: string | null;
  documentVerified: boolean;
  backgroundCheckDone: boolean;
  backgroundCheckDate: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    status: string;
  };
  assignedVehicles?: {
    id: string;
    plate: string;
    type: string;
    model: string;
  }[];
}

// Create Driver DTO
export interface CreateDriverDto {
  licenseNumber: string;
  licenseExpiry: string;
  licenseStatus: LicenseStatus;
  yearsOfExperience: number;
  emergencyContact: string;
  emergencyContactPhone: string;
  availabilityStatus: AvailabilityStatus;
  documentVerified: boolean;
  backgroundCheckDone: boolean;
}

// Update Driver DTO
export interface UpdateDriverDto {
  licenseNumber?: string;
  licenseExpiry?: string;
  licenseStatus?: LicenseStatus;
  yearsOfExperience?: number;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  availabilityStatus?: AvailabilityStatus;
  documentVerified?: boolean;
  backgroundCheckDone?: boolean;
}

// Driving Record
export interface DrivingRecord {
  id: string;
  driverId: string;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  distance: number; // integer
  fuelUsed: number;
  notes: string;
  createdAt: string;
}

// Create Driving Record DTO
export interface CreateDrivingRecordDto {
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  distance: number; // integer
  fuelUsed: number;
  notes: string;
}

// Driver Rating
export interface DriverRating {
  id: string;
  driverId: string;
  rating: number; // 0-5
  comment: string;
  ratedBy: string;
  createdAt: string;
}

// Create Driver Rating DTO
export interface CreateDriverRatingDto {
  rating: number; // 0-5
  comment: string;
  ratedBy: string;
}

// API Response Types
export interface GetDriversResponse {
  ok: boolean;
  data: {
    data: Driver[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    };
  };
}

export interface GetDriverResponse {
  ok: boolean;
  data: Driver;
}

export interface CreateDriverResponse {
  ok: boolean;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      role: string;
      status: string;
      emailVerified: boolean;
      createdAt: string;
    };
    driver: {
      id: string;
      userId: string;
      licenseNumber: string;
      licenseExpiry: string;
      licenseStatus: LicenseStatus;
      yearsOfExperience: number;
      emergencyContact: string;
      emergencyContactPhone: string;
      availabilityStatus: AvailabilityStatus;
      documentVerified: boolean;
      backgroundCheckDone: boolean;
      backgroundCheckDate: string | null;
      updatedAt: string;
    };
  };
}

export interface UpdateDriverResponse {
  ok: boolean;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      role: string;
      status: string;
      emailVerified: boolean;
      createdAt: string;
    };
    driver: {
      id: string;
      userId: string;
      licenseNumber: string;
      licenseExpiry: string;
      licenseStatus: LicenseStatus;
      yearsOfExperience: number;
      emergencyContact: string;
      emergencyContactPhone: string;
      availabilityStatus: AvailabilityStatus;
      documentVerified: boolean;
      backgroundCheckDone: boolean;
      backgroundCheckDate: string | null;
      updatedAt: string;
    };
  };
}

export interface GetDrivingRecordsResponse {
  ok: boolean;
  data: {
    data: DrivingRecord[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    };
  };
}

export interface GetDriverRatingsResponse {
  ok: boolean;
  data: {
    data: DriverRating[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    };
  };
}

// Query Params
export interface GetDriversParams {
  page?: number;
  pageSize?: number;
  licenseStatus?: LicenseStatus;
  availabilityStatus?: AvailabilityStatus;
  search?: string;
}
