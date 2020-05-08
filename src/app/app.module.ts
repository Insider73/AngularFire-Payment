import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MzModalModule,MzButtonModule, MzInputModule,MzNavbarModule  } from 'ngx-materialize';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { environment } from './../environments/environment';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AuthService} from '../app/auth/auth.service';
import { AuthGuardService} from '../app/services/auth-guard.service';
import { AuthGuardLoginService} from '../app/services/auth-guard-login.service';
import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PaymentDeatailsComponent } from './components/payment-deatails/payment-deatails.component';

const routes: Routes = [
  {
    path: 'payments/payment/:id',
    component: PaymentDeatailsComponent
  },
  {
    path: '',
    redirectTo:'/login',
    pathMatch:'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [AuthGuardLoginService]
  },
  {
    path: 'payments',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'registration',
    component: RegistrationComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    PaymentDeatailsComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    Ng2SearchPipeModule,
    MzModalModule,
    MzButtonModule,
    MzInputModule,
    MzNavbarModule,
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'angularfs'),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [AuthService,AuthGuardService,AuthGuardLoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
