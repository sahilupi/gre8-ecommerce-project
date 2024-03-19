import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category } from '../models/category.model';
import { environment } from 'src/environments/environment';
import { CategoriesResponse, CategoryResponse, ServerResponse } from '../models/responses.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categoryBaseUrl = `${environment.apiBaseUrl}/categories`;

  categories: Category[] = [
    {
      _id: 'c1',
      name: 'Books',
      icon: 'book',
      imgSrc: 'assets/img/gret/best-seller-books-on-amazon.jpg',
      checked: false
    },
    {
      _id: 'c2',
      name: 'Jewellery',
      icon: 'jewellery',
      imgSrc: 'assets/img/collection/collection10.webp',
      checked: false
    },
    {
      _id: 'c3',
      name: 'Clothes',
      icon: 'clothes',
      imgSrc: 'assets/img/gret/summer-clothes-set.jpg',
      checked: false
    },
    {
      _id: 'c4',
      name: 'Necklaces',
      icon: 'neck',
      imgSrc: 'assets/img/collection/collection7.webp',
      checked: false
    },
    {
      _id: 'c5',
      name: 'Bracelets',
      icon: 'ear',
      imgSrc: 'assets/img/collection/collection8.webp',
      checked: false
    }
  ];

  categoriesSmall: Category[] = [
    {
      _id: 'c1',
      name: 'Women',
      icon: 'women',
      categorySmallName: 'Women',
      imgSrc: 'assets/img/gret/cover-photo.jpeg',
      checked: false
    },
    {
      _id: 'c3',
      name: 'Clothes',
      categorySmallName: 'Clothes',
      icon: 'clothes',
      imgSrc: 'assets/img/gret/summer-clothes-set.jpg',
      checked: false
    },
    {
      _id: 'c4',
      name: 'Necklaces',
      categorySmallName: 'Necklaces',
      icon: 'neck',
      imgSrc: 'assets/img/collection/collection7.webp',
      checked: false
    },
    {
      _id: 'c5',
      name: 'Bracelets',
      categorySmallName: 'Bracelets',
      icon: 'ear',
      imgSrc: 'assets/img/collection/collection8.webp',
      checked: false
    },
    {
      _id: 'c6',
      name: 'Books',
      categorySmallName: 'Books',
      icon: 'books',
      imgSrc: 'assets/img/gret/best-seller-books-on-amazon.jpg',
      checked: false
    }
  ];

  constructor(private http: HttpClient) { }

  getCategories():Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(`${this.categoryBaseUrl}/get-categories`);
  }

  getCategory(categoryId: string):Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.categoryBaseUrl}/get-category/${categoryId}`);
  }

  postCategory(categoryBody: Category):Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.categoryBaseUrl}/post-category`, categoryBody);
  }

  updateCategory(categoryId: string, categoryBody: Category):Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${this.categoryBaseUrl}/update-category/${categoryId}`, categoryBody);
  }

  deleteCategory(categoryId: string):Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`${this.categoryBaseUrl}/delete-category/${categoryId}`);
  }
}
