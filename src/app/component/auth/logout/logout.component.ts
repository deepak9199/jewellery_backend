import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth.service';
import { SharedService } from '../../../shared/services/shared.service';
import { Router } from '@angular/router';
import { attendance_List, attendance } from '../../../shared/model/attendance';
import { CollectionService } from '../../../shared/services/collection.service';
import { TokenStorageService } from '../../../shared/services/token-storage.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  loading: boolean = true
  constructor(
    private authService: AuthService,
    private router: Router,
    private toster: ToastrService,
    private sharedService: SharedService,
    private collection: CollectionService,
    private token: TokenStorageService,
  ) { }

  ngOnInit(): void {

    let obj: attendance_List[] = this.token.getAttendence()
    if (obj != null) {
      obj[0].logout_date_time = new Date().toString()
      console.log(obj)
      this.updateattendance(obj[0])
    }
    else {
      this.signout()
    }

  }
  logout() {
    this.authService.logout();
    this.trigertrefreshnavbar()
    this.router.navigate(['/']).then(() => {
      this.toster.success('Logout SuccessFully')
      this.loading = false
    });
  }
  // logout api
  signout() {
    this.loading = true
    this.authService.signOut().subscribe({
      next: (data) => {
        this.loading = false
        this.logout()
      },
      error: (err) => {
        this.loading = false
        console.error(err)
      }
    })
  }
  private trigertrefreshnavbar() {
    this.sharedService.triggerFunction();
  }
  private updateattendance(data: attendance_List) {
    this.loading = true
    this.collection.updateDocument('attendance', data.id, data).subscribe(
      (data) => {
        console.log('success logout attendance')
        this.loading = false
        this.signout()
      },
      (err) => {
        console.error(err)
        this.loading = false
      }
    )
  }
  private formatDate(date: Date): string {
    // Format the date as "YYYY-MM-DD" (required by input type="date")
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
