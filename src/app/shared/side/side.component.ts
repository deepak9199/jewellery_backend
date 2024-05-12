import { Component } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrl: './side.component.css'
})
export class SideComponent {
  role: string = ''
  activeLi: HTMLElement | undefined;
  isMenuCollapsed: string = 'toggle-btn';
  constructor(private token: TokenStorageService) { }
  ngOnInit() {
    if (this.token.getUser().role[0] != null)
      this.role = this.token.getUser().role[0]
  }
  isActive(li: HTMLElement): boolean {
    return this.activeLi === li;
  }

  setActive(li: HTMLElement): void {
    this.activeLi = li;
  }

  addHoverClass(li: HTMLElement): void {
    li.classList.add('nav-hover');
  }

  removeHoverClass(li: HTMLElement): void {
    li.classList.remove('nav-hover');
  }
  toggleMenu() {
    const body = document.body;
    if (this.isMenuCollapsed === 'toggle-btn') {
      this.isMenuCollapsed = 'toggle-btn menu-collapsed'
      body.classList.remove('sidebar-menu-collapsed');
    }
    else if (this.isMenuCollapsed === 'toggle-btn menu-collapsed') {
      this.isMenuCollapsed = 'toggle-btn'

      body.classList.add('sidebar-menu-collapsed');
    }
  }
}
