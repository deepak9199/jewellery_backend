import { Component, ElementRef, Renderer2 } from '@angular/core';
import { testimonials, testimonials_details, testimonials_selected } from '../../../shared/model/testimonials';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ApiCallService } from '../../../shared/services/api-call.service';
import { CollectionService } from '../../../shared/services/collection.service';
import { SharedService } from '../../../shared/services/shared.service';
import { TokenStorageService } from '../../../shared/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  loading: boolean = false
  form_testimonials: testimonials = {
    name: '',
    comment: '',
    createdTime: new Date().toString()
  }
  edit_form_testimonials: testimonials_details = {
    id: '',
    name: '',
    comment: '',
    createdTime: ''
  }
  deleteobj: testimonials_details = {
    name: '',
    comment: '',
    createdTime: '',
    id: ''
  }
  role: string = ''
  testimonials_seleted: testimonials_selected[] = []
  private sub_testimonials_get: Subscription | undefined
  private sub_testimonials_del: Subscription | undefined
  private sub_testimonials_update: Subscription | undefined
  private sub_testimonials_add: Subscription | undefined
  constructor(
    private toster: ToastrService,
    private collection: CollectionService,
    private apicall: ApiCallService,
    private router: Router,
    private token: TokenStorageService,
    private sharedService: SharedService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit() {
    if (this.token.getUser().role[0] != null)
      this.role = this.token.getUser().role[0]
    this.get_test_api()
  }
  create() {
    this.add_test_api(this.form_testimonials)
  }
  update(data: testimonials_selected) {
    this.edit_form_testimonials = data
  }
  submit_update() {
    this.updateproductapi(this.edit_form_testimonials)
  }
  selectDeleteID(data: testimonials_selected) {
    this.deleteobj = data
  }
  deleteYes() {
    this.deleteapi(this.deleteobj)
  }
  deleteYesall() {
    this.testimonials_seleted.filter((item: testimonials_selected) => item.checked == true).map((item: testimonials_selected) => {
      this.deleteapi({
        id: item.id,
        name: item.name,
        comment: item.comment,
        createdTime: item.createdTime
      })
    })

  }
  selectAll(event: boolean) {
    this.testimonials_seleted = this.testimonials_seleted.map(obj => ({ ...obj, checked: event }));
  }
  selectOneByOne(event: boolean, data: testimonials_selected, index: number) {
    let obj: testimonials_selected = {
      id: data.id,
      name: data.name,
      comment: data.comment,
      createdTime: data.createdTime,
      checked: event
    }
    this.testimonials_seleted[index] = obj
  }
  private get_test_api() {
    this.loading = true
    this.sub_testimonials_get = this.collection.getData('testimonials').subscribe({
      next: (data: testimonials_details[]) => {
        const array = data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            comment: item.comment,
            checked: false,
            createdTime: item.createdTime
          }
        })
        this.testimonials_seleted = array
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.loading = false
      }
    })
  }
  private deleteapi(data: testimonials_details) {
    this.sub_testimonials_del = this.collection.deleteDocument('testimonials', data.id).subscribe({
      next: (data) => {
        // this.toster.success('Deleted Successfully')
        this.ngOnInit()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  private updateproductapi(data: testimonials_details) {
    // this.loading = true
    this.sub_testimonials_update = this.collection.updateDocument('testimonials', data.id, data).subscribe({
      next: (data) => {
        this.loading = false
        // this.ngOnInit()
      },
      error: (err) => {
        this.loading = false
      }
    })
  }
  private add_test_api(data: testimonials) {
    this.loading = true
    this.sub_testimonials_add = this.collection.addDocumnet('testimonials', data).subscribe({
      next: (data) => {
        // this.ngOnInit()
        this.loading = false
      },
      error: (err) => {
        console.log(err)
        this.loading = false
      }
    })
  }
  ngOnDestroy() {
    this.sub_testimonials_add?.unsubscribe();
    this.sub_testimonials_del?.unsubscribe();
    this.sub_testimonials_get?.unsubscribe();
    this.sub_testimonials_update?.unsubscribe();

  }
}
