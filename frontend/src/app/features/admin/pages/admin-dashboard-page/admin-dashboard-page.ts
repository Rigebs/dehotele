import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface Reservation {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  status: 'Confirmed' | 'Pending' | 'Canceled';
  amount: number;
}

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [CommonModule],
  templateUrl: './admin-dashboard-page.html',
  styleUrls: ['./admin-dashboard-page.css'],
})
export class AdminDashboardPage {
  router = inject(Router);

  stats = [
    { label: 'Reservas Totales', value: '1,284', icon: 'calendar', color: '#3b82f6' },
    { label: 'Ingresos Mensuales', value: '$12,450', icon: 'money', color: '#10b981' },
    { label: 'Habitaciones Libres', value: '12', icon: 'bed', color: '#f59e0b' },
    { label: 'Check-ins Hoy', value: '8', icon: 'key', color: '#8b5cf6' },
  ];

  recentReservations: Reservation[] = [
    {
      id: '001',
      guest: 'Alexander Pierce',
      room: 'Suite 404',
      checkIn: '2023-10-25',
      status: 'Confirmed',
      amount: 250,
    },
    {
      id: '002',
      guest: 'Elena Rodriguez',
      room: 'Doble 102',
      checkIn: '2023-10-26',
      status: 'Pending',
      amount: 120,
    },
    {
      id: '003',
      guest: 'John Smith',
      room: 'Single 201',
      checkIn: '2023-10-27',
      status: 'Confirmed',
      amount: 85,
    },
    {
      id: '004',
      guest: 'Maria Garcia',
      room: 'Suite 405',
      checkIn: '2023-10-28',
      status: 'Canceled',
      amount: 300,
    },
  ];

  goToDetail(reservationId: string) {
    console.log('Navegando a la reserva:', reservationId);
    this.router.navigate(['/admin/reservations', reservationId]);
  }

  getStatusClass(status: Reservation['status']): string {
    const classes: Record<Reservation['status'], string> = {
      Confirmed: 'status-confirmed',
      Pending: 'status-pending',
      Canceled: 'status-canceled',
    };
    return classes[status];
  }
}
