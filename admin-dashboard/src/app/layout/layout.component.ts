import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
 onLogout(): void {
  localStorage.removeItem('tokenAdmin');
  window.location.href = '/';  // Remove JWT token
}
}