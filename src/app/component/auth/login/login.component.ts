import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { login } from '../../../shared/model/login';
import { AuthService } from '../../../shared/services/auth.service';
import { CollectionService } from '../../../shared/services/collection.service';
import { SharedService } from '../../../shared/services/shared.service';
import { TokenStorageService } from '../../../shared/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading: boolean = false
  currentDateTime: any;
  form_login: login = {
    email: '',
    password: ''
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    private toster: ToastrService,
    private tokenstorage: TokenStorageService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.status()
  }

  status() {
    if (this.ValidatorChecker(this.tokenstorage.getToken())) {
      let role = this.tokenstorage.getUser().role[0]
      this.route(role)
    }

  }
  private ValidatorChecker(data: any) {
    if (typeof data === "undefined" || data === null || data === '') {
      return false
    }
    else {
      return true
    }
  }
  // login function
  signIn() {
    // console.log(this.form_login)
    this.loginauthapi(this.form_login)
  }
  // login api
  private loginauthapi(login: login) {
    // console.log(login)
    this.loading = true
    this.authService.login(login.email, login.password).subscribe({
      next: (data) => {
        if (data && data.token) {
          this.loading = false
          this.tokenstorage.saveUser(data)
          this.tokenstorage.saveToken(data.token);
          this.route(this.tokenstorage.getUser().role[0])
          this.toster.success("Login SuccessFully")
        } else {
          // Handle the case when data or data.token is null
          console.error("Data or token is null.");
          this.loading = false
        }
      },
      error: (error) => {
        console.error('Error signing in:', error);
        this.toster.error('Error signing in')
        this.loading = false
      }
    });
  }

  private trigertrefreshnavbar() {
    this.sharedService.triggerFunction();
  }
  route(role: string) {
    switch (role) {
      case 'admin': {
        this.router.navigate(['/admin/dashboard']).then(() => {
          this.trigertrefreshnavbar()
        });
        break;
      }
      case 'user': {
        this.router.navigate(['/complain']).then(() => {
          this.trigertrefreshnavbar()
        });
        break
      }
      default: {
        this.router.navigate(['/'])
        console.log('role not found')
      }

    }
  }

}
