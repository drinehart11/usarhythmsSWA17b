import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LeftnavComponent} from './leftnav/leftnav.component';
import { DashboardComponent } from './dashboard.component';
import { LandingComponent} from './landing/landing.component';
import { DocsComponent } from './docs/docs.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { DataService} from '../services/data.service';
import { ProfileComponent } from './profile/profile.component';
import { httpInterceptorProviders } from '../utils/http.interceptor';

//ALL ROUTES ARE UNDER /dashboard
//e.g. usarhythms.ucsd.edu/dashboard/docs
export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', //default route: https://{BASEURL}/dashboard/
        component: LandingComponent,
        data: { leftnavExpanded: false }
      },
      { path: 'docs',
        component: DocsComponent
      },
      { path: 'datasets',
        component: DatasetsComponent
      },
      { path: 'profile',
        component: ProfileComponent
      }
    ],
  },
  { path: '', //default route: https://{BASEURL}/dashboard/
    component: LandingComponent
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    LandingComponent,
    HeaderComponent,
    FooterComponent,
    LeftnavComponent,
    DocsComponent,
    DatasetsComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    AgGridAngular
  ],
  providers: [httpInterceptorProviders, DataService],
})
export class DashboardModule {}
