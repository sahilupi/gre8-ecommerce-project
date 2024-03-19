import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContactDetails } from '../models/contact-details.model';

@Injectable({
  providedIn: 'root'
})
export class ContactDetailsService {

  constructor(private http: HttpClient) { }
  baseUrl:string = environment.apiBaseUrl+'/contact';

  getContactDetails(): Observable<ContactDetails> {
    return this.http.get<ContactDetails>(this.baseUrl + '/get-contact-details');
  }
}
