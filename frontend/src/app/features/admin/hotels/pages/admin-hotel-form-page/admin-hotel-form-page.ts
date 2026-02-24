import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Hotel } from '../../../../../core/models/hotel.model';
import { HotelService } from '../../../../hotels/services/hotel-service';
import { AdminHotelService, HotelRequest } from '../../../services/admin-hotel-service';
import { AdminUploadService } from '../../../services/admin-upload-service';
import { ToastService } from '../../../../../core/services/toast-service';

interface HotelForm {
  name: FormControl<string>;
  city: FormControl<string>;
  address: FormControl<string>;
  description: FormControl<string>;
  imageUrl: FormControl<string>;
  amenitiesInput: FormControl<string>;
}

@Component({
  selector: 'app-admin-hotel-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-hotel-form-page.html',
  styleUrl: './admin-hotel-form-page.css',
})
export class AdminHotelFormPage implements OnInit {
  hotelId?: number;
  isEdit = false;

  selectedFile?: File;
  imagePreview?: string;
  isUploading = false;
  isSaving = false;

  form!: FormGroup<HotelForm>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminHotelService: AdminHotelService,
    private hotelService: HotelService,
    private uploadService: AdminUploadService,
    private toastService: ToastService,
  ) {
    this.form = this.fb.group<HotelForm>({
      name: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.maxLength(150)],
      }),
      city: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      address: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      description: this.fb.nonNullable.control(''),
      imageUrl: this.fb.nonNullable.control(''),
      amenitiesInput: this.fb.nonNullable.control(''),
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.hotelId = Number(id);
      this.loadHotel(this.hotelId);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  confirmUpload(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;

    this.uploadService.uploadImage('hotels', this.selectedFile).subscribe({
      next: (res) => {
        this.form.patchValue({ imageUrl: res.url });
        this.toastService.show({ type: 'success', message: 'Imagen subida con éxito' });
        this.resetTempImageState();
      },
      error: () => {
        this.toastService.show({ type: 'error', message: 'Error al subir la imagen' });
        this.isUploading = false;
      },
      complete: () => {
        this.isUploading = false;
      },
    });
  }

  cancelUpload(): void {
    this.resetTempImageState();
  }

  private resetTempImageState(): void {
    this.selectedFile = undefined;
    this.imagePreview = undefined;
  }

  loadHotel(id: number): void {
    this.hotelService.getHotelById(id).subscribe({
      next: (hotel: Hotel) => {
        this.form.patchValue({
          name: hotel.name,
          city: hotel.city,
          address: hotel.address,
          description: hotel.description ?? '',
          imageUrl: hotel.imageUrl ?? '',
          amenitiesInput: hotel.amenities?.join(', ') ?? '',
        });
      },
      error: () => this.toastService.show({ type: 'error', message: 'No se pudo cargar el hotel' }),
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/hotels']);
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const value = this.form.getRawValue();

    const payload: HotelRequest = {
      name: value.name,
      city: value.city,
      address: value.address,
      description: value.description,
      imageUrl: value.imageUrl,
      amenities: value.amenitiesInput
        ? value.amenitiesInput.split(',').map((a: string) => a.trim())
        : [],
    };

    const request$ =
      this.isEdit && this.hotelId
        ? this.adminHotelService.update(this.hotelId, payload)
        : this.adminHotelService.create(payload);

    request$.subscribe({
      next: () => {
        this.toastService.show({
          type: 'success',
          message: `Hotel ${this.isEdit ? 'actualizado' : 'creado'} correctamente`,
        });
        this.goBack();
      },
      error: () => {
        this.toastService.show({ type: 'error', message: 'Error al procesar la solicitud' });
        this.isSaving = false;
      },
      complete: () => {
        this.isSaving = false;
      },
    });
  }
}
