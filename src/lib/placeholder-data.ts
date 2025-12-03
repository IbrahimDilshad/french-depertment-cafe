import type { MenuItem, PreOrder, Sale, ClassSale } from './types';

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Croissant',
    description: 'Flaky, buttery, and freshly baked.',
    price: 2.5,
    availability: 'In Stock',
    stock: 50,
    imageId: 'croissant',
  },
  {
    id: '2',
    name: 'Pain au Chocolat',
    description: 'A classic French pastry with dark chocolate.',
    price: 3.0,
    availability: 'In Stock',
    stock: 40,
    imageId: 'pain-chocolat',
  },
  {
    id: '3',
    name: 'Espresso',
    description: 'A strong and aromatic shot of coffee.',
    price: 2.0,
    availability: 'In Stock',
    stock: 100,
    imageId: 'espresso',
  },
  {
    id: '4',
    name: 'Chocolat Chaud',
    description: 'Rich and creamy hot chocolate.',
    price: 3.5,
    availability: 'Sold Out',
    stock: 0,
    imageId: 'chocolat-chaud',
  },
  {
    id: '5',
    name: 'Jus d\'orange',
    description: 'Freshly squeezed orange juice.',
    price: 3.0,
    availability: 'In Stock',
    stock: 30,
    imageId: 'jus-orange',
  },
  {
    id: '6',
    name: 'Madeleine',
    description: 'A small, delicate shell-shaped cake.',
    price: 1.5,
    availability: 'In Stock',
    stock: 60,
    imageId: 'madeleine',
  },
  {
    id: '7',
    name: 'Macaron',
    description: 'Assortment of colorful French macarons.',
    price: 2.0,
    availability: 'In Stock',
    stock: 80,
    imageId: 'macaron',
  },
  {
    id: '8',
    name: 'Café Latte',
    description: 'Espresso with steamed milk and a light foam.',
    price: 3.75,
    availability: 'In Stock',
    stock: 45,
    imageId: 'cafe-latte',
  },
];

export const preOrders: PreOrder[] = [
  {
    id: 'po1',
    studentName: 'Alice',
    studentClass: 'Grade 10',
    items: [{ menuItemId: '1', quantity: 2, name: 'Croissant' }],
    total: 5.0,
    orderDate: new Date('2023-10-25T10:00:00Z'),
    pickupDate: new Date('2023-10-26T08:00:00Z'),
    status: 'Ready',
  },
  {
    id: 'po2',
    studentName: 'Bob',
    studentClass: 'Grade 11',
    items: [
      { menuItemId: '2', quantity: 1, name: 'Pain au Chocolat' },
      { menuItemId: '5', quantity: 1, name: 'Jus d\'orange' },
    ],
    total: 6.0,
    orderDate: new Date('2023-10-25T11:30:00Z'),
    pickupDate: new Date('2023-10-26T08:00:00Z'),
    status: 'Pending',
  },
];

export const sales: Sale[] = [
  { id: 's1', itemId: '1', itemName: 'Croissant', quantity: 20, price: 50.0, timestamp: new Date('2023-10-24T09:00:00Z'), volunteerId: 'v1' },
  { id: 's2', itemId: '2', itemName: 'Pain au Chocolat', quantity: 15, price: 45.0, timestamp: new Date('2023-10-24T10:00:00Z'), volunteerId: 'v2' },
  { id: 's3', itemId: '3', itemName: 'Espresso', quantity: 30, price: 60.0, timestamp: new Date('2023-10-23T09:30:00Z'), volunteerId: 'v1' },
  { id: 's4', itemId: '6', itemName: 'Madeleine', quantity: 40, price: 60.0, timestamp: new Date('2023-10-22T09:00:00Z'), volunteerId: 'v1' },
];

export const dailyRevenue = [
  { date: 'Mon', revenue: 150 },
  { date: 'Tue', revenue: 220 },
  { date: 'Wed', revenue: 180 },
  { date: 'Thu', revenue: 250 },
  { date: 'Fri', revenue: 300 },
];

export const popularItems = [
  { name: 'Madeleine', count: 40 },
  { name: 'Espresso', count: 30 },
  { name: 'Croissant', count: 20 },
  { name: 'Pain au Chocolat', count: 15 },
  { name: 'Jus d\'orange', count: 10 },
];

export const classSales: ClassSale[] = [
  { class: 'Grade 9', sales: 450 },
  { class: 'Grade 10', sales: 620 },
  { class: 'Grade 11', sales: 550 },
  { class: 'Grade 12', sales: 300 },
  { class: 'Staff', sales: 200 },
];

export const volunteers = [
  { id: 'v1', name: 'Charles', assignedStock: ['1', '3', '6'] },
  { id: 'v2', name: 'Sophie', assignedStock: ['2', '5', '7', '8'] },
];
