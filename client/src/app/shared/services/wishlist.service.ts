import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Wishlist, WishlistItem } from '../models/wishlist.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from '../models/responses.model';
import { AuthService } from './auth/auth.service';

export const WISHLIST_KEY = 'wishlist';

export interface PostWishlistResponse {
  success: boolean,
  message: string,
  totalPrice: number,
  quantity: number
}

export interface WishlistResponse {
  success: boolean,
  message: string,
  products: any[]
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  wishlist$: BehaviorSubject<Wishlist> = new BehaviorSubject(this.getWishlistItemsFromLocalStorage());
  wishlistProducts = [];
  userBaseUrl = `${environment.apiBaseUrl}/users`;
  serverWishlist$: BehaviorSubject<{totalPrice: number, quantity: number}> = new BehaviorSubject({totalPrice: 0, quantity: 0});

  constructor(private http: HttpClient, private authService: AuthService) { }

  // localstorage wishlist handling if user is not logged in
  initWishlistLocalStorage() {
    const itemWishlist = {
      items: []
    }
    const initialWishlistJson = JSON.stringify(itemWishlist);
    localStorage.setItem(WISHLIST_KEY, initialWishlistJson);
  }

  setItemToLocalStorageWishlist(fetchedWishlist: string, wishlistItem: WishlistItem, updateQuantity?: boolean) {
    const wishlist: Wishlist = JSON.parse(fetchedWishlist);
    const catrItemExitsIndex = wishlist.items.findIndex(item => item.productId === wishlistItem.productId);
    if (catrItemExitsIndex >= 0) {
      if (updateQuantity) {
        wishlist.items[catrItemExitsIndex].quantity = wishlistItem.quantity;
        wishlist.items[catrItemExitsIndex].size = wishlistItem.size;
      }
      else {
        let newQuantity = wishlistItem.quantity;
        newQuantity = wishlist.items[catrItemExitsIndex].quantity + newQuantity;
        wishlist.items[catrItemExitsIndex].quantity = newQuantity;
        wishlist.items[catrItemExitsIndex].size = wishlistItem.size;
      }
    }
    else {
      wishlist.items.push(wishlistItem);
    }
    const wishlistJson = JSON.stringify(wishlist);
    this.wishlist$.next(wishlist);
    localStorage.setItem(WISHLIST_KEY, wishlistJson);
  }

  getWishlistItemsFromLocalStorage() {
    const fetchedWishlist = localStorage.getItem(WISHLIST_KEY);
    if (fetchedWishlist) {
      // this.wishlist$.next(JSON.parse(fetchedWishlist));
      return JSON.parse(fetchedWishlist);
    }
  }

  setWishlistToLocalStorage(wishlistItem: WishlistItem, updateQuantity?: boolean) {
    const fetchedWishlist = localStorage.getItem(WISHLIST_KEY);
    if (fetchedWishlist) {
      this.setItemToLocalStorageWishlist(fetchedWishlist, wishlistItem, updateQuantity);
    }
    else {
      this.initWishlistLocalStorage();
      const fetchedWishlist2 = localStorage.getItem(WISHLIST_KEY);
      if (fetchedWishlist2) {
        this.setItemToLocalStorageWishlist(fetchedWishlist2, wishlistItem, updateQuantity);
      }
    }
  }

  deleteItemFromWishlist(productId: string) {
    const fetchedWishlist = localStorage.getItem(WISHLIST_KEY);
    if (fetchedWishlist) {
      const wishlistJson = JSON.parse(fetchedWishlist).items;
      const filteredItems = wishlistJson.filter((item: WishlistItem) => item.productId !== productId);
      const wishlist = {
        items: filteredItems
      }
      // update data in localstorage
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));

      // update data in UI
      const fetchedWishlistAfterUpdate = localStorage.getItem(WISHLIST_KEY);
      if (fetchedWishlistAfterUpdate) {
        this.wishlist$.next(JSON.parse(fetchedWishlistAfterUpdate))
      }
    }
  }

  emptyWishlist() {
    const intialWishlist = {
      items: []
    };
    const intialWishlistJson = JSON.stringify(intialWishlist);
    localStorage.setItem(WISHLIST_KEY, intialWishlistJson);
    this.wishlist$.next(intialWishlist);
  }

   // server wishlist handling methods if user is logged in
   postWishlist(wishlistObject: WishlistItem, increaseQuantity?:boolean): Observable<PostWishlistResponse> {
    if(increaseQuantity) {
      return this.http.post<PostWishlistResponse>(`${this.userBaseUrl}/post-user-wishlist`, { productId: wishlistObject.productId, quantity: wishlistObject.quantity, increaseQuantity: true, size: wishlistObject.size });
    }
    return this.http.post<PostWishlistResponse>(`${this.userBaseUrl}/post-user-wishlist`, { productId: wishlistObject.productId, quantity: wishlistObject.quantity, size: wishlistObject.size });
  }

  postMultipleWishlist(wishlistObject: WishlistItem[]): Observable<PostWishlistResponse> {
    return this.http.post<PostWishlistResponse>(`${this.userBaseUrl}/post-many-to-wishlist`, wishlistObject);
  }

  postDeleteProductWishlist(productId: string): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.userBaseUrl}/delete-wishlist-product`, {productId: productId});
  }

  getWishlistFromServer():Observable<WishlistResponse> {
    return this.http.get<WishlistResponse>(`${this.userBaseUrl}/get-user-wishlist`);
  }

  getInitialWishlist() {
    if (this.authService.isUserLoggedIn()) {
      this.getWishlistFromServer().subscribe(res => {
        let wishlistCount = 0
        res.products.map(product => {
          wishlistCount += +product.quantity;
        });
        this.serverWishlist$.next({totalPrice: 0, quantity: +wishlistCount})
      }, err => {
        console.log(err);
      });
    }
  }
}
