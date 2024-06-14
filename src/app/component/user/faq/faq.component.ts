import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { order_detail, order } from '../../../shared/model/order';
import { CollectionService } from '../../../shared/services/collection.service';
import { SharedService } from '../../../shared/services/shared.service';
import { Router } from '@angular/router';
import { Faq_detail } from '../../../shared/model/faq';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  loading: boolean = false
  orderList: Faq_detail[] = []
  constructor(
    private toster: ToastrService,
    private collection: CollectionService,
    private sharedservice: SharedService,
    private router: Router
  ) { }
  ngOnInit() {
    this.getorderdataapi()
  }
  getorderdataapi() {
    this.loading = true
    this.collection.getData('FAQ').subscribe({
      next: (data: Faq_detail[]) => {
        console.log(data)
        this.orderList = this.sortByDateDescending(data)
        this.loading = false
      },
      error: err => {
        this.loading = false
        console.error(err.message)
      }
    })
  }
  selectdata(obj: order) {
    this.sharedservice.savedata(JSON.stringify(obj));
    this.router.navigate(['/vieworder']);
  }
  formatCustomTimestamp(customTimestamp: any) {
    // Convert seconds to milliseconds
    const milliseconds = customTimestamp.seconds * 1000;

    // Add nanoseconds (converted to milliseconds) to milliseconds
    const finalMilliseconds = milliseconds + Math.floor(customTimestamp.nanoseconds / 1000000);

    // Create a new Date object with the final milliseconds
    const date = new Date(finalMilliseconds);

    // Convert date to a human-readable format
    return date.toLocaleString();
  }
  private sortByDateDescending(array: Faq_detail[]): any[] {
    return array.sort((a, b) => {
      const date1 = new Date(this.formatCustomTimestamp(a.createdTimeQuestion));
      const date2 = new Date(this.formatCustomTimestamp(b.createdTimeQuestion));
      return date2.getTime() - date1.getTime();
    });
  }
  updatestatus(data: Faq_detail) {
    this.loading = true
    data.createdTimeAnswer = new Date().toString()
    this.collection.updateDocument('FAQ', data.id, data).subscribe({
      next: data => {
        this.toster.success('Answer Updated')
        this.loading = false
      },
      error: err => {
        console.log(err.message)
        this.loading = false
      }
    })
  }
}
