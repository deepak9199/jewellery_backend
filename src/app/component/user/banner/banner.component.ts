import { Component, ElementRef, Renderer2 } from '@angular/core';
import { banner, banner_details, banner_details_selected } from '../../../shared/model/banner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiCallService } from '../../../shared/services/api-call.service';
import { CollectionService } from '../../../shared/services/collection.service';
import { SharedService } from '../../../shared/services/shared.service';
import { TokenStorageService } from '../../../shared/services/token-storage.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImagePopUpComponent } from '../../../shared/image-pop-up/image-pop-up.component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  loading: boolean = false
  form_testimonials: banner = {
    name: '',
    image: '',
    createdTime: new Date().toString()
  }
  edit_form_testimonials: banner_details = {
    id: '',
    name: '',
    image: '',
    createdTime: ''
  }
  deleteobj: banner_details = {
    name: '',
    image: '',
    createdTime: '',
    id: ''
  }
  role: string = ''
  testimonials_seleted: banner_details_selected[] = []
  progressbar: number = 0
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
    private el: ElementRef,
    private dialog: MatDialog
  ) { }
  ngOnInit() {
    if (this.token.getUser().role[0] != null)
      this.role = this.token.getUser().role[0]
    this.get_test_api()
  }
  openDialog(image: string): void {
    const dialogRef = this.dialog.open(ImagePopUpComponent, {
      data: { imagesselected: image }
    });
  }
  create() {
    this.add_test_api(this.form_testimonials)
  }
  update(data: banner_details_selected) {
    this.edit_form_testimonials = data
  }
  submit_update() {
    this.updateproductapi(this.edit_form_testimonials)
  }
  selectDeleteID(data: banner_details_selected) {
    this.deleteobj = data
  }
  deleteYes() {
    this.deleteapi(this.deleteobj)
  }
  deleteYesall() {
    this.testimonials_seleted.filter((item: banner_details_selected) => item.checked == true).map((item: banner_details_selected) => {
      this.deleteapi({
        id: item.id,
        name: item.name,
        image: item.image,
        createdTime: item.createdTime
      })
    })

  }
  selectAll(event: boolean) {
    this.testimonials_seleted = this.testimonials_seleted.map(obj => ({ ...obj, checked: event }));
  }
  selectOneByOne(event: boolean, data: banner_details_selected, index: number) {
    let obj: banner_details_selected = {
      id: data.id,
      name: data.name,
      image: data.image,
      createdTime: data.createdTime,
      checked: event
    }
    this.testimonials_seleted[index] = obj
  }
  openModal() {
    const modal = this.el.nativeElement.querySelector('#model-progress-bar');
    this.renderer.addClass(modal, 'show');
    this.renderer.setStyle(modal, 'display', 'block');
  }
  closeModal() {
    const modal = this.el.nativeElement.querySelector('#model-progress-bar');
    this.renderer.removeClass(modal, 'show');
    this.renderer.setStyle(modal, 'display', 'none');
  }
  onFileSelected(event: any, data: banner, imageindex: number) {
    if (data.name != '') {
      const file: File = event.target.files[0];
      this.openModal()
      if (file) {
        this.collection.uploadFile(file, 'users/' + this.token.getUser().uid + '/banner').subscribe(
          (progress) => {
            if (progress != null)
              this.progressbar = progress;
            if (this.progressbar == 100)
              this.closeModal()
            // console.log('Upload progress:', progress);
          },
          (error) => {
            this.toster.error('Upload error:', error);
            this.closeModal()
          },
          () => {
            console.log('Upload complete');
            this.collection.getDownloadUrl('users/' + this.token.getUser().uid + '/banner/' + file.name).subscribe(
              (url) => {
                console.log('Download URL:', url);
                data.image = url
                this.add_test_api(data)
              },
              (error) => {
                console.error('Error getting download URL:', error);
              }
            );
          }
        );
      }
      else {
        this.toster.error('Please Enter Banner Name')
      }

    }

  }
  private get_test_api() {
    this.loading = true
    this.sub_testimonials_get = this.collection.getData('banner').subscribe({
      next: (data: banner_details_selected[]) => {
        const array = data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            image: item.image,
            checked: false,
            createdTime: item.createdTime
          }
        })
        this.testimonials_seleted = array
        this.loading = false
      },
      error: (err: any) => {
        console.error(err)
        this.loading = false
      }
    })
  }
  private deleteapi(data: banner_details) {
    this.sub_testimonials_del = this.collection.deleteDocument('banner', data.id).subscribe({
      next: (data: any) => {
        // this.toster.success('Deleted Successfully')
        this.ngOnInit()
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
  private updateproductapi(data: banner_details) {
    // this.loading = true
    this.sub_testimonials_update = this.collection.updateDocument('banner', data.id, data).subscribe({
      next: (data: any) => {
        this.loading = false
        // this.ngOnInit()
      },
      error: (err: any) => {
        this.loading = false
      }
    })
  }
  private add_test_api(data: banner) {
    this.loading = true
    this.sub_testimonials_add = this.collection.addDocumnet('banner', data).subscribe({
      next: (data: any) => {
        // this.ngOnInit()
        this.loading = false
      },
      error: (err: any) => {
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
