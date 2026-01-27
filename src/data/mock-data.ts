import { User, PriceStructure, KGType } from '../types';

export const mockUsers: User[] = [
  { id: '1', username: 'admin', password: 'admin123', name: 'Administrator' },
  { id: '2', username: 'sales1', password: 'sales123', name: 'Sales Staff 1' },
  { id: '3', username: 'sales2', password: 'sales456', name: 'Sales Staff 2' },
  { id: '4', username: 'manager', password: 'manager789', name: 'Store Manager' },
];

export const priceStructure: PriceStructure = {
  domestic: 1200,
  eatery: 1150,
  dealers: 1100,
  others: 1250,
};

export const kgTypes: KGType[] = [
  { type: '1KG', weight: 1 },
  { type: '3KG', weight: 3 },
  { type: '5KG', weight: 5 },
  { type: '6KG', weight: 6 },
  { type: '10KG', weight: 10 },
  { type: '12.5KG', weight: 12.5 },
  { type: '15KG', weight: 15 },
  { type: '25KG', weight: 25 },
  { type: '50KG', weight: 50 },
];