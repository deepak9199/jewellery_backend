import { Component } from '@angular/core';
import { product, product_detail, product_detail_selected, product_retailji, product_retailji_selected } from '../../../shared/model/product';
import { category_detail, sub_category_detail } from '../../../shared/model/category';
import { Subscriber, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CollectionService } from '../../../shared/services/collection.service';
import { SharedService } from '../../../shared/services/shared.service';
import { TokenStorageService } from '../../../shared/services/token-storage.service';
import { Router } from '@angular/router';
import { ApiCallService } from '../../../shared/services/api-call.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  loading: boolean = false
  category: category_detail[] = []
  sub_category: sub_category_detail[] = []
  sub_category_change: sub_category_detail[] = []
  select_cate_id: string = ''
  select_sub_cate_id: string = ''
  product_retailji_selected: product_retailji_selected[] = []
  product_details_selected: product_detail_selected[] = []
  edit_form_product: product_detail = {
    id: '',
    retailji_product_id: '',
    category_id: '',
    sub_category_id: '',
    images: []
  }
  deleteobj: product_detail = {
    id: '',
    retailji_product_id: '',
    category_id: '',
    sub_category_id: '',
    images: []
  }
  role: string = ''
  private globle_retailji_product_list: product_retailji_selected[] = []
  private sub_retailji_get: Subscription | undefined
  private sub_cat_get: Subscription | undefined
  private sub_sub_cat_get: Subscription | undefined
  private sub_product_get: Subscription | undefined
  private sub_product_del: Subscription | undefined
  private sub_product_update: Subscription | undefined
  private sub_product_add: Subscription | undefined


  constructor(
    private toster: ToastrService,
    private collection: CollectionService,
    private apicall: ApiCallService,
    private router: Router,
    private token: TokenStorageService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    if (this.token.getUser().role[0] != null)
      this.role = this.token.getUser().role[0]
    this.get_cat_api()
  }
  addproduct() {
    let list: product_retailji_selected[] = this.product_retailji_selected.filter((item: product_retailji_selected) => item.checked == true)
    let transformedList = list.map((item: product_retailji_selected) => {
      return {
        retailji_product_id: item.id.toString(),
        category_id: this.select_cate_id,
        sub_category_id: this.select_sub_cate_id,
        images: []
      };
    });
    this.add_product_api(transformedList)
  }
  changesubcat() {
    this.sub_category_change = this.sub_category.filter((item: sub_category_detail) => item.category_id === this.select_cate_id)
  }
  selectAllRetailjiProducts(event: boolean) {
    this.product_retailji_selected = this.product_retailji_selected.map(obj => ({ ...obj, checked: event }));
  }
  selectOneByOneRetailjiProducts(event: boolean, item: product_retailji_selected, index: number) {
    let obj: product_retailji_selected = {
      id: item.id,
      item_code: item.item_code,
      item_name: item.item_name,
      pcs: item.pcs,
      basic_rate: item.basic_rate,
      purchase_rate: item.purchase_rate,
      sale_rate: item.sale_rate,
      mrp: item.mrp,
      huid: item.huid,
      design: item.design,
      supplier_id: item.supplier_id,
      brand_id: item.brand_id,
      purity: item.purity,
      bill_no: item.bill_no,
      gwt: item.gwt,
      nwt: item.nwt,
      making_per_gm: item.making_per_gm,
      making: item.making,
      dia_val: item.dia_val,
      stone_val: item.stone_val,
      hallmark: item.hallmark,
      image1: item.image1,
      barcode: item.barcode,
      dia_detail: item.dia_detail,
      stone_detail: item.stone_detail,
      sku: item.sku,
      itemno: item.itemno,
      checked: event
    }
    this.product_retailji_selected[index] = obj
  }
  update(data: product_detail_selected) {
    this.edit_form_product = data
  }
  submit_update() {
    this.updateproductapi(this.edit_form_product)
  }
  selectDeleteID(data: product_detail_selected) {
    this.deleteobj = data
  }
  deleteYes() {
    this.deleteapi(this.deleteobj)
  }
  deleteYesall() {
    this.product_details_selected.filter((item: product_detail_selected) => item.checked == true).map((item: product_detail_selected) => {
      this.deleteapi({
        id: item.id,
        retailji_product_id: item.retailji_product_id,
        category_id: item.category_id,
        sub_category_id: item.sub_category_id,
        images: []
      })
    })

  }
  selectAll(event: boolean) {
    this.product_details_selected = this.product_details_selected.map(obj => ({ ...obj, checked: event }));
  }
  selectOneByOne(event: boolean, data: product_detail_selected, index: number) {
    let obj: product_detail_selected = {
      id: data.id,
      retailji_product_id: data.retailji_product_id,
      category_id: data.category_id,
      sub_category_id: data.sub_category_id,
      images: data.images,
      checked: event
    }
    this.product_details_selected[index] = obj
  }
  onFileSelected(event: any, data: product_detail_selected, imageindex: number) {
    const file: File = event.target.files[0];
    if (file) {
      this.collection.uploadFile(file, 'users/' + this.token.getUser().uid + '/product').subscribe(
        (progress) => {
          // this.uploadProgress = progress;
          console.log('Upload progress:', progress);
        },
        (error) => {
          console.error('Upload error:', error);
        },
        () => {
          console.log('Upload complete');
          this.collection.getDownloadUrl('users/' + this.token.getUser().uid + '/product/' + file.name).subscribe(
            (url) => {
              console.log('Download URL:', url);
              if (data.images.length == 0) {
                data.images.push(url)
                this.updateproductapi(data)
                console.log('0')
              }
              else {
                if (data.images.length >= (imageindex + 1)) {
                  data.images[imageindex] = url
                  this.updateproductapi(data)
                  console.log('not index')
                }
                else {
                  console.log('not zero')
                  data.images.push(url)
                  this.updateproductapi(data)
                }
              }
            },
            (error) => {
              console.error('Error getting download URL:', error);
            }
          );
        }
      );
    }

  }
  private updateproductapi(data: product_detail) {
    this.loading = true
    this.sub_product_update = this.collection.updateDocument('product', data.id, data).subscribe({
      next: (data) => {
        this.loading = false
        this.ngOnInit()
      },
      error: (err) => {
        this.loading = false
      }
    })
  }
  private deleteapi(data: product_detail) {
    this.sub_product_del = this.collection.deleteDocument('product', data.id).subscribe({
      next: (data) => {
        // this.toster.success('Deleted Successfully')
        this.ngOnInit()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  private get_cat_api() {
    this.loading = true
    this.sub_cat_get = this.collection.getData('category').subscribe({
      next: (data: category_detail[]) => {
        this.category = data
        this.get_sub_cat_api()
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.loading = false
      }
    })
  }
  private get_sub_cat_api() {
    this.loading = true
    this.sub_cat_get = this.collection.getData('sub-category').subscribe({
      next: (data: sub_category_detail[]) => {
        this.sub_category = data
        this.get_product_retailji()
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.loading = false
      }
    })
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
  private get_product_api() {
    this.loading = true
    this.sub_cat_get = this.collection.getData('product').subscribe({
      next: (data: product_detail[]) => {
        const transformedArray = data.map((item: product_detail) => {
          return {
            id: item.id,
            retailji_product_id: item.retailji_product_id,
            category_id: item.category_id,
            sub_category_id: item.sub_category_id,
            images: item.images,
            checked: false
          };
        });
        this.product_details_selected = transformedArray
        // console.log(this.product_details_selected)
        this.refresh_Retailji_product(this.product_details_selected)
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.loading = false
      }
    })
  }
  private add_product_api(data: product[]) {
    this.loading = true
    this.sub_product_add = this.collection.addDocumentsarray('product', data).subscribe({
      next: (data) => {
        this.ngOnInit()
        this.loading = false
      },
      error: (err) => {
        console.log(err)
        this.loading = false
      }
    })
  }
  private refresh_Retailji_product(data: product_detail_selected[]) {
    this.product_retailji_selected = this.globle_retailji_product_list
    data.map((item: product_detail_selected) => {
      this.product_retailji_selected = this.product_retailji_selected.filter((item_r: product_retailji_selected) => item_r.id.toString() != item.retailji_product_id)
    })
  }
  private get_product_retailji() {
    this.loading = true
    this.sub_retailji_get = this.apicall.getRetailjiProducts().subscribe({
      next: (data: product_retailji[]) => {
        this.get_product_api()
        data.map((item: product_retailji) => {
          let obj: product_retailji_selected = {
            id: item.id,
            item_code: item.item_code,
            item_name: item.item_name,
            pcs: item.pcs,
            basic_rate: item.basic_rate,
            purchase_rate: item.purchase_rate,
            sale_rate: item.sale_rate,
            mrp: item.mrp,
            huid: item.huid,
            design: item.design,
            supplier_id: item.supplier_id,
            brand_id: item.brand_id,
            purity: item.purity,
            bill_no: item.bill_no,
            gwt: item.gwt,
            nwt: item.nwt,
            making_per_gm: item.making_per_gm,
            making: item.making,
            dia_val: item.dia_val,
            stone_val: item.stone_val,
            hallmark: item.hallmark,
            image1: item.image1,
            barcode: item.barcode,
            dia_detail: item.dia_detail,
            stone_detail: item.stone_detail,
            sku: item.sku,
            itemno: item.itemno,
            checked: false
          }
          this.product_retailji_selected.push(obj)
        })
        this.globle_retailji_product_list = this.product_retailji_selected
        this.loading = false
      },
      error: (err) => {
        console.log(err)
        this.loading = false
      }
    })
  }
  ngOnDestroy() {
    this.sub_retailji_get?.unsubscribe();
    this.sub_cat_get?.unsubscribe();
    this.sub_sub_cat_get?.unsubscribe();
    this.sub_product_get?.unsubscribe();
    this.sub_product_del?.unsubscribe();
    this.sub_product_update?.unsubscribe();
    this.sub_product_add?.unsubscribe();
  }
}
