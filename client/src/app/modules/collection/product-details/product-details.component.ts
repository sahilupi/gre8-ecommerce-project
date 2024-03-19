import { Component, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';

import { Product } from 'src/app/shared/models/product.model';
import { CartService, PostCartResponse } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ProductResponse, ProductsResponse } from 'src/app/shared/models/responses.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  @Input() imageData: any[] = [];
  items: GalleryItem[];
  product: Product;
  products: Product[];
  quantity: number = 1;
  isAddedToCart = false;
  isSnackbarShown = false;
  isLoading = false;
  isLoadingCart = false;
  isLoadingProducts = false;
  serverErrMsg: string;
  relatedProdCategory: string = 'men';
  selectedColor: string;
  selectedSize: string;
  isSubmitted = false;
  bagType = 'cart';
  route = 'wishlist';
  currentUrl = window.location.href;

  customOptionsRelated: OwlOptions = {
    items: 4,
    nav: false,
    dots: true,
    loop: false,
    margin: 20,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 3
      },
      992: {
        items: 4,
        dots: false,
        nav: true
      }
    }
  }
  constructor( private activatedRoute: ActivatedRoute, private productService: ProductService, private cartService: CartService, private router: Router, public gallery: Gallery, public lightbox: Lightbox, private title: Title, private authService: AuthService, private wishlistService: WishlistService ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this._getProduct(params['id']);
      }
    })
    this.scrollTop();
  }

  private _getProduct(id: string) {
    this.serverErrMsg = '';
    this.isLoading = true;
    this.productService.getProduct(id).subscribe((res: ProductResponse) => {
      this.product = res['product'];
      this.title.setTitle(this.product.name + ' - Gre8');
      this.relatedProdCategory = this.product.categories[1] ? this.product.categories[1] : this.product.categories[0];
      this.imageData.push({
        srcUrl: this.product.image,
        previewUrl: this.product.image
      })
      this.product.images[0]?.imageUrls.map((imageUrl: string) => {
        this.imageData.push({
          srcUrl: imageUrl,
          previewUrl: imageUrl
        })
      });
      this.selectedColor = this.product.colors[0]?.name;
      if (this.product.sizes.includes('free size')) {
        this.selectedSize = 'free size'
      }
      this._onSetGalleryImages();
      this.serverErrMsg = '';
      this.isLoading = false;
      this._getRelatedProducts(this.relatedProdCategory);
    }, err => {
      this.isLoading = false;
      this._errorHandler(err);
    });
  }

  private _getRelatedProducts(filters: any) {
    this.isLoadingProducts = true;
    this.productService.getProducts(filters).subscribe((res: ProductsResponse) => {
      if (!res['products']) {
        this.products = [];
      }
      else {
        this.products = res['products'];
      }
      this.isLoadingProducts = false;
      this.serverErrMsg = '';
    }, err => {
      this.isLoadingProducts = false;
      this._errorHandler(err);
    })
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'An error occured. Please try again!';
    }
  }

  private _onSetGalleryImages() {
    this.items = this.imageData.map(item => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }));
    // Get a lightbox gallery ref
    const lightboxRef = this.gallery.ref('lightbox');
    // Add custom gallery config to the lightbox (optional)
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top
    });
    // Load items into the lightbox gallery ref
    lightboxRef.load(this.items);
  }

  scrollTop() {
    window.scrollTo({
      top: 0
    })
  }

  onAddtoCart(productId: string) {
    this.isSubmitted = true;
    this.bagType = 'cart';
    this.route = 'cart';
    if(!this.selectedSize && this.product.sizes && this.product.sizes.length > 0) {
      return;
    }
    // const cartItem = {
    //   productId: productId,
    //   quantity: this.quantity,
    //   color: this.selectedColor,
    //   size: this.selectedSize
    // }
    const cartItem = {
      productId: productId,
      quantity: this.quantity,
      size: this.selectedSize
    }

    if (!this.authService.isUserLoggedIn()) {
      this.cartService.setCartToLocalStorage(cartItem);
      this.isSnackbarShown = true;
      // this.messageService.add({severity:'success', summary:'Success', detail: 'Cart updated'});
    }
    else {
      // if user is logged in
      this.isLoadingCart = true;
      this.cartService.postCart(cartItem, true).subscribe((res: PostCartResponse) => {
        this.isLoadingCart = false;
        this.isSnackbarShown = true;
        this.cartService.serverCart$.next({totalPrice: +res.totalPrice, quantity: +res.quantity})
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, err => {
        this.isLoadingCart = false;
        this._errorHandler(err);
      })
    }
  }

  onUpdateQuantity(value: number) {
    this.quantity = value
  }

  onSelectSize(size: string) {
    this.selectedSize = size;
  }

  onChangeColor(colorName: string) {
    this.product.images.map(image => {
      if (image.color.trim().toLowerCase() === colorName.trim().toLowerCase()) {
        this.selectedColor = colorName;
        this.imageData = [];
        image?.imageUrls.map(imageUrl => {
          this.imageData.push({
            srcUrl: imageUrl,
            previewUrl: imageUrl
          })
        });
        this.items = this.imageData.map(item => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }));
      }
    })
  }


  onAddtoWishlist(productId: string) {
    this.bagType = 'wishlist';
    this.route = 'wishlist';
    this.isSubmitted = true;
    if(!this.selectedSize && this.product.sizes && this.product.sizes.length > 0) {
      return;
    }
    const wishlistItem = {
      productId: productId,
      quantity: this.quantity,
      size: this.selectedSize
    }

    if (!this.authService.isUserLoggedIn()) {
      this.wishlistService.setWishlistToLocalStorage(wishlistItem);
      this.isSnackbarShown = true;
      // this.messageService.add({severity:'success', summary:'Success', detail: 'Cart updated'});
    }
    else {
      // if user is logged in
      this.isLoadingCart = true;
      this.wishlistService.postWishlist(wishlistItem, true).subscribe((res: PostCartResponse) => {
        this.isLoadingCart = false;
        this.isSnackbarShown = true;
        this.wishlistService.serverWishlist$.next({totalPrice: +res.totalPrice, quantity: +res.quantity})
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, err => {
        this.isLoadingCart = false;
        this._errorHandler(err);
      })
    }
  }

}
