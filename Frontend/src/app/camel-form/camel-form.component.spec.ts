import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CamelFormComponent } from './camel-form.component';
import { CamelService } from '../services/camel.service';

describe('CamelFormComponent (validation)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CamelFormComponent],
      providers: [
        provideRouter([]),
        {
          provide: CamelService,
          useValue: {
            getCamel: () => of(null),
            createCamel: () => of(null),
            updateCamel: () => of(null),
            deleteCamel: () => of(null),
            getCamels: () => of([])
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({})
            }
          }
        }
      ]
    }).compileComponents();
  });

  it('shows an error when Name is required', () => {
    const fixture = TestBed.createComponent(CamelFormComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    component.form.controls.name.setValue('');
    component.form.controls.name.markAsTouched();

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Name is required.');
  });

  it('shows an error when Hump Count is > 2', () => {
    const fixture = TestBed.createComponent(CamelFormComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    component.form.controls.humpCount.setValue(3);
    component.form.controls.humpCount.markAsTouched();

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Hump count must be at most 2.');
  });
});
