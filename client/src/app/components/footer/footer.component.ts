import { Component } from '@angular/core';
import { ContactDetailsService } from 'src/app/shared/services/contact-details.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  phones: string[];
  emails: string[];
  socialMediaLinks: any;

  constructor (private contactDetailsService: ContactDetailsService) {}

  ngOnInit() {
    this.contactDetailsService.getContactDetails().subscribe((res: any) => {
      this.phones = res['details'][0]['phone'];
      this.emails = res['details'][0]['email'];
      this.socialMediaLinks = res['details'][0]['socialMediaLinks'];
    })
  }

  scrollTop() {
    window.scrollTo({
      top: 0
    })
  }

  getCurrentYear() {
    return new Date().getFullYear()
  }
}
