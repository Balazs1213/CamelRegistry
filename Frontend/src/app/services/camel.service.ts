import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Camel } from '../models/camel.model';

type CamelDto = Omit<Camel, 'lastFed'> & { lastFed: string };

@Injectable({
  providedIn: 'root'
})
export class CamelService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:5077/camels';

  getCamels(): Observable<Camel[]> {
    return this.http.get<CamelDto[]>(this.baseUrl).pipe(
      map((dtos) => dtos.map((dto) => this.toCamel(dto)))
    );
  }

  getCamel(id: number): Observable<Camel> {
    return this.http.get<CamelDto>(`${this.baseUrl}/${id}`).pipe(
      map((dto) => this.toCamel(dto))
    );
  }

  createCamel(camel: Omit<Camel, 'id'>): Observable<Camel> {
    return this.http.post<CamelDto>(this.baseUrl, this.fromCamel(camel)).pipe(
      map((dto) => this.toCamel(dto))
    );
  }

  updateCamel(id: number, camel: Camel): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, this.fromCamel(camel));
  }

  deleteCamel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private toCamel(dto: CamelDto): Camel {
    return {
      ...dto,
      lastFed: new Date(dto.lastFed)
    };
  }

  private fromCamel(camel: Camel | Omit<Camel, 'id'>): CamelDto {
    return {
      ...(camel as any),
      lastFed: (camel.lastFed instanceof Date ? camel.lastFed : new Date(camel.lastFed)).toISOString()
    };
  }
}