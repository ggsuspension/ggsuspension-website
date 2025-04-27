export interface DecodedToken {
  geraiId: number;
  role: string;
  [key: string]: any;
}

export interface DailyTrendData {
  date: string;
  gerai: string;
  netRevenue: number;
}

export interface RevenueData {
  date: string;
  total: number;
  gerai: string;
}

export interface GeraiData {
  name: string;
  totalRevenue: number;
  lastDayRevenue?: number;
  previousDayRevenue?: number;
  percentageChange?: number;
}

export interface ExpenseCategory {
  id: number;
  name: string;
}

export interface StockRequest {
  id: number;
  gerai_id: number;
  warehouse_seal_id: number;
  qty_requested: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string | null;
  updated_at: string | null;
  approved_at?: string | null;
  rejected_at?: string | null;
  warehouse_seal?: {
    id: number;
    cc_range: string;
    price: number;
    qty: number;
    motor_id: number;
    created_at: string;
    updated_at: string;
    motor?: {
      id: number;
      name: string;
    };
  };
  gerai?: {
    id: number;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
  };
}

export interface Category {
  id: number;
  name: string;
}

export interface Subcategory {
  id: number;
  name: string;
  category_id?: number;
  category?: { id: number; name: string };
}

export interface MotorPart {
  id: number;
  service: string;
  price: number;
  subcategory: {
    id: number;
    name: string;
    category: Category;
  };
  motors?: string[];
  orders?: { id: number; nama: string }[];
}

export interface Motor {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Gerai {
  id: number;
  name: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Seal {
  id: number;
  cc_range: string;
  price: number;
  qty: number;
  gerai_id: number;
  motor_id: number;
  created_at?: string;
  updated_at?: string;
  motor?: {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
  };
  gerai?: Gerai;
}

export interface ServiceOrderPayload {
  id?: number;
  nama: string;
  no_wa: string;
  plat: string;
  gerai_id: number;
  motor_id: number;
  motor_part_id: number;
  seal_ids: number[];
  total_harga: number;
  waktu: string;
  status: "PROGRESS" | "FINISHED" | "CANCELLED";
  info?: string;
  sumber_info?: string;
  warranty_claimed: boolean;
  layanan?: string;
  subcategory?: string;
  motor?: string;
  bagian_motor?: string;
  harga_layanan?: number;
  harga_seal?: number;
  seal?: string;
  motor_name?: string;
}

export interface Antrian {
  id: number;
  waktu: string;
  geraiId: number;
  totalHarga: number;
  status: "PROGRESS" | "FINISHED" | "CANCELLED";
  createdAt: string;
  updatedAt?: string;
  nama?: string;
  plat?: string;
  noWA?: string;
  gerai: {
    id: number;
    name: string;
    location?: string;
    created_at?: string;
    updated_at?: string;
  };
  motor?: {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
  };
  motorPart?: {
    id: number;
    service: string;
    price: number;
    subcategoryId: number;
    subcategory: {
      id: number;
      name: string;
      categoryId: number;
      category: { id: number; name: string };
    };
  };
  seals?: {
    orderId: number;
    sealId: number;
    seal: {
      id: number;
      ccRange: string; // Sesuaikan dengan data API
      price: number;
      qty: number;
    };
  }[];
  customer?: {
    nama?: string;
    plat?: string;
    no_wa?: string;
    layanan?: string;
    subcategory?: string;
    motor?: string;
    bagian_motor?: string;
    harga_layanan?: number;
    harga_seal?: number;
    total_harga?: number;
  };
}

export interface TransformedAntrian {
  id: number;
  nama: string;
  plat: string;
  no_wa: string;
  layanan: string;
  subcategory: string;
  motor: string;
  bagianMotor: string;
  hargaLayanan: number;
  hargaSeal: number;
  totalHarga: number;
  status: "PROGRESS" | "FINISHED" | "CANCELLED";
  waktu: string;
  gerai: string;
}

export interface GroupedAntrian {
  id: number;
  gerai: string;
  status: "PROGRESS" | "FINISHED" | "CANCELLED";
  data: TransformedAntrian[];
}

export interface WarehouseSeal {
  id: number;
  cc_range: string;
  price: number;
  qty: number;
  motor_id: number;
  created_at: string;
  updated_at: string;
  motor?: Motor;
  gerai_id?: number;
}

export interface CreateSealPayload {
  motor_id: number;
  cc_range: string;
  price: number;
  qty: number;
}
