import { Component } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { CollectionService } from '../services/collection.service';
import { attendance, attendance_List } from '../model/attendance';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { users } from '../model/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  formUser: users = {
    contact: '',
    createdTime: '',
    email: '',
    name: '',
    uid: '',
    role: ''
  }
  role: string = ''
  constructor(
    private token: TokenStorageService,
    private collection: CollectionService,
    private toster: ToastrService,
    private auth: AuthService,
    private router: Router
  ) { }
  ngOnInit() {
    this.checkip()
    if (this.token.getUser().role[0] != null)
      this.role = this.token.getUser().role[0]
  }
  private getattendance() {
    this.collection.getData('attendance').subscribe({
      next: (data: attendance_List[]) => {
        let list: attendance_List[] = data.filter((item: attendance_List) => item.uid === this.token.getUser().uid)
        if (list.length != 0) {
          let today: attendance_List[] = list.filter((item: attendance_List) => this.formatDate(new Date(item.login_date_time)) === this.formatDate(new Date()))
          if (today.length == 0) {
            let obj: attendance = {
              uid: this.token.getUser().uid,
              login_date_time: new Date().toString(),
              day_count: this.getDayType(),
              logout_date_time: '',
              work_from: 'Office'
            }
            this.addattendance(obj)
          }
          else {
            this.token.saveAttendence(today)
            console.error('already logied today')
          }
        }
        else {
          let obj: attendance = {
            uid: this.token.getUser().uid,
            login_date_time: new Date().toString(),
            day_count: this.getDayType(),
            logout_date_time: '',
            work_from: ''
          }
          this.addattendance(obj)
        }
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  private addattendance(data: attendance) {
    this.collection.addDocumnet('attendance', data).subscribe({
      next: (data) => {
        // console.log('Document added with ID: ', data.id);
        this.toster.success('success attendance')
        this.token.saveAttendence({ id: data.id, ...data })
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  private getDayType(): string {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (hours < 10 || (hours === 10 && minutes < 15)) {
      return "Full day";
    } else {
      return "Half day";
    }
  }
  private formatDate(date: Date): string {
    // Format the date as "YYYY-MM-DD" (required by input type="date")
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  private checkip() {
    this.auth.getUserIpAddress().subscribe(userIpAddress => {
      // Check if the user's IP address falls within the office IP range
      const isAtOffice = this.auth.isUserAtOffice(userIpAddress);
      if (isAtOffice) {
        this.getattendance()
        this.getuserapi()
      } else {
        this.toster.success('Not in Office')
        this.router.navigate(['/logout'])
      }

    }, error => {
      // Error getting user's IP address
      this.toster.error('Error getting user IP address');

    });
  }
  private getuserapi() {
    this.collection.getData('users').subscribe({
      next: (data: users[]) => {
        this.formUser = data.filter((item: users) => item.uid === this.token.getUser().uid)[0]
      },
      error: (err) => {
        console.error(err)

      }
    })
  }
}
