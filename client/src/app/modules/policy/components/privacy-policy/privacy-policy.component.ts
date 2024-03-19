import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

}
