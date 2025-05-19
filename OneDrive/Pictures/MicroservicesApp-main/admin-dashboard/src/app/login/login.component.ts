import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-login',
   standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,
    private toastr: ToastrService ,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        if (response.success) {
          localStorage.setItem('tokenAdmin', response.token); // Store JWT token
          this.toastr.success('Admin login successful', 'Success');
          this.router.navigate(['/products']); // Redirect to admin dashboard
        } else {
         this.toastr.warning(response.message, 'Login Failed'); 
        }
      },
      (error) => {
      this.toastr.error(error, 'Login Failed'); 
      }
    );
  }
}
