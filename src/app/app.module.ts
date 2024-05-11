import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { NavComponent } from './shared/nav/nav.component';
import { SideComponent } from './shared/side/side.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { firebaseConfig } from './shared/bsaeUrl/firebaseconfig';
import { DashBoardComponent } from './component/user/dash-board/dash-board.component';
import { ProductsComponent } from './component/user/products/products.component';
import { TestimonialsComponent } from './component/user/testimonials/testimonials.component';
import { CetagoryMasterComponent } from './component/user/category/cetagory-master/cetagory-master.component';
import { HomeBannerComponent } from './component/user/home-banner/home-banner.component';
import { RegistorComponent } from './component/auth/registor/registor.component';
import { LoginComponent } from './component/auth/login/login.component';
import { LogoutComponent } from './component/auth/logout/logout.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthGuard } from './shared/_guards/guard';
import { OrdersComponent } from './component/user/orders/orders.component';
import { SubCategoryMasterComponent } from './component/user/category/sub-category-master/sub-category-master.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoadingComponent,
    NavComponent,
    SideComponent,
    DashBoardComponent,
    ProductsComponent,
    TestimonialsComponent,
    CetagoryMasterComponent,
    HomeBannerComponent,
    LoadingComponent,
    RegistorComponent,
    LoginComponent,
    LogoutComponent,
    FooterComponent,
    OrdersComponent,
    SubCategoryMasterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    AuthGuard,
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
