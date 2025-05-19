import { Component } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-layout',
  standalone: false,
  
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})

export class LayoutComponent {
constructor( private router: Router) {}

 onLogout(): void {
  localStorage.removeItem('tokenAdmin');
  this.router.navigate(['/login']);  // Remove JWT token
}
}