import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './components/logout/logout.component';
import { LoginComponent } from './pages/login/login.component';
import { NewsfeedComponent } from './pages/newsfeed/newsfeed.component';
import { SeriesComponent } from './pages/series/series.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UserSeriesComponent } from './pages/user-series/user-series.component';

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
    path: 'user/newsfeed',
    component: NewsfeedComponent
  },
  {
    path: 'user/series',
    component: UserSeriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
