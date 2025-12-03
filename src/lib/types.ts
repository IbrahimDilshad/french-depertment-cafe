export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  availability: 'In Stock' | 'Sold Out';
  stock: number;
  imageId: string;
}

export interface PreOrder {
  id: string;
  studentName: string;
  studentClass: string;
  items: string; // Changed from array to simple string for easier input
  total?: number; // Made optional
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
  timestamp: Date;
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
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'admin' | 'volunteer';
}
