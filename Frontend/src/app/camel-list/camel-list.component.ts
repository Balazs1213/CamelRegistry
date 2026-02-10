import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Camel } from '../models/camel.model';
import { CamelService } from '../services/camel.service';

@Component({
  selector: 'app-camel-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h2 class="mb-3">Camels</h2>

      <div class="mb-3">
        <a class="btn btn-success" routerLink="/create">Create New Camel</a>
      </div>

      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <div *ngIf="isLoading" class="text-muted">Loading...</div>

      <table *ngIf="!isLoading" class="table table-striped align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Color</th>
            <th>Hump Count</th>
            <th style="width: 180px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let camel of camels">
            <td>{{ camel.name }}</td>
            <td>{{ camel.color }}</td>
            <td>{{ camel.humpCount }}</td>
            <td>
              <a class="btn btn-sm btn-primary me-2" [routerLink]="['/edit', camel.id]">Edit</a>
              <button class="btn btn-sm btn-danger" type="button" (click)="onDelete(camel.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!isLoading && camels.length === 0" class="alert alert-info">
        No camels found.
      </div>
    </div>
  `
})
export class CamelListComponent implements OnInit {
  private readonly camelService = inject(CamelService);

  camels: Camel[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.error = null;

    this.camelService.getCamels().subscribe({
      next: (camels) => {
        this.camels = camels;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load camels.';
        this.isLoading = false;
      }
    });
  }

  onDelete(id: number): void {
    this.camelService.deleteCamel(id).subscribe({
      next: () => this.load(),
      error: () => {
        this.error = 'Failed to delete camel.';
      }
    });
  }
}