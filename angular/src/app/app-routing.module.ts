import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './components/logout/logout.component';
import { MiscHandlerComponent } from './pages/handlers/misc-handler/misc-handler.component';
import { NewsfeedHandlerComponent } from './pages/handlers/newsfeed-handler/newsfeed-handler.component';
import { SeriesHandlerComponent } from './pages/handlers/series-handler/series-handler.component';
import { UserHandlerComponent } from './pages/handlers/user-handler/user-handler.component';
import { UserseriesHandlerComponent } from './pages/handlers/userseries-handler/userseries-handler.component';
import { LoginComponent } from './pages/login/login.component';
import { NewsfeedComponent } from './pages/newsfeed/newsfeed.component';
import { SeriesComponent } from './pages/series/series.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UserSeriesComponent } from './pages/user-series/user-series.component';
import { AdminCanActivateService } from './services/admin-can-activate.service';
import { SiteManagerCanActivateService } from './services/site-manager-can-activate.service';
import { UserCanActivateService } from './services/user-can-activate.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/series',
    pathMatch: "full"
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'series',
    component: SeriesComponent
  },
  {
    path: 'newsfeed',
    component: NewsfeedComponent
  },
  {
    path: 'user',
    canActivate: [UserCanActivateService],
    children: [
      {
        path: 'newsfeed',
        component: NewsfeedComponent
      },
      {
        path: 'series',
        component: UserSeriesComponent
      },
      {
        path: 'handle/series',
        component: UserseriesHandlerComponent
      },
      {
        path: 'handle/series/:id',
        component: UserseriesHandlerComponent
      }
    ],
  },
  {
    path: 'admin',
    canActivate: [SiteManagerCanActivateService],
    children: [
      {
        path: 'series',
        component: SeriesHandlerComponent
      },
      {
        path: 'series/:id',
        component: SeriesHandlerComponent
      },
      {
        path: 'newsfeed',
        component: NewsfeedHandlerComponent
      },
      {
        path: 'newsfeed/:id',
        component: NewsfeedHandlerComponent
      },
      {
        path: 'misc',
        component: MiscHandlerComponent
      },
      {
        path: 'misc/:id',
        component: MiscHandlerComponent,
      },
      {
        path: 'user',
        canActivate: [AdminCanActivateService],
        component: UserHandlerComponent
      },
      {
        path: 'user/:id',
        canActivate: [AdminCanActivateService],
        component: UserHandlerComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
