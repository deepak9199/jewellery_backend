import { Component, NgZone } from '@angular/core';
import { product_detail, product_detail_selected } from '../../../shared/model/product';
import { SharedService } from '../../../shared/services/shared.service';
import { CollectionService } from '../../../shared/services/collection.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from '../../../shared/services/token-storage.service';
import { error } from 'console';
import { Subscription, isEmpty } from 'rxjs';
import { category_detail, sub_category_detail } from '../../../shared/model/category';
import { ImagePopUpComponent } from '../../../shared/image-pop-up/image-pop-up.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.css'
})
export class RelatedProductsComponent {

  loading: boolean = false
  productList: product_detail_selected[] = []
  globleproductList: product_detail_selected[] = []
  realtedProductList: product_detail_selected[] = []
  private productData: product_detail = {
    id: '',
    retailji_product_id: '',
    name: '',
    sku_code: '',
    discount: 0,
    mc_per_g: 0,
    amount: 0,
    stoke: 0,
    discription: '',
    category_id: '',
    sub_category_id: '',
    images: [],
    related_items: [],
    createdTime: ''
  }
  role: string = ''
  deleteobj: product_detail_selected = {
    id: '',
    retailji_product_id: '',
    name: '',
    sku_code: '',
    discount: 0,
    mc_per_g: 0,
    amount: 0,
    stoke: 0,
    discription: '',
    category_id: '',
    sub_category_id: '',
    images: [],
    related_items: [],
    checked: false,
    createdTime: ''
  }
  category: any;
  select_sub_cate_id: any[] = [];
  sub_category_change: any[] = [];
  sub_category: any;
  private sub_cat_get: Subscription | undefined
  private sub_sub_cat_get: Subscription | undefined
  constructor(
    private sharedservice: SharedService,
    private collectionservice: CollectionService,
    private router: Router,
    private toster: ToastrService,
    private token: TokenStorageService,
    private ngZone: NgZone, // Added NgZone
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ngZone.run(() => {
      const user = this.token.getUser()
      if (user && user.role[0]) {
        this.role = user.role[0]
        this.getSharedData()
      }

    });
  }

  getSharedData() {
    const product = this.sharedservice.getdata()
    if (product && typeof product != undefined) {
      this.productData = JSON.parse(product)
      this.get_cat_api()
      // console.log(this.productData)
    }
    else {
      console.error('Product is Null : ' + product)
      this.router.navigate(['/admin/product'])
    }
  }


  onFileSelected($event: Event, _t98: any, arg2: number) {

  }
  selectAllrelated(event: boolean) {
    this.realtedProductList = this.realtedProductList.map((obj: any) => ({ ...obj, checked: event }));
  }
  selectOneByOnerelated(event: boolean, data: product_detail_selected, index: number) {
    // console.log(data)
    let obj: product_detail_selected = {
      id: data.id,
      retailji_product_id: data.retailji_product_id,
      category_id: data.category_id,
      sub_category_id: data.sub_category_id,
      images: data.images,
      checked: event,
      createdTime: data.createdTime,
      name: data.name,
      sku_code: data.sku_code,
      discount: data.discount,
      mc_per_g: data.mc_per_g,
      amount: data.amount,
      discription: data.discription,
      related_items: [],
      stoke: data.stoke
    }

    this.realtedProductList[index] = obj
  }
  deleteYesall() {
    this.productData.related_items = this.realtedProductList.filter((objdata: product_detail_selected) => objdata.checked == false).map((checkobj: product_detail_selected) => {
      {
        return checkobj.id
      }
    })
    // console.log(this.productData)
    this.updateproductApi(this.productData)
  }
  getname(data: any[], id: string): string {
    let list = data.filter((item: any) => item.id === id)
    if (list.length != 0) {
      return list[0].name
    }
    else {
      console.error('get name not found')
      return ''
    }
  }
  addproduct() {
    let list: product_detail_selected[] = this.productList.filter((item: product_detail_selected) => item.checked == true)
    let transformedList = list.map((item: product_detail_selected) => {
      return item.id;
    });
    this.productData.related_items = [...this.productData.related_items, ...transformedList];
    this.updateproductApi(this.productData)
  }
  selectAll(event: boolean) {
    this.globleproductList = this.globleproductList.map((obj: any) => ({ ...obj, checked: event }));
  }
  selectOneByOne(event: boolean, data: product_detail_selected, index: number) {
    // console.log(data)
    let obj: product_detail_selected = {
      id: data.id,
      retailji_product_id: data.retailji_product_id,
      category_id: data.category_id,
      sub_category_id: data.sub_category_id,
      images: data.images,
      checked: event,
      createdTime: data.createdTime,
      name: data.name,
      sku_code: data.sku_code,
      discount: data.discount,
      mc_per_g: data.mc_per_g,
      amount: data.amount,
      discription: data.discription,
      related_items: [],
      stoke: data.stoke
    }

    this.productList[index] = obj
  }
  isimage(image: string): boolean {
    // console.log(image)
    let result: boolean = false
    if (image == '' || typeof image == 'undefined' || image == null) {
      result = false
    }
    else {
      result = true
    }
    // console.log(result)
    return result
  }
  openDialog(image: string): void {
    const dialogRef = this.dialog.open(ImagePopUpComponent, {
      data: { imagesselected: image }
    });
  }
  private getproductlistApi() {
    this.loading = true
    this.collectionservice.getData('product').subscribe({
      next: (data: product_detail[]) => {
        // console.log(data)
        this.productList = data.map((item: product_detail) => {
          return {
            id: item.id,
            retailji_product_id: item.retailji_product_id,
            name: item.name,
            sku_code: item.sku_code,
            discount: item.discount,
            mc_per_g: item.mc_per_g,
            amount: item.amount,
            discription: item.discription,
            category_id: item.category_id,
            sub_category_id: item.sub_category_id,
            images: item.images,
            related_items: item.related_items,
            stoke: item.stoke,
            checked: false,
            createdTime: item.createdTime
          };
        }).filter((objdata: product_detail) => objdata.id != this.productData.id);
        this.globleproductList = this.productList
        this.getproductbyidApi(this.productData.id)
      },
      error: err => {
        console.error(err.message)
        this.loading = false
      }
    })
  }
  private getproductbyidApi(id: string) {
    this.loading = true
    this.collectionservice.getDocumentById('product', id).subscribe({
      next: (data: product_detail) => {
        if (data.related_items.length != 0) {
          this.productData = data
          const filteredIds = new Set(data.related_items);
          this.globleproductList = this.globleproductList.filter((product) => !filteredIds.has(product.id));
          this.realtedProductList = data.related_items.map((item: string) => {
            const objdata = this.productList.filter((dataobj: product_detail_selected) => dataobj.id === item)[0]
            // console.log(objdata)
            return {
              id: objdata.id,
              retailji_product_id: objdata.id,
              name: objdata.name,
              sku_code: objdata.sku_code,
              discount: objdata.discount,
              mc_per_g: objdata.mc_per_g,
              amount: objdata.amount,
              discription: objdata.discription,
              category_id: objdata.category_id,
              sub_category_id: objdata.sub_category_id,
              images: objdata.images,
              related_items: objdata.related_items,
              stoke: objdata.stoke,
              checked: false,
              createdTime: objdata.createdTime
            };
          });
          this.loading = false
          // console.log(this.realtedProductList)
        }
        else {
          // console.error('No Related Items Found')
          this.realtedProductList = []
          this.loading = false
        }
      },
      error: err => {
        console.error(err.message)
        this.loading = false
      }
    })
  }
  private updateproductApi(data: product_detail) {
    // this.loading = true
    this.collectionservice.updateDocument('product', data.id, data).subscribe({
      next: data => {
        // this.toster.success('Update Prodcut Successfully')
      },
      error: err => {
        console.error(err.message)
        this.loading = false
      }
    })
  }
  private get_cat_api() {
    this.loading = true
    this.sub_cat_get = this.collectionservice.getData('category').subscribe({
      next: (data: category_detail[]) => {
        this.category = data
        this.category = this.category.sort((a: any, b: any) => a.name.localeCompare(b.name));
        this.get_sub_cat_api()

      },
      error: (err) => {
        console.error(err)
        this.loading = false
      }
    })
  }
  private get_sub_cat_api() {
    this.loading = true
    this.sub_cat_get = this.collectionservice.getData('sub-category').subscribe({
      next: (data: sub_category_detail[]) => {
        this.sub_category = data
        this.sub_category = this.sub_category.sort((a: any, b: any) => a.name.localeCompare(b.name));
        // this.get_product_retailji()
        this.getproductlistApi()

      },
      error: (err) => {
        console.error(err)
        this.loading = false
      }
    })
  }
}
