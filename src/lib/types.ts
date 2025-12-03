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
  items: {
    menuItemId: string;
    quantity: number;
    name: string;
  }[];
  total: number;
  orderDate: Date;
  pickupDate: Date;
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
