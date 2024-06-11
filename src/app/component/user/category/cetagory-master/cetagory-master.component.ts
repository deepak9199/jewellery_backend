import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CollectionService } from '../../../../shared/services/collection.service';
import { Router } from '@angular/router';
import { Subscribable, Subscription, share } from 'rxjs';
import { category, category_detail, category_detail_selected, sub_category } from '../../../../shared/model/category';
import { Token } from '@angular/compiler';
import { TokenStorageService } from '../../../../shared/services/token-storage.service';
import { SharedService } from '../../../../shared/services/shared.service';

@Component({
  selector: 'app-cetagory-master',
  templateUrl: './cetagory-master.component.html',
  styleUrl: './cetagory-master.component.css'
})
export class CetagoryMasterComponent {
  loading: boolean = false
  form_category: category = {
    name: '',
    createDate: new Date().toString()
  }
  edit_form_category: category_detail = {
    name: '',
    createDate: new Date().toString(),
    id: ''
  }
  role: string = ''
  selected_category: category_detail_selected[] = []
  private deleteobj: category_detail = {
    id: '',
    name: '',
    createDate: ''
  }
  private subaddcategory: Subscription | undefined
  private subagetcategory: Subscription | undefined
  private subupdatecategory: Subscription | undefined
  private subdeletecategory: Subscription | undefined
  private subdeletecategoryid: Subscription | undefined
  constructor(
    private toster: ToastrService,
    private collection: CollectionService,
    private router: Router,
    private token: TokenStorageService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    const user = this.token.getUser()
    if (user && user.role[0]) {
      this.role = user.role[0]
      this.getcategoryapi()
    }
  }
  createCaegory() {
    // console.log(this.form_category)
    this.addcategoryapi(this.form_category)
  }
  selectAll(event: boolean) {
    this.selected_category = this.selected_category.map(obj => ({ ...obj, checked: event }));
  }
  selectOneByOne(event: boolean, data: category_detail) {
    let index: number = this.selected_category.findIndex((item: category_detail_selected) => item.id === data.id)
    let obj: category_detail_selected = {
      id: data.id,
      name: data.name,
      createDate: data.createDate,
      checked: event
    }
    this.selected_category[index] = obj
  }
  update(data: category_detail) {
    this.edit_form_category = data
  }
  submit_update() {
    this.updatecategoryapi(this.edit_form_category)
  }
  selectDeleteID(data: category_detail) {
    this.deleteobj = data
  }
  deleteYes() {
    this.deleteapi(this.deleteobj)
  }
  deleteYesall() {
    this.selected_category.filter((item: category_detail_selected) => item.checked == true).map((item: category_detail_selected) => {
      this.deleteapi({
        id: item.id,
        name: item.name,
        createDate: item.createDate
      })
    })

  }
  routtoSubcat(data: category_detail) {
    this.router.navigate(['/admin/cetagory/subCategory']).then(() => {
      this.sharedService.savedata(JSON.stringify(data))
    })
    this.sharedService.savedata(JSON.stringify(data))
  }
  private deleteapi(data: category_detail) {
    this.loading = true
    this.subdeletecategory = this.collection.deleteDocument('category', data.id).subscribe({
      next: (dataobj) => {
        this.deletebycatidApi(data.id, 'sub-category')
        this.deletebycatidApi(data.id, 'product')
      },
      error: (err) => {
        console.log(err)
        this.loading = false
      }
    })
  }
  private deletebycatidApi(catid: string, collection: string) {
    // console.log(catid)
    this.subdeletecategoryid = this.collection.deleteDocumentsByCategory(collection, catid).subscribe({
      next: data => {
        // console.log('deleted by cat id all successufully')
        this.loading = false
      },
      error: err => {
        console.error(err.message)
        this.loading = false
      }
    })
  }
  private addcategoryapi(data: category) {
    this.loading = true
    this.subaddcategory = this.collection.addDocumnet('category', data).subscribe({
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
    this.subagetcategory = this.collection.getData('category').subscribe({
      next: (data: category_detail[]) => {
        this.selected_category = []
        const array = data.map((item: category_detail) => { return { id: item.id, name: item.name, createDate: item.createDate, checked: false } })
        this.selected_category = array
        this.selected_category = this.selected_category.sort((a, b) => a.name.localeCompare(b.name));
        this.loading = false
      },
      error: (err) => {
        this.loading = false
      }
    })
  }
  private updatecategoryapi(data: category_detail) {
    this.loading = true
    this.subagetcategory = this.collection.updateDocument('category', data.id, data).subscribe({
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
    if (this.subdeletecategoryid)
      this.subdeletecategoryid.unsubscribe()
  }
}
