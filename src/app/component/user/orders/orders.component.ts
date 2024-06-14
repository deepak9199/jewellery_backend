import { Component } from '@angular/core';
import { order, order_detail } from '../../../shared/model/order';
import { ToastrService } from 'ngx-toastr';
import { CollectionService } from '../../../shared/services/collection.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  loading: boolean = false
  orderList: order_detail[] = []
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
    this.collection.getData('orders').subscribe({
      next: (data: order_detail[]) => {
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
  private sortByDateDescending(array: order[]): any[] {
    return array.sort((a, b) => {
      const date1 = new Date(this.formatCustomTimestamp(a.createdTime));
      const date2 = new Date(this.formatCustomTimestamp(b.createdTime));
      return date2.getTime() - date1.getTime();
    });
  }
  updatestatus(data: order_detail) {
    this.loading = true
    this.collection.updateDocument('orders', data.id, data).subscribe({
      next: data => {
        this.toster.success('Order Status Updated')
        this.loading = false
      },
      error: err => {
        console.log(err.message)
        this.loading = false
      }
    })
  }
}
