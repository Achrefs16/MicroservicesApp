import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';  // Import AuthGuard

const routes: Routes = [
  { path: '', component: LayoutComponent,
     canActivate: [AuthGuard], 
      children: [
    { path: 'products', component: ProductsComponent  },
    { path: 'orders', component: OrdersComponent},
  ]},
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' }  // Redirect unknown routes to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
