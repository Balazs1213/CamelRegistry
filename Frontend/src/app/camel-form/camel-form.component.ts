import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Camel } from '../models/camel.model';
import { CamelService } from '../services/camel.service';

@Component({
  selector: 'app-camel-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h2 class="mb-3">{{ isEditMode ? 'Edit Camel' : 'Create Camel' }}</h2>

      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <div class="mb-3">
          <label class="form-label" for="name">Name</label>
          <input
            id="name"
            type="text"
            class="form-control"
            formControlName="name"
            [class.is-invalid]="name.invalid && (name.dirty || name.touched)"
          />
          <div *ngIf="name.invalid && (name.dirty || name.touched)" class="text-danger mt-1">
            <div *ngIf="name.errors?.['required']">Name is required.</div>
            <div *ngIf="name.errors?.['minlength']">Name must be at least 2 characters.</div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label" for="humpCount">Hump Count</label>
          <input
            id="humpCount"
            type="number"
            class="form-control"
            formControlName="humpCount"
            [class.is-invalid]="humpCount.invalid && (humpCount.dirty || humpCount.touched)"
          />
          <div *ngIf="humpCount.invalid && (humpCount.dirty || humpCount.touched)" class="text-danger mt-1">
            <div *ngIf="humpCount.errors?.['required']">Hump count is required.</div>
            <div *ngIf="humpCount.errors?.['min']">Hump count must be at least 1.</div>
            <div *ngIf="humpCount.errors?.['max']">Hump count must be at most 2.</div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label" for="color">Color</label>
          <input id="color" type="text" class="form-control" formControlName="color" />
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid || isSaving">
            {{ isSaving ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
          <a class="btn btn-outline-secondary" routerLink="/">Cancel</a>
        </div>
      </form>
    </div>
  `
})
export class CamelFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly camelService = inject(CamelService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEditMode = false;
  isSaving = false;
  error: string | null = null;

  private camelId: number | null = null;
  private loadedCamel: Camel | null = null;

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    humpCount: this.fb.nonNullable.control(1, [Validators.required, Validators.min(1), Validators.max(2)]),
    color: this.fb.nonNullable.control('')
  });

  get name() {
    return this.form.controls.name;
  }

  get humpCount() {
    return this.form.controls.humpCount;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const parsed = Number(idParam);
      if (!Number.isNaN(parsed)) {
        this.isEditMode = true;
        this.camelId = parsed;
        this.loadCamel(parsed);
      }
    }
  }

  private loadCamel(id: number): void {
    this.error = null;

    this.camelService.getCamel(id).subscribe({
      next: (camel) => {
        this.loadedCamel = camel;
        this.form.patchValue({
          name: camel.name,
          humpCount: camel.humpCount,
          color: camel.color ?? ''
        });
      },
      error: () => {
        this.error = 'Failed to load camel.';
      }
    });
  }

  onSubmit(): void {
    this.error = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    this.isSaving = true;

    if (!this.isEditMode) {
      const payload = {
        name: values.name,
        humpCount: values.humpCount,
        color: values.color,
        lastFed: new Date()
      };

      this.camelService.createCamel(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.isSaving = false;
          this.error = 'Failed to create camel.';
        }
      });

      return;
    }

    if (this.camelId == null || this.loadedCamel == null) {
      this.isSaving = false;
      this.error = 'Camel not loaded.';
      return;
    }

    const updated: Camel = {
      id: this.camelId,
      name: values.name,
      humpCount: values.humpCount,
      color: values.color,
      lastFed: this.loadedCamel.lastFed
    };

    this.camelService.updateCamel(this.camelId, updated).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.isSaving = false;
        this.error = 'Failed to update camel.';
      }
    });
  }
}