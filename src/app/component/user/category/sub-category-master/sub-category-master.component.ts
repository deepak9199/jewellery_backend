import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { category, category_detail, category_detail_selected, sub_category, sub_category_detail, sub_category_detail_selected } from '../../../../shared/model/category';
import { CollectionService } from '../../../../shared/services/collection.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { TokenStorageService } from '../../../../shared/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-category-master',
  templateUrl: './sub-category-master.component.html',
  styleUrl: './sub-category-master.component.css'
})
export class SubCategoryMasterComponent {
  loading: boolean = false
  category: category_detail = {
    id: '',
    name: '',
    createDate: ''
  }
  form_category: sub_category = {
    name: '',
    createDate: new Date().toString(),
    category_id: ''
  }
  edit_form_category: sub_category_detail = {
    name: '',
    createDate: new Date().toString(),
    id: '',
    category_id: ''
  }
  role: string = ''
  selected_category: sub_category_detail_selected[] = []
  private deleteobj: sub_category_detail = {
    id: '',
    name: '',
    createDate: '',
    category_id: ''
  }
  private subaddcategory: Subscription | undefined
  private subagetcategory: Subscription | undefined
  private subupdatecategory: Subscription | undefined
  private subdeletecategory: Subscription | undefined
  constructor(
    private toster: ToastrService,
    private collection: CollectionService,
    private router: Router,
    private token: TokenStorageService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getshareddata()
  }
  createCaegory() {
    // console.log(this.form_category)
    this.addcategoryapi(this.form_category)
  }
  getshareddata() {
    let data = this.sharedService.getdata()
    if (data != null && typeof data != 'undefined') {
      this.category = JSON.parse(data)
      this.form_category.category_id = this.category.id
      if (this.token.getUser().role[0] != null)
        this.role = this.token.getUser().role[0]
      this.getcategoryapi()
    }
    else {
      this.router.navigate(['/admin/cetagory'])
    }

  }
  selectAll(event: boolean) {
    this.selected_category = this.selected_category.map(obj => ({ ...obj, checked: event }));
  }
  selectOneByOne(event: boolean, data: sub_category_detail) {
    let index: number = this.selected_category.findIndex((item: sub_category_detail_selected) => item.id === data.id)
    let obj: sub_category_detail_selected = {
      id: data.id,
      name: data.name,
      createDate: data.createDate,
      checked: event,
      category_id: this.category.id
    }
    this.selected_category[index] = obj
  }
  update(data: sub_category_detail) {
    this.edit_form_category = data
  }
  submit_update() {
    this.updatecategoryapi(this.edit_form_category)
  }
  selectDeleteID(data: sub_category_detail) {
    this.deleteobj = data
  }
  deleteYes() {
    this.deleteapi(this.deleteobj)
  }
  deleteYesall() {
    this.selected_category.filter((item: sub_category_detail_selected) => item.checked == true).map((item: sub_category_detail_selected) => {
      this.deleteapi({
        id: item.id,
        name: item.name,
        createDate: item.createDate,
        category_id: this.category.id
      })
    })

  }
  routtoSubcat(data: sub_category_detail) {
    this.router.navigate(['/admin/cetagory/subCategory']).then(() => {
      this.sharedService.savedata(JSON.stringify(data))
    })
    this.sharedService.savedata(JSON.stringify(data))
  }
  private deleteapi(data: sub_category_detail) {
    this.subdeletecategory = this.collection.deleteDocument('sub-category', data.id).subscribe({
      next: (data) => {
        // this.toster.success('Deleted Successfully')
        // this.ngOnInit()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  private addcategoryapi(data: sub_category) {
    this.loading = true
    this.subaddcategory = this.collection.addDocumnet('sub-category', data).subscribe({
      next: (data) => {
        this.loading = false
        // this.ngOnInit()
      },
      error: (err) => {
        this.loading = false
      }
    })
  }
  private getcategoryapi() {
    this.loading = true
    this.subagetcategory = this.collection.getData('sub-category').subscribe({
      next: (data: sub_category_detail[]) => {
        this.selected_category = []
        const array = data.filter((item: sub_category_detail) => item.category_id === this.category.id).map((item: sub_category_detail) => {
          return {
            id: item.id, name: item.name,
            createDate: item.createDate,
            checked: false,
            category_id: this.category.id
          }
        })
        this.selected_category = array
        this.selected_category = this.selected_category.sort((a, b) => a.name.localeCompare(b.name));
        this.loading = false
      },
      error: (err) => {
        this.loading = false
      }
    })
  }
  private updatecategoryapi(data: sub_category_detail) {
    this.loading = true
    this.subagetcategory = this.collection.updateDocument('sub-category', data.id, data).subscribe({
      next: (data) => {
        this.loading = false
        // this.ngOnInit()
      },
      error: (err) => {
        this.loading = false
      }
    })
  }
  ngOnDestroy() {
    if (this.subaddcategory)
      this.subaddcategory.unsubscribe()
    if (this.subagetcategory)
      this.subagetcategory.unsubscribe()
    if (this.subupdatecategory)
      this.subupdatecategory.unsubscribe()
    if (this.subdeletecategory)
      this.subdeletecategory.unsubscribe()
  }
}
