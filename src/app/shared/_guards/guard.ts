import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TokenStorageService } from "../services/token-storage.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private token: TokenStorageService,
    private toster: ToastrService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const roles = next.data['role'] as Array<string>;
    if (this.ValidatorChecker(this.token.getToken()) && this.ValidatorChecker(this.token.getUser())) {
      if (roles) {
        const match = this.token.getUser().role[0]
        // console.log(match + ' ' + roles)
        // console.log(roles)
        if (match == roles) {
          return true;
        } else {
          // tslint:disable-next-line: quotemark

          this.router.navigate(['/']).then(() => {
            this.toster.error("unauthorise routing logout");
          });
          this.logout()
          return false;
        }
      } else {
        // console.log(roles)
        return true;
      }
    }
    else {

      this.router.navigate(['/'])
      return false;
    }
  }

  logout() {
    this.router.navigate(['/logout'])
  }
  private ValidatorChecker(data: any) {
    if (typeof data === "undefined" || data === null || data === '') {
      return false
    }
    else {
      return true
    }
  }
}

