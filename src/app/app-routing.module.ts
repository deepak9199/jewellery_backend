import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/auth/login/login.component';
import { LogoutComponent } from './component/auth/logout/logout.component';
import { RegistorComponent } from './component/auth/registor/registor.component';
import { AuthGuard } from './shared/_guards/guard';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { DashBoardComponent } from './component/user/dash-board/dash-board.component';
import { ProductsComponent } from './component/user/products/products.component';
import { CetagoryMasterComponent } from './component/user/category/cetagory-master/cetagory-master.component';
import { OrdersComponent } from './component/user/orders/orders.component';
import { TestimonialsComponent } from './component/user/testimonials/testimonials.component';
import { SubCategoryMasterComponent } from './component/user/category/sub-category-master/sub-category-master.component';
import { BannerComponent } from './component/user/banner/banner.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegistorComponent
  },
  {
    path: 'logout', component: LogoutComponent
  },
  {
    path: 'admin/dashboard', component: DashBoardComponent, canActivate: [AuthGuard], data: {
      role: 'admin'
    }
  },
  {
    path: 'admin/product', component: ProductsComponent, canActivate: [AuthGuard], data: {
      role: 'admin'
    }
  },
  {
    path: 'admin/cetagory', component: CetagoryMasterComponent, canActivate: [AuthGuard], data: {
      role: 'admin'
    }
  },
  {
    path: 'admin/cetagory/subCategory', component: SubCategoryMasterComponent, canActivate: [AuthGuard], data: {
      role: 'admin'
    }
  },
  {
    path: 'admin/order', component: OrdersComponent, canActivate: [AuthGuard], data: {
      role: 'admin'
    }
  },
  {
    path: 'admin/testimonials', component: TestimonialsComponent, canActivate: [AuthGuard], data: {
      role: 'admin'
    }
  },
  {
    path: 'admin/banner', component: BannerComponent, canActivate: [AuthGuard], data: {
      role: 'admin'
    }
  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
