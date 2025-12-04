export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  availability: 'In Stock' | 'Sold Out';
  stock: number;
  imageId: string;
  isPreOrderOnly?: boolean;
}

export interface PreOrder {
  id: string;
  studentName: string;
  studentClass: string;
  items: Record<string, number>; // Storing item ID and quantity
  paymentScreenshotUrl: string;
  total?: number; // This can be calculated on the fly, but storing might be useful
  orderDate?: Date; // Made optional
  pickupDate: string; // Changed to string to match firestore
  status: 'Pending' | 'Ready' | 'Completed';
}


export interface Sale {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  timestamp: any;
  volunteerId: string;
}

export interface Volunteer {
  id: string;
  name: string;
  assignedStock: string[];
}

export interface ClassSale {
  class: string;
  sales: number;
}

export interface UserProfile {
  id:string;
  displayName: string;
  email: string;
  photoURL?: string;
  accessiblePages: string[];
}
