export type VehicleStatus = "Active" | "Idle" | "In Maintenance" | "Decommissioned";
export type VehicleType = "Truck" | "Van" | "Car" | "Bike";

export interface Vehicle {
  id: string;
  plate: string;
  type: VehicleType;
  model: string;
  year: number;
  status: VehicleStatus;
  mileage: number; // in km - integer
  fuelEfficiency: number; // km/L - integer
  lastService: string;
  nextPredictedMaintenance: string;
  assignedDriver: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  healthScore: number; // 0-100
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVehicleDto {
  plate: string;
  type: VehicleType;
  model: string;
  year: number;
  status?: VehicleStatus;
  mileage: number; // integer
  fuelEfficiency: number; // integer
  lastService: string;
  nextPredictedMaintenance: string;
  assignedDriverId: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  healthScore: number;
}

export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {}

export const vehiclesData: Vehicle[] = [
  {
    id: "1",
    plate: "ABC-1234",
    type: "Truck",
    model: "Ford F-150",
    year: 2021,
    status: "Active",
    mileage: 45200,
    fuelEfficiency: 12.5,
    lastService: "2025-10-10",
    nextPredictedMaintenance: "2025-12-15",
    assignedDriver: "John Doe",
    insuranceExpiry: "2026-01-15",
    fitnessExpiry: "2026-03-10",
    healthScore: 92,
  },
  {
    id: "2",
    plate: "XYZ-5678",
    type: "Van",
    model: "Mercedes-Benz Sprinter",
    year: 2022,
    status: "Active",
    mileage: 28400,
    fuelEfficiency: 14.2,
    lastService: "2025-09-05",
    nextPredictedMaintenance: "2026-01-20",
    assignedDriver: "Jane Smith",
    insuranceExpiry: "2026-05-22",
    fitnessExpiry: "2026-06-15",
    healthScore: 88,
  },
  {
    id: "3",
    plate: "LMN-9012",
    type: "Car",
    model: "Toyota Corolla Hybrid",
    year: 2023,
    status: "Idle",
    mileage: 15600,
    fuelEfficiency: 22.5,
    lastService: "2025-11-01",
    nextPredictedMaintenance: "2026-04-10",
    assignedDriver: "Mike Johnson",
    insuranceExpiry: "2026-08-30",
    fitnessExpiry: "2026-09-01",
    healthScore: 98,
  },
  {
    id: "4",
    plate: "TRK-8821",
    type: "Truck",
    model: "Volvo FH16",
    year: 2020,
    status: "In Maintenance",
    mileage: 120500,
    fuelEfficiency: 6.5,
    lastService: "2025-08-15",
    nextPredictedMaintenance: "2025-11-20",
    assignedDriver: "Robert Brown",
    insuranceExpiry: "2025-12-31",
    fitnessExpiry: "2026-01-15",
    healthScore: 65,
  },
  {
    id: "5",
    plate: "BIK-4433",
    type: "Bike",
    model: "Honda PCX",
    year: 2022,
    status: "Active",
    mileage: 8900,
    fuelEfficiency: 45.0,
    lastService: "2025-10-20",
    nextPredictedMaintenance: "2026-02-05",
    assignedDriver: "Sarah Davis",
    insuranceExpiry: "2026-07-10",
    fitnessExpiry: "2026-07-20",
    healthScore: 94,
  },
  {
    id: "6",
    plate: "VAN-3321",
    type: "Van",
    model: "Ford Transit",
    year: 2021,
    status: "Active",
    mileage: 56700,
    fuelEfficiency: 11.8,
    lastService: "2025-09-25",
    nextPredictedMaintenance: "2026-01-05",
    assignedDriver: "David Wilson",
    insuranceExpiry: "2026-03-15",
    fitnessExpiry: "2026-04-01",
    healthScore: 85,
  },
  {
    id: "7",
    plate: "CAR-7765",
    type: "Car",
    model: "Hyundai Ioniq 5",
    year: 2024,
    status: "Active",
    mileage: 5200,
    fuelEfficiency: 0,
    lastService: "2025-06-10",
    nextPredictedMaintenance: "2026-06-10",
    assignedDriver: "Emily White",
    insuranceExpiry: "2027-01-01",
    fitnessExpiry: "2027-01-15",
    healthScore: 99,
  },
  {
    id: "8",
    plate: "TRK-9988",
    type: "Truck",
    model: "Scania R500",
    year: 2019,
    status: "Decommissioned",
    mileage: 350000,
    fuelEfficiency: 5.8,
    lastService: "2025-01-10",
    nextPredictedMaintenance: "N/A",
    assignedDriver: "N/A",
    insuranceExpiry: "Expired",
    fitnessExpiry: "Expired",
    healthScore: 20,
  },
  {
    id: "9",
    plate: "VAN-1122",
    type: "Van",
    model: "Renault Master",
    year: 2020,
    status: "In Maintenance",
    mileage: 98000,
    fuelEfficiency: 10.5,
    lastService: "2025-11-25",
    nextPredictedMaintenance: "2025-12-05",
    assignedDriver: "Tom Clark",
    insuranceExpiry: "2026-02-28",
    fitnessExpiry: "2026-03-15",
    healthScore: 55,
  },
  {
    id: "10",
    plate: "BIK-9900",
    type: "Bike",
    model: "Yamaha NMAX",
    year: 2023,
    status: "Active",
    mileage: 4300,
    fuelEfficiency: 42.0,
    lastService: "2025-08-05",
    nextPredictedMaintenance: "2025-12-20",
    assignedDriver: "Lisa Taylor",
    insuranceExpiry: "2026-09-15",
    fitnessExpiry: "2026-09-30",
    healthScore: 96,
  },
  {
    id: "11",
    plate: "CAR-5544",
    type: "Car",
    model: "Tesla Model 3",
    year: 2022,
    status: "Active",
    mileage: 32000,
    fuelEfficiency: 0,
    lastService: "2025-07-20",
    nextPredictedMaintenance: "2026-01-15",
    assignedDriver: "James Anderson",
    insuranceExpiry: "2026-05-10",
    fitnessExpiry: "2026-05-25",
    healthScore: 95,
  },
  {
    id: "12",
    plate: "TRK-2233",
    type: "Truck",
    model: "Mercedes-Benz Actros",
    year: 2021,
    status: "Active",
    mileage: 67000,
    fuelEfficiency: 7.2,
    lastService: "2025-09-30",
    nextPredictedMaintenance: "2026-01-30",
    assignedDriver: "William Martinez",
    insuranceExpiry: "2026-04-20",
    fitnessExpiry: "2026-05-05",
    healthScore: 89,
  },
  {
    id: "13",
    plate: "VAN-6677",
    type: "Van",
    model: "Volkswagen Crafter",
    year: 2022,
    status: "Idle",
    mileage: 21000,
    fuelEfficiency: 12.0,
    lastService: "2025-10-15",
    nextPredictedMaintenance: "2026-03-01",
    assignedDriver: "Karen Robinson",
    insuranceExpiry: "2026-08-15",
    fitnessExpiry: "2026-09-01",
    healthScore: 91,
  },
  {
    id: "14",
    plate: "BIK-7788",
    type: "Bike",
    model: "Suzuki Burgman",
    year: 2021,
    status: "Active",
    mileage: 15600,
    fuelEfficiency: 40.5,
    lastService: "2025-09-10",
    nextPredictedMaintenance: "2026-01-05",
    assignedDriver: "Daniel Garcia",
    insuranceExpiry: "2026-03-25",
    fitnessExpiry: "2026-04-10",
    healthScore: 87,
  },
  {
    id: "15",
    plate: "CAR-3399",
    type: "Car",
    model: "Honda Civic",
    year: 2020,
    status: "In Maintenance",
    mileage: 48000,
    fuelEfficiency: 15.5,
    lastService: "2025-11-28",
    nextPredictedMaintenance: "2026-02-15",
    assignedDriver: "Sophia Rodriguez",
    insuranceExpiry: "2026-01-20",
    fitnessExpiry: "2026-02-05",
    healthScore: 72,
  },
];
