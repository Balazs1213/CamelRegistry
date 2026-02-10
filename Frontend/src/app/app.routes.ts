import { Routes } from '@angular/router';

import { CamelFormComponent } from './camel-form/camel-form.component';
import { CamelListComponent } from './camel-list/camel-list.component';

export const routes: Routes = [
  { path: '', component: CamelListComponent },
  { path: 'create', component: CamelFormComponent },
  { path: 'edit/:id', component: CamelFormComponent }
];