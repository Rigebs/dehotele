import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api-service';

export interface UploadResponse {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminUploadService {
  private readonly endpoint = 'admin/uploads';

  constructor(private api: ApiService) {}

  uploadImage(folder: string, file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post<UploadResponse, FormData>(`${this.endpoint}/${folder}`, formData);
  }
}
