import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminRoomService } from '../../../services/admin-room-service';
import { Select } from '../../../../../shared/ui/select/select';

@Component({
  selector: 'app-admin-room-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Select],
  templateUrl: './admin-room-form-page.html',
  styleUrl: './admin-room-form-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'admin-page-container',
  },
})
export class AdminRoomFormPage implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly adminRoomService = inject(AdminRoomService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  roomId = signal<number | null>(null);
  isEditMode = computed(() => !!this.roomId());

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  hotelId = signal<number | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    pricePerNight: [null as number | null, [Validators.required, Validators.min(1)]],
    capacity: [1, [Validators.required, Validators.min(1)]],
    hotelId: [0, [Validators.required]],
  });

  capacityOptions = [
    { label: '1 Persona (Sencilla)', value: 1 },
    { label: '2 Personas (Doble)', value: 2 },
    { label: '3 Personas (Triple)', value: 3 },
    { label: 'Familiar (4+)', value: 4 },
  ];

  ngOnInit(): void {
    const hId = this.route.snapshot.paramMap.get('hotelId');
    if (hId) {
      this.hotelId.set(Number(hId));
      this.form.patchValue({ hotelId: Number(hId) });
    }

    const rId = this.route.snapshot.paramMap.get('roomId');
    if (rId) {
      const numId = Number(rId);
      this.roomId.set(numId);
      this.loadRoomData(numId);
    }
  }

  loadRoomData(id: number): void {
    this.isLoading.set(true);
    this.adminRoomService.getById(id).subscribe({
      next: (room) => {
        this.form.patchValue(room); // Rellena el form con los datos que vienen del backend
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar la información de la habitación.');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading.set(true);

    const requestData = this.form.getRawValue();

    // Decidimos si llamar a create o update
    const obs$ = this.isEditMode()
      ? this.adminRoomService.update(this.roomId()!, requestData)
      : this.adminRoomService.create(requestData);

    obs$.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin/hotels', this.hotelId(), 'rooms']);
      },
      error: () => {
        this.errorMessage.set('Error al procesar la solicitud.');
        this.isLoading.set(false);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/hotels', this.hotelId(), 'rooms']);
  }
}
