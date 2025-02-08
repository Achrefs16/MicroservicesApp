import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
interface Product {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageURL?: string;
}


@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];
  newProduct: Product = {
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    imageURL: ''
  };
    isModalOpen = false;  // Control the modal visibility
  productToDelete: Product | null = null; 

  // When editing, we store a copy of the product here.
  selectedProduct: Product | null = null;
 selectedFileForUpdate: File | null = null;
 selectedFile: File | null = null;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

    showForm: boolean = false;
    toggleForm() {
    this.showForm = !this.showForm;
  }
  constructor(private http: HttpClient, private toastr: ToastrService ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }
onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}

createProduct(): void {
  this.isSubmitting = true;
  this.errorMessage = '';
  this.successMessage = '';

  // Get JWT from storage
  const authToken = localStorage.getItem('tokenAdmin');
  if (!authToken) {
    this.errorMessage = 'Not authenticated!';
    this.isSubmitting = false;
    return;
  }

  // Create FormData and append form fields
  const formData = new FormData();
  formData.append('name', this.newProduct.name);
  formData.append('description', this.newProduct.description);
  formData.append('category', this.newProduct.category);
  formData.append('price', this.newProduct.price.toString());
  formData.append('stock', this.newProduct.stock.toString());

  // Append file if selected
  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  // Add authorization headers
  const headers = new HttpHeaders({
    Authorization: `Bearer ${authToken}`,
  });

  // Handle error centrally
  const handleError = (error: any) => {
    console.error('Error creating product:', error);
    this.isSubmitting = false;

    if (error.status === 401) {
      this.errorMessage = 'Session expired! Please log in again.';
      localStorage.removeItem('tokenAdmin');
      window.location.href = '/login'; // Redirect to login page
    } else {
      this.errorMessage = 'Failed to create product.';
    }
  };

  this.http.post<Product>('http://ec2-51-20-188-242.eu-north-1.compute.amazonaws.com/products/products', formData, { headers }).subscribe({
    next: (createdProduct) => {
      this.successMessage = 'Product created successfully!';
      this.isSubmitting = false;
        this.fetchProducts();
      // Optionally, add the product to the list
      this.products.push(createdProduct);

      // Reset form values
      this.newProduct = { name: '', description: '', category: '', price: 0, stock: 0, imageURL: '' };
      this.selectedFile = null;
    },
    error: handleError,
  });
}


  // READ: Fetch products from the backend
  fetchProducts(): void {
    this.http.get<any[]>('http://localhost:4000/products')
      .subscribe(data => {
        this.products = data.map(product => ({
          id: product.ID,
          name: product.Name?.replace(/\"/g, '') ?? product.Name,
          description: product.Description?.replace(/\"/g, '') ?? product.Description,
          category: product.Category?.replace(/\"/g, '') ?? product.Category,
          price: product.Price,
          stock: product.Stock,
          imageURL: product.ImageURL
        }));
      });
  }


  // Set a product to be edited (populate the edit form)
  selectProduct(product: Product): void {
    // Create a clone of the product to avoid modifying the list until update is confirmed.
    this.selectedProduct = { ...product };
  }

  // Called when the file input changes in the update modal.
  onFileSelectedUpdate(event: any): void {
    this.selectedFileForUpdate = event.target.files[0];
  }

  // Cancel editing (closes the modal).
  cancelEdit(): void {
    this.selectedProduct = null;
    this.selectedFileForUpdate = null;
  }

updateProduct(): void {
  if (!this.selectedProduct || this.selectedProduct.id === undefined) {
    this.toastr.warning('No product selected for update.'); 
    return;
  }

  const authToken = localStorage.getItem('tokenAdmin');
  if (!authToken) {
    this.toastr.warning('Not authenticated!');
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${authToken}`,
  });

  // Clear previous messages


  const handleError = (error: any) => {
    console.error('Error updating product:', error);
    
    // Check if the error is due to an expired/invalid token (401 Unauthorized)
    if (error.status === 401) {
         this.toastr.warning('Session expired! Please log in again.');
      
      // Remove token from local storage and log the user out
      localStorage.removeItem('tokenAdmin');
      window.location.href = '/login'; // Redirect to login page
    } else {
         this.toastr.warning('Failed to update product.');
    }
  };

  if (this.selectedFileForUpdate) {
    // Update with image: create a FormData object.
    const formData = new FormData();
    formData.append('name', this.selectedProduct.name);
    formData.append('description', this.selectedProduct.description);
    formData.append('category', this.selectedProduct.category);
    formData.append('price', this.selectedProduct.price.toString());
    formData.append('stock', this.selectedProduct.stock.toString());
    formData.append('image', this.selectedFileForUpdate);

    this.http.put<Product>(
      `http://ec2-51-20-188-242.eu-north-1.compute.amazonaws.com/products/products/${this.selectedProduct.id}`,
      formData, { headers }
    ).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex((p) => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
         this.toastr.success('Product updated successfully!'); 
        this.selectedProduct = null;
        this.selectedFileForUpdate = null;
          this.fetchProducts();
      },
      error: handleError,
    });

  } else {
    // Update without an image (send JSON).
    this.http.put<Product>(
      `http://ec2-51-20-188-242.eu-north-1.compute.amazonaws.com/products/products/${this.selectedProduct.id}`,
      this.selectedProduct, { headers }
    ).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex((p) => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
       this.toastr.success('Product updated successfully!'); 
         this.fetchProducts();
      
      },
      error: handleError,
    });
  }
}



  // DELETE: Remove a product
 // Store the product to be deleted

  // Called when the delete button is clicked
  deleteProduct(product: Product): void {
    if (product.id === undefined) {
      return;
    }

    // Open the modal and store the product to delete
    this.productToDelete = product;
    this.isModalOpen = true;
  }

  // Confirm deletion
confirmDelete(): void {
  if (this.productToDelete) {
    const authToken = localStorage.getItem('tokenAdmin');
    if (!authToken) {
      this.toastr.warning('Not authenticated!');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });

    // Handle error response
    const handleError = (error: any) => {
      console.error('Error deleting product:', error);

      // Check if the error is due to an expired/invalid token (401 Unauthorized)
      if (error.status === 401) {
        this.toastr.warning('Session expired! Please log in again.');

        // Remove token from local storage and log the user out
        localStorage.removeItem('tokenAdmin');
        window.location.href = '/login'; // Redirect to login page
      } else {
        this.toastr.warning('Failed to delete product.');
      }
    };

    // Delete product with the provided product ID
    this.http.delete(`http://localhost:4000/products/${this.productToDelete.id}`, { headers })
      .subscribe({
        next: () => {
          // Remove the product from the list
          this.products = this.products.filter(p => p.id !== this.productToDelete!.id);
          
          // Close the modal
          this.isModalOpen = false;
          this.productToDelete = null;  // Reset the product to delete

          // Show success message
          this.toastr.success('Product deleted successfully!');
        },
        error: handleError,
      });
  }
}


  // Cancel deletion and close the modal
  cancelDelete(): void {
    this.isModalOpen = false;
    this.productToDelete = null;  // Reset the product to delete
  }


  // Optionally, cancel editing

  searchTerm: string = '';
  
  // Add filtered products getter
  get filteredProducts(): Product[] {
    if (!this.searchTerm) return this.products;
    
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  }
}
