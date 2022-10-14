import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NewsfeedItemComponent } from './components/items/newsfeed-item/newsfeed-item.component';
import { SeriesItemComponent } from './components/items/series-item/series-item.component';
import { UserseriesItemComponent } from './components/items/userseries-item/userseries-item.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SeriesComponent } from './pages/series/series.component';
import { NewsfeedComponent } from './pages/newsfeed/newsfeed.component';
import { UserSeriesComponent } from './pages/user-series/user-series.component';
import { ClickOutsideDirective } from './directive/clickOutside';
import { DropDownBarComponent } from './components/items/drop-down-bar/drop-down-bar.component';
import { LogoutComponent } from './components/logout/logout.component';
import { SearchBarComponent } from './components/items/search-bar/search-bar.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    NewsfeedItemComponent,
    SeriesItemComponent,
    UserseriesItemComponent,
    ProfileComponent,
    LoginComponent,
    SignupComponent,
    SeriesComponent,
    NewsfeedComponent,
    UserSeriesComponent,
    LogoutComponent,
    DropDownBarComponent,
    ClickOutsideDirective,
    SearchBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
