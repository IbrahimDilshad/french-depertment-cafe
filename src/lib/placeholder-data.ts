import type { MenuItem, PreOrder, Sale, ClassSale } from './types';

export const menuItems: MenuItem[] = [];
export const preOrders: PreOrder[] = [];
export const sales: Sale[] = [];
export const dailyRevenue: { date: string, revenue: number }[] = [];
export const popularItems: { name: string, count: number }[] = [];
export const classSales: ClassSale[] = [];
export const volunteers: { id: string; name: string; assignedStock: string[] }[] = [];
