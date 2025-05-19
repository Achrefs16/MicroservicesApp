# Microservices E-commerce Application

## Description
This is a modern e-commerce application built using a microservices architecture. The application consists of multiple services that handle different aspects of the e-commerce platform, including user authentication, product management, order processing, favorites management, and an admin dashboard.

## Architecture

### Services Overview

1. **Frontend Service** (Next.js)
   - Port: 3000
   - Main user interface
   - Built with Next.js and TypeScript
   - Handles user interactions and displays product information

2. **User Authentication Service** (Node.js)
   - Port: 5000
   - Handles user registration, login, and authentication
   - JWT-based authentication
   - User profile management

3. **Product Catalogue Service** (Go)
   - Port: 4000
   - Manages product information
   - Handles product search and filtering
   - Product image management

4. **Order Management Service** (Node.js)
   - Port: 5100
   - Processes and manages orders
   - Order status tracking
   - Payment integration

5. **Favorites Service** (Spring Boot)
   - Port: 8080
   - Manages user's favorite products
   - Wishlist functionality
   - Product recommendations

6. **Admin Dashboard** (Angular)
   - Port: 4200
   - Administrative interface
   - Analytics and reporting
   - User and product management

### Network Architecture
- Frontend Network: Connects frontend and admin dashboard
- Backend Network: Connects all microservices
- Overlay network for service discovery

## API Endpoints

### User Authentication Service
```
POST /api/auth/register - Register new user
POST /api/auth/login - User login
GET /api/auth/profile - Get user profile
PUT /api/auth/profile - Update user profile
```

### Product Catalogue Service
```
GET /api/products - List all products
GET /api/products/{id} - Get product details
POST /api/products - Create new product
PUT /api/products/{id} - Update product
DELETE /api/products/{id} - Delete product
```

### Order Management Service
```
POST /api/orders - Create new order
GET /api/orders - List user orders
GET /api/orders/{id} - Get order details
PUT /api/orders/{id}/status - Update order status
```

### Favorites Service
```
GET /api/favorites - Get user favorites
POST /api/favorites - Add to favorites
DELETE /api/favorites/{id} - Remove from favorites
```

## Deployment Instructions

### Prerequisites
- Docker
- Docker Compose
- Node.js 18+
- Go 1.21+
- Java 17+ (for Favorites Service)
- Maven (for Favorites Service)

### Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd MicroservicesApp
```

2. Build and start all services:
```bash
docker-compose up --build
```

3. Access the services:
- Frontend: http://localhost:3000
- Admin Dashboard: http://localhost:4200
- User Authentication: http://localhost:5000
- Product Catalogue: http://localhost:4000
- Order Management: http://localhost:5100
- Favorites Service: http://localhost:8080

### Production Deployment

1. Configure environment variables:
   - Create `.env` files for each service
   - Set production database credentials
   - Configure JWT secrets
   - Set up external service URLs

2. Build production images:
```bash
docker-compose -f docker-compose.prod.yml build
```

3. Deploy to production:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Health Checks
All services include health check endpoints:
- Frontend: http://localhost:3000/health
- User Auth: http://localhost:5000/health
- Product Catalogue: http://localhost:4000/health
- Order Management: http://localhost:5100/health
- Favorites Service: http://localhost:8080/health
- Admin Dashboard: http://localhost:4200/health

## Development Guidelines

### Code Style
- Frontend: ESLint + Prettier
- Backend: Standard Go formatting
- Java: Google Java Style Guide

### Testing
- Unit tests for all services
- Integration tests for API endpoints
- End-to-end tests for critical flows

### Monitoring
- Service health checks
- Log aggregation
- Performance metrics
- Error tracking

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 