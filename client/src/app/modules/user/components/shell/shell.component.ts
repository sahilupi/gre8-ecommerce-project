import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {

  userName: string;
  userSub$: Subscription;

  constructor( private userService: UserService, private authService: AuthService ){}

  ngOnInit(): void {
      this.userService.getUserProfile().subscribe(res => {
        this.userName = res['user'].name;
        this.userService.userName.next(this.userName);
      }, err => {
        console.log(err);
      });

      this.userSub$ = this.userService.userName.subscribe(name => {
        this.userName = name;
      })
  }

  onLogout() {
    this.authService.deleteToken();
  }

  ngOnDestroy(): void {
      if( this.userSub$ ) {
        this.userSub$.unsubscribe();
      }
  }
}
