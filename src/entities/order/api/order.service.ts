import { Order } from '../model/types';

export const orderMock: Order = {
  id: '8829-AC',
  orderNumber: '8829-AC',
  status: 'on_the_way',
  estimatedArrival: '12:45',
  estimatedArrivalText: 'Expected in 14 mins',
  driver: {
    name: 'Marco S.',
    phoneNumber: '+1 234 567 890',
  },
  items: [
    {
      id: '1',
      name: 'Single-Origin Espresso',
      quantity: 1,
      price: 4.50,
      options: ['OAT MILK', 'REGULAR'],
    },
    {
      id: '2',
      name: 'Artisan Sourdough Croissant',
      quantity: 1,
      price: 11.00,
      options: ['WARM', 'SALTED BUTTER'],
    },
  ],
  totalPrice: 15.50,
  createdAt: '2026-04-09T12:10:00Z',
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...orderMock, id });
    }, 500);
  });
};
