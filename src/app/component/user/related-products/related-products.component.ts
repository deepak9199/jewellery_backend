import { Component } from '@angular/core';
import { product_detail, product_detail_selected } from '../../../shared/model/product';
import { SharedService } from '../../../shared/services/shared.service';
import { CollectionService } from '../../../shared/services/collection.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from '../../../shared/services/token-storage.service';
import { error } from 'console';
import { isEmpty } from 'rxjs';

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

  loadingproduct: any;
  progressbarretailji: any;
  select_cate_id: any;
  category: any;
  select_sub_cate_id: any;
  sub_category_change: any;
  product_details_selected: any;
  sub_category: any;
  role: any;
  product_retailji_selected: any;
  edit_form_product: any;
  progressbar: any;
  constructor(
    private sharedservice: SharedService,
    private collectionservice: CollectionService,
    private router: Router,
    private toster: ToastrService,
    private token: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.getSharedData()
  }

  getSharedData() {
    const product = this.sharedservice.getdata()
    if (product && typeof product != undefined) {
      this.productData = JSON.parse(product)
      this.getproductlistApi()
      // console.log(this.productData)
    }
    else {
      console.error('Product is Null : ' + product)
      this.router.navigate(['/admin/product'])
    }
  }
  changesubcat() {
  }
  refreshRetailjiProcust() {

  }
  getname(arg0: any, arg1: any) {

  }
  updatedetail(_t98: any) {

  }
  openDialog(arg0: any) {

  }
  onFileSelected($event: Event, _t98: any, arg2: number) {

  }
  relatedProducts(_t98: any) {

  }
  selectAllRetailjiProducts(arg0: boolean) {

  }
  selectOneByOneRetailjiProducts(arg0: boolean, _t228: any, _t229: number) {

  }
  submit_update() {

  }
  deleteYes() {

  }
  deleteYesall() {

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
    this.productList = this.productList.map((obj: any) => ({ ...obj, checked: event }));
  }
  selectOneByOne(event: boolean, data: product_detail_selected, index: number) {
    console.log(data)
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
          console.error('No Related Items Found')
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
        this.toster.success('Update Prodcut Successfully')
      },
      error: err => {
        console.error(err.message)
        this.loading = false
      }
    })
  }
}
