import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardResponse } from '../../../../core/models/dashboard.model';
import { AdminDashboardService } from '../../services/admin-dashboard-service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-page.html',
  styleUrls: ['./admin-dashboard-page.css'],
})
export class AdminDashboardPage implements OnInit {
  stats?: DashboardResponse;
  loading = true;

  constructor(private dashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando dashboard', err);
        this.loading = false;
      },
    });
  }
}
