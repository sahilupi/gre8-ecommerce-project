import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('toggleButton') toggleButton: ElementRef;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    if (window.pageYOffset > 150) {
      let element = document.getElementById('main__header');
      element?.classList.add('sticky');
    } else {
      let element = document.getElementById('main__header');
      element?.classList.remove('sticky');
    }
  }

  public href: string = "";
  constructor(private renderer: Renderer2, private authService: AuthService) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.toggleButton.nativeElement && !this.toggleButton.nativeElement.contains(e.target) && e.target !== this.menu.nativeElement && !this.menu.nativeElement.contains(e.target)) {
        this.isMenuOpen = false;
      }
    });
  }

  ngOnInit(): void {
    // this.cartService.cart$.next({totalPrice: 0, quantity: this.productService.products.length});
  }

  isUserLoggedIn() {
    return this.authService.isUserLoggedIn();
  }

  onLogout() {
    this.authService.deleteToken();
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openSearchBar() {
    document.body.classList.add('predictive__search--box_active');
    document.getElementById('search')?.classList.add('active');
  }

  toggleAccordian(event: any) {
    const element = event.target;
    element.classList.toggle("active-accordion");
    // if (this.data[index].isActive) {
    //   this.data[index].isActive = false;
    // } else {
    //   this.data[index].isActive = true;
    // }
    const panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

}
