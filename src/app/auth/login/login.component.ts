import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginRequestPayload } from './login-request.payload';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginRequestPayload: LoginRequestPayload;
  registerSuccessMessage: string;
  isError: boolean;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginRequestPayload = {
      username: '',
      password: '',
    };
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.registered !== undefined && params.registered === 'true') {
        this.toastr.success('Signup successful');
        this.registerSuccessMessage =
          'Please, check your inbox for the activation mail ' +
          'You must activate your account before login!';
      }
    });
  }

  onLogin() {
    this.loginRequestPayload.username = this.loginForm.get('username').value;
    this.loginRequestPayload.password = this.loginForm.get('password').value;

    // this.authService.login(this.loginRequestPayload).subscribe((data) => {
    //   console.log('Login successful');
    // });

    this.authService.login(this.loginRequestPayload).subscribe(
      (data) => {
        this.isError = false;
        this.router.navigateByUrl('');
        this.toastr.success('Login successful');
      },
      (error) => {
        this.isError = true;
        throwError(error);
      }
    );
  }
}
