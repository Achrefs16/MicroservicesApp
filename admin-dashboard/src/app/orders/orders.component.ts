import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-orders',
   standalone: false,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  errorMessage: string = '';
  searchTerm: string = '';
  sortBy: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  expandedOrderId: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (response) => {
        this.orders = response.orders;
        this.filteredOrders = [...this.orders];
        this.sortOrders();
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.errorMessage = 'Failed to fetch orders. Please try again.';
      }
    });
  }

  searchOrders(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.orders];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredOrders = this.orders.filter(order => 
        order._id.toLowerCase().includes(searchLower) ||
        order.user.email.toLowerCase().includes(searchLower) ||
        order.user.firstName.toLowerCase().includes(searchLower) ||
        order.user.lastName.toLowerCase().includes(searchLower)
      );
    }
    this.sortOrders();
  }

  sortOrders(): void {
    this.filteredOrders.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
        case 'customer':
          comparison = `${a.user.firstName} ${a.user.lastName}`.localeCompare(`${b.user.firstName} ${b.user.lastName}`);
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  onSortChange(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortDirection = 'desc';
    }
    this.sortOrders();
  }

  toggleOrderDetails(orderId: string): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  isOrderExpanded(orderId: string): boolean {
    return this.expandedOrderId === orderId;
  }
}
