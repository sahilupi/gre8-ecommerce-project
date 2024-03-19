"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[639],{639:(x,p,a)=>{a.r(p),a.d(p,{AuthModule:()=>G});var c=a(6895),r=a(433),_=a(5237),e=a(1571),h=a(6256),u=a(6826),g=a(1281);function v(t,n){1&t&&(e.TgZ(0,"p",22),e._uU(1,"Login to continue checkout."),e.qZA())}function w(t,n){1&t&&(e.TgZ(0,"small",23),e._uU(1,"Email is required"),e.qZA())}function Z(t,n){1&t&&(e.TgZ(0,"small",23),e._uU(1,"Email is invalid"),e.qZA())}function R(t,n){1&t&&(e.TgZ(0,"small",23),e._uU(1,"Password is required"),e.qZA())}function b(t,n){1&t&&(e.TgZ(0,"small",23),e._uU(1,"Minimum length of password should 4 characters"),e.qZA())}function T(t,n){1&t&&e._UZ(0,"app-loading-spinner")}let q=(()=>{class t{constructor(o,s,i){this.authService=o,this.router=s,this.cartService=i,this.isSubmitted=!1,this.isLoading=!1,this.totalPrice=0,this.quantity=0,this.isUserChecking=!1}ngOnInit(){this.isUserChecking=!!this.authService.isUserCheckingOut,this._initForm(),window.scrollTo({top:0})}get f(){return this.loginForm.controls}_initForm(){this.loginForm=new r.cw({email:new r.NI(null,[r.kI.required,r.kI.email]),password:new r.NI(null,[r.kI.required,r.kI.minLength(4)])})}onSubmitForm(){this.isSubmitted=!0,this.errMsg="",this.loginForm.valid&&(this.isLoading=!0,this._login())}_login(){this.authService.isAdminLogin?this.authService.adminLogin(this.loginForm.value.email,this.loginForm.value.password).subscribe(o=>{this.isLoading=!1,o.success&&(this.authService.setToken(o.token),this.router.navigate(["/"]),this.authService.isUserCheckingOut=!1)},o=>{this.isLoading=!1,this._errorHandler(o)}):this.authService.login(this.loginForm.value.email,this.loginForm.value.password).subscribe(o=>{if(this.isLoading=!1,o.success){this.authService.setToken(o.token),this.authService.isUserLoggedIn$.next(this.authService.isUserLoggedIn()),this.router.navigate(this.authService.isUserCheckingOut?["/cart"]:["/"]),this.authService.isUserCheckingOut=!1;const s=localStorage.getItem(_.q);if(s&&JSON.parse(s).items&&JSON.parse(s).items.length>0){const i=JSON.parse(s);this.cartService.postMultipleCart(i).subscribe(m=>{this.cartService.getCartFromServer().subscribe(l=>{this.isLoading=!1,l.products.forEach(d=>{this.totalPrice+=+d.productId.price*+d.quantity,this.quantity+=+d.quantity}),this.cartService.serverCart$.next({totalPrice:+this.totalPrice,quantity:this.quantity}),this.cartService.emptyCart()},l=>{this.isLoading=!1,this._errorHandler(l)})},m=>{this.isLoading=!1,this._errorHandler(m)})}}},o=>{this.isLoading=!1,this._errorHandler(o)})}_errorHandler(o){this.errMsg=o.error.message?o.error.message:"An error occured. Please try again!"}}return t.\u0275fac=function(o){return new(o||t)(e.Y36(h.e),e.Y36(u.F0),e.Y36(_.N))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-login"]],decls:33,vars:8,consts:[[1,"login__section","section--padding"],[1,"container"],[3,"formGroup","ngSubmit"],[1,"login__section--inner"],[1,"row","row-cols-md-2","row-cols-1"],[1,"col",2,"margin","auto"],[1,"account__login"],[1,"account__login--header","mb-25"],[1,"account__login--header__title","mb-15"],["class","account__login--header__desc",4,"ngIf"],[1,"account__login--inner"],["placeholder","Email Address","type","email","formControlName","email",1,"account__login--input"],["class","p-error",4,"ngIf"],["placeholder","Password","type","password","formControlName","password",1,"account__login--input"],[1,"p-error","m-auto"],[1,"account__login--remember__forgot","mb-15","d-flex","justify-content-between","align-items-center"],[1,"account__login--remember","position__relative"],["type","button","routerLink","/auth/reset-password",1,"account__login--forgot"],["type","submit",1,"account__login--btn","primary__btn"],[1,"account__login--signup__text"],["type","button","routerLink","/auth/register"],[4,"ngIf"],[1,"account__login--header__desc"],[1,"p-error"]],template:function(o,s){1&o&&(e.TgZ(0,"div",0)(1,"div",1)(2,"form",2),e.NdJ("ngSubmit",function(){return s.onSubmitForm()}),e.TgZ(3,"div",3)(4,"div",4)(5,"div",5)(6,"div",6)(7,"div",7)(8,"h2",8),e._uU(9,"Login"),e.qZA(),e.YNc(10,v,2,0,"p",9),e.qZA(),e.TgZ(11,"div",10)(12,"label"),e._UZ(13,"input",11),e.qZA(),e.YNc(14,w,2,0,"small",12),e.YNc(15,Z,2,0,"small",12),e.TgZ(16,"label"),e._UZ(17,"input",13),e.qZA(),e.YNc(18,R,2,0,"small",12),e.YNc(19,b,2,0,"small",12),e.TgZ(20,"small",14),e._uU(21),e.qZA(),e.TgZ(22,"div",15),e._UZ(23,"div",16),e.TgZ(24,"button",17),e._uU(25,"Forgot Your Password?"),e.qZA()(),e.TgZ(26,"button",18),e._uU(27,"Login"),e.qZA(),e.TgZ(28,"p",19),e._uU(29,"Don,t Have an Account? "),e.TgZ(30,"button",20),e._uU(31,"Sign up now"),e.qZA()()()()()()()()()(),e.YNc(32,T,1,0,"app-loading-spinner",21)),2&o&&(e.xp6(2),e.Q6J("formGroup",s.loginForm),e.xp6(8),e.Q6J("ngIf",s.isUserChecking),e.xp6(4),e.Q6J("ngIf",s.f.email.hasError("required")&&s.f.email.touched||s.f.email.hasError("required")&&s.isSubmitted),e.xp6(1),e.Q6J("ngIf",s.f.email.hasError("email")&&s.f.email.touched||s.f.email.hasError("email")&&s.isSubmitted),e.xp6(3),e.Q6J("ngIf",s.f.password.hasError("required")&&s.f.password.touched||s.f.password.hasError("required")&&s.isSubmitted),e.xp6(1),e.Q6J("ngIf",s.f.password.hasError("minlength")&&s.f.password.touched||s.f.password.hasError("minlength")&&s.isSubmitted),e.xp6(2),e.Oqu(s.errMsg),e.xp6(11),e.Q6J("ngIf",s.isLoading))},dependencies:[c.O5,u.rH,r._Y,r.Fj,r.JJ,r.JL,r.sg,r.u,g.g],styles:[".account__login--input[_ngcontent-%COMP%]{margin-bottom:0;margin-top:1.5rem}.p-error[_ngcontent-%COMP%]{color:#f44336}"]}),t})();function C(t,n){1&t&&(e.TgZ(0,"small",22),e._uU(1," Please enter your full name. "),e.qZA())}function I(t,n){1&t&&(e.TgZ(0,"small",22),e._uU(1," Please enter email address. "),e.qZA())}function U(t,n){1&t&&(e.TgZ(0,"small",22),e._uU(1,"Email is invalid"),e.qZA())}function P(t,n){1&t&&(e.TgZ(0,"small",22),e._uU(1," Please enter password. "),e.qZA())}function S(t,n){1&t&&(e.TgZ(0,"small",22),e._uU(1," Please confirm password. "),e.qZA())}function A(t,n){1&t&&(e.TgZ(0,"small",22),e._uU(1," Passwords do not match "),e.qZA())}function F(t,n){1&t&&e._UZ(0,"app-loading-spinner")}let L=(()=>{class t{constructor(o,s,i){this.fb=o,this.authService=s,this.router=i,this.isLoading=!1,this.serverErrMsg=""}ngOnInit(){this._initForm(),window.scrollTo({top:0})}_initForm(){this.userForm=this.fb.group({name:new r.NI("",[r.kI.required]),email:new r.NI("",[r.kI.required,r.kI.email]),password:new r.NI("",[r.kI.required,r.kI.minLength(4)]),confirmPassword:new r.NI("",[r.kI.required,r.kI.minLength(4)])},{validator:this.ConfirmedValidator("password","confirmPassword")})}get f(){return this.userForm.controls}ConfirmedValidator(o,s){return i=>{const l=i.controls[s];l.errors&&!l.errors.confirmedValidator||l.setErrors(i.controls[o].value!==l.value?{confirmedValidator:!0}:null)}}submitForm(){this.isSubmitted=!0,this.serverErrMsg="",this.userForm.valid?(this.isLoading=!0,this.authService.postRegisterUser({name:this.userForm.value.name,email:this.userForm.value.email,password:this.userForm.value.password,confirmPassword:this.userForm.value.confirmPassword}).subscribe(s=>{this.isLoading=!1,this.router.navigate(["/auth/login"])},s=>{this.isLoading=!1,this.serverErrMsg=s.error.message})):console.log("form not valid")}}return t.\u0275fac=function(o){return new(o||t)(e.Y36(r.qu),e.Y36(h.e),e.Y36(u.F0))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-register"]],decls:37,vars:9,consts:[[1,"login__section","section--padding"],[1,"container"],[3,"formGroup","ngSubmit"],[1,"login__section--inner"],[1,"row","row-cols-md-2","row-cols-1"],[1,"col",2,"margin","auto"],[1,"account__login","register"],[1,"account__login--header","mb-25"],[1,"account__login--header__title","mb-15"],[1,"account__login--header__desc"],[1,"account__login--inner"],["placeholder","Fullname","type","text","formControlName","name",1,"account__login--input"],["class","p-error",4,"ngIf"],["placeholder","Email Addres","type","email","formControlName","email",1,"account__login--input"],["placeholder","Password","type","password","formControlName","password",1,"account__login--input"],["placeholder","Confirm Password","type","password","formControlName","confirmPassword",1,"account__login--input"],[1,"p-error","m-auto"],["type","submit",1,"account__login--btn","primary__btn","mb-10"],[1,"account__login--remember","position__relative"],[1,"account__login--signup__text"],["type","button","routerLink","/auth/login"],[4,"ngIf"],[1,"p-error"]],template:function(o,s){1&o&&(e.TgZ(0,"div",0)(1,"div",1)(2,"form",2),e.NdJ("ngSubmit",function(){return s.submitForm()}),e.TgZ(3,"div",3)(4,"div",4)(5,"div",5)(6,"div",6)(7,"div",7)(8,"h2",8),e._uU(9,"Create an Account"),e.qZA(),e.TgZ(10,"p",9),e._uU(11,"Register here if you are a new customer"),e.qZA()(),e.TgZ(12,"div",10)(13,"label"),e._UZ(14,"input",11),e.qZA(),e.YNc(15,C,2,0,"small",12),e.TgZ(16,"label"),e._UZ(17,"input",13),e.qZA(),e.YNc(18,I,2,0,"small",12),e.YNc(19,U,2,0,"small",12),e.TgZ(20,"label"),e._UZ(21,"input",14),e.qZA(),e.YNc(22,P,2,0,"small",12),e.TgZ(23,"label"),e._UZ(24,"input",15),e.qZA(),e.YNc(25,S,2,0,"small",12),e.YNc(26,A,2,0,"small",12),e.TgZ(27,"small",16),e._uU(28),e.qZA(),e.TgZ(29,"button",17),e._uU(30,"Submit & Register"),e.qZA(),e.TgZ(31,"div",18)(32,"p",19),e._uU(33,"Already have an Account? "),e.TgZ(34,"button",20),e._uU(35,"Login now"),e.qZA()()()()()()()()()()(),e.YNc(36,F,1,0,"app-loading-spinner",21)),2&o&&(e.xp6(2),e.Q6J("formGroup",s.userForm),e.xp6(13),e.Q6J("ngIf",s.f.name.hasError("required")&&s.f.name.touched||s.f.name.hasError("required")&&s.isSubmitted),e.xp6(3),e.Q6J("ngIf",s.f.email.hasError("required")&&s.f.email.touched||s.f.email.hasError("required")&&s.isSubmitted),e.xp6(1),e.Q6J("ngIf",s.f.email.hasError("email")&&s.f.email.touched||s.f.email.hasError("email")&&s.isSubmitted),e.xp6(3),e.Q6J("ngIf",s.f.password.hasError("required")&&s.f.password.touched||s.f.password.hasError("required")&&s.isSubmitted),e.xp6(3),e.Q6J("ngIf",s.f.confirmPassword.hasError("required")&&s.f.confirmPassword.touched||s.f.confirmPassword.hasError("required")&&s.isSubmitted),e.xp6(1),e.Q6J("ngIf",s.f.confirmPassword.hasError("confirmedValidator")||s.f.password.hasError("confirmedValidator")),e.xp6(2),e.Oqu(s.serverErrMsg),e.xp6(8),e.Q6J("ngIf",s.isLoading))},dependencies:[c.O5,u.rH,r._Y,r.Fj,r.JJ,r.JL,r.sg,r.u,g.g],styles:[".account__login--input[_ngcontent-%COMP%]{margin-bottom:0;margin-top:1.5rem}.account__login--btn[_ngcontent-%COMP%]{margin-top:1.5rem}.p-error[_ngcontent-%COMP%]{color:#f44336}"]}),t})();var y=a(4466),N=a(2340),f=a(8613);function J(t,n){1&t&&e._UZ(0,"app-loading-spinner")}function k(t,n){1&t&&(e.TgZ(0,"div",4)(1,"div",5)(2,"h2"),e._uU(3," Please Wait..."),e.qZA()()())}function E(t,n){1&t&&(e.TgZ(0,"div",4)(1,"div",6)(2,"h2"),e._uU(3," Invalid URL."),e.qZA()()())}function Y(t,n){1&t&&(e.TgZ(0,"small",25),e._uU(1," Password is required with atleast 4 characters. "),e.qZA())}function O(t,n){1&t&&(e.TgZ(0,"small",25),e._uU(1," Passwords do not match "),e.qZA())}function Q(t,n){if(1&t){const o=e.EpF();e.TgZ(0,"div",7)(1,"form",8),e.NdJ("ngSubmit",function(){e.CHM(o);const i=e.oxw();return e.KtG(i.ResetPassword(i.ResponseResetForm))}),e.TgZ(2,"div",9)(3,"div",10)(4,"div",11)(5,"div",12)(6,"div",13)(7,"h2",14),e._uU(8,"Reset your password"),e.qZA()(),e.TgZ(9,"div",15)(10,"label"),e._UZ(11,"input",16),e.qZA(),e.YNc(12,Y,2,0,"small",17),e.TgZ(13,"label"),e._UZ(14,"input",18),e.qZA(),e.YNc(15,O,2,0,"small",17),e.TgZ(16,"p",19),e._uU(17),e.qZA(),e.TgZ(18,"p",20),e._uU(19),e.qZA(),e.TgZ(20,"button",21),e._uU(21,"Update Password"),e.qZA(),e.TgZ(22,"div",22)(23,"p",23),e._uU(24,"Or Login "),e.TgZ(25,"button",24),e._uU(26,"Login now"),e.qZA()()()()()()()()()()}if(2&t){const o=e.oxw();e.xp6(1),e.Q6J("formGroup",o.ResponseResetForm),e.xp6(11),e.Q6J("ngIf",!o.ResponseResetForm.controls.newPassword.valid&&!o.IsResetFormValid),e.xp6(3),e.Q6J("ngIf",o.ResponseResetForm.controls.confirmPassword.value!=o.ResponseResetForm.controls.newPassword.value&&o.ResponseResetForm.controls.confirmPassword.touched&&o.ResponseResetForm.controls.newPassword.touched),e.xp6(2),e.Oqu(o.errorMessage),e.xp6(2),e.Oqu(o.successMessage)}}function V(t,n){1&t&&e._UZ(0,"app-loading-spinner")}const H=[{path:"login",component:q,title:"User Login - Gre8"},{path:"register",component:L,title:"User Register - Gre8"},{path:"reset-password",component:(()=>{class t{constructor(o){this.userService=o,this.IsvalidForm=!0,this.isLoading=!1}ngOnInit(){this.RequestResetForm=new r.cw({email:new r.NI(null,[r.kI.required,r.kI.email],this.forbiddenEmails)})}RequestResetUser(){this.errorMessage="",this.successMessage="",this.RequestResetForm.value.domain=N.N.domain,this.RequestResetForm.valid?(this.IsvalidForm=!0,this.isLoading=!0,this.userService.requestReset(this.RequestResetForm.value).subscribe(o=>{this.RequestResetForm.reset(),this.isLoading=!1,this.successMessage="Reset password link sent to email sucessfully."},o=>{this.isLoading=!1,o.error.message&&(this.errorMessage=o.error.message)})):this.IsvalidForm=!1}onClearMsg(){this.errorMessage="",this.successMessage=""}}return t.\u0275fac=function(o){return new(o||t)(e.Y36(f.K))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-req-reset-pass"]],decls:25,vars:4,consts:[[1,"login__section","section--padding"],[1,"container"],[3,"formGroup","ngSubmit"],[1,"login__section--inner"],[1,"row","row-cols-md-2","row-cols-1"],[1,"col",2,"margin","auto"],[1,"account__login"],[1,"account__login--header","mb-25"],[1,"account__login--header__title","mb-15"],[1,"account__login--inner"],["placeholder","Email Address","type","email","formControlName","email",1,"account__login--input"],[1,"p-error","m-auto"],[1,"success","m-auto"],[1,"account__login--remember__forgot","mb-15","d-flex","justify-content-between","align-items-center"],["type","submit",1,"account__login--btn","primary__btn"],[1,"account__login--signup__text"],["type","button","routerLink","/auth/register"],[4,"ngIf"]],template:function(o,s){1&o&&(e.TgZ(0,"div",0)(1,"div",1)(2,"form",2),e.NdJ("ngSubmit",function(){return s.RequestResetUser()}),e.TgZ(3,"div",3)(4,"div",4)(5,"div",5)(6,"div",6)(7,"div",7)(8,"h2",8),e._uU(9,"Reset Password"),e.qZA()(),e.TgZ(10,"div",9)(11,"label"),e._UZ(12,"input",10),e.qZA(),e.TgZ(13,"p",11),e._uU(14),e.qZA(),e.TgZ(15,"p",12),e._uU(16),e.qZA(),e._UZ(17,"div",13),e.TgZ(18,"button",14),e._uU(19,"Login"),e.qZA(),e.TgZ(20,"p",15),e._uU(21,"Don,t Have an Account? "),e.TgZ(22,"button",16),e._uU(23,"Sign up now"),e.qZA()()()()()()()()()(),e.YNc(24,J,1,0,"app-loading-spinner",17)),2&o&&(e.xp6(2),e.Q6J("formGroup",s.RequestResetForm),e.xp6(12),e.Oqu(s.errorMessage),e.xp6(2),e.Oqu(s.successMessage),e.xp6(8),e.Q6J("ngIf",s.isLoading))},dependencies:[c.O5,u.rH,r._Y,r.Fj,r.JJ,r.JL,r.sg,r.u,g.g],styles:[".p-error[_ngcontent-%COMP%]{color:#f44336}.success[_ngcontent-%COMP%]{color:green}"]}),t})(),title:"Reset Password - Gre8"},{path:"response-reset-password/:token",component:(()=>{class t{constructor(o,s,i){this.userService=o,this.activatedRoute=s,this.fb=i,this.isShowPassword=!1,this.IsResetFormValid=!0,this.isLoading=!1,this.CurrentState="Wait",this.activatedRoute.params.subscribe(m=>{this.resetToken=m.token,this.VerifyToken()})}ngOnInit(){this.Init()}VerifyToken(){this.userService.ValidPasswordToken({resettoken:this.resetToken}).subscribe(o=>{this.CurrentState="Verified"},o=>{this.CurrentState="NotVerified"})}Init(){this.ResponseResetForm=this.fb.group({resettoken:[this.resetToken],newPassword:["",[r.kI.required,r.kI.minLength(4)]],confirmPassword:["",[r.kI.required,r.kI.minLength(4)]]})}Validate(o){const i=o.controls.confirmPassword.value;return i.length<=0?null:i!==o.controls.newPassword.value?{doesNotMatch:!0}:null}ResetPassword(o){this.errorMessage="",this.successMessage="",o.valid&&o.value.newPassword==o.value.confirmPassword?(this.IsResetFormValid=!0,this.userService.newPassword(this.ResponseResetForm.value).subscribe(s=>{this.ResponseResetForm.reset(),this.successMessage=s.message},s=>{s.error.message&&(this.errorMessage=s.error.message)})):this.IsResetFormValid=!1}}return t.\u0275fac=function(o){return new(o||t)(e.Y36(f.K),e.Y36(u.gz),e.Y36(r.qu))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-response-reset"]],decls:5,vars:4,consts:[[1,"login__section","section--padding"],["class","row",4,"ngIf"],["class","container",4,"ngIf"],[4,"ngIf"],[1,"row"],[1,"col-md-12","close-form"],[1,"col-md-12"],[1,"container"],[3,"formGroup","ngSubmit"],[1,"login__section--inner"],[1,"row","row-cols-md-2","row-cols-1"],[1,"col",2,"margin","auto"],[1,"account__login","register"],[1,"account__login--header","mb-25"],[1,"account__login--header__title","mb-15"],[1,"account__login--inner"],["placeholder","Password","type","password","formControlName","newPassword",1,"account__login--input"],["class","p-error",4,"ngIf"],["placeholder","Confirm Password","type","password","formControlName","confirmPassword",1,"account__login--input"],[1,"p-error","m-auto"],[1,"success","m-auto"],["type","submit",1,"account__login--btn","primary__btn","mb-10"],[1,"account__login--remember","position__relative"],[1,"account__login--signup__text"],["type","button","routerLink","/auth/login"],[1,"p-error"]],template:function(o,s){1&o&&(e.TgZ(0,"div",0),e.YNc(1,k,4,0,"div",1),e.YNc(2,E,4,0,"div",1),e.YNc(3,Q,27,5,"div",2),e.qZA(),e.YNc(4,V,1,0,"app-loading-spinner",3)),2&o&&(e.xp6(1),e.Q6J("ngIf","Wait"==s.CurrentState),e.xp6(1),e.Q6J("ngIf","NotVerified"==s.CurrentState),e.xp6(1),e.Q6J("ngIf","Verified"==s.CurrentState),e.xp6(1),e.Q6J("ngIf",s.isLoading))},dependencies:[c.O5,u.rH,r._Y,r.Fj,r.JJ,r.JL,r.sg,r.u,g.g],styles:[".p-error[_ngcontent-%COMP%]{color:#f44336}.success[_ngcontent-%COMP%]{color:green}"]}),t})(),title:"Update Password - Gre8"}];let G=(()=>{class t{}return t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[c.ez,u.Bz.forChild(H),r.UX,y.m]}),t})()}}]);