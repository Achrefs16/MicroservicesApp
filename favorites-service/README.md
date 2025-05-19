# Favorites Service

## Description
The Favorites Service is a Spring Boot microservice that manages user's favorite products and wishlists in the e-commerce platform. It provides functionality for users to save, manage, and retrieve their favorite products.

## Technology Stack
- Java 21
- Spring Boot 3.x
- Spring Data JPA
- PostgreSQL
- Maven
- Docker

## Features
- Add/Remove products to favorites
- Get user's favorite products
- Wishlist management
- Product recommendations based on favorites
- Real-time updates

## API Endpoints

### Favorites Management
```
GET /api/favorites
- Get all favorite products for the current user
- Response: List of favorite products

POST /api/favorites
- Add a product to favorites
- Request Body: { "productId": "string" }
- Response: Added favorite product

DELETE /api/favorites/{id}
- Remove a product from favorites
- Response: 204 No Content

GET /api/favorites/recommendations
- Get product recommendations based on favorites
- Response: List of recommended products
```

### Wishlist Management
```
GET /api/wishlists
- Get all wishlists for the current user
- Response: List of wishlists

POST /api/wishlists
- Create a new wishlist
- Request Body: { "name": "string" }
- Response: Created wishlist

PUT /api/wishlists/{id}
- Update wishlist name
- Request Body: { "name": "string" }
- Response: Updated wishlist

DELETE /api/wishlists/{id}
- Delete a wishlist
- Response: 204 No Content
```

## Database Schema

### Favorite
```sql
CREATE TABLE favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);
```



## Local Development Setup

### Prerequisites
- Java 21 or higher
- Maven
- PostgreSQL
- Docker (optional)

### Running Locally

1. Clone the repository:
```bash
git clone <repository-url>
cd favorites-service
```

2. Configure the database:
- Create a PostgreSQL database
- Update `application.properties` with your database credentials

3. Build the project:
```bash
./mvnw clean install
```

4. Run the application:
```bash
./mvnw spring-boot:run
```

### Running with Docker

1. Build the Docker image:
```bash
docker build -t favorites-service .
```

2. Run the container:
```bash
docker run -p 8080:8080 favorites-service
```

## Configuration

### Environment Variables
```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/favorites_db
spring.datasource.username=postgres
spring.datasource.password=your_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Security Configuration
jwt.secret=your_jwt_secret
```

## Testing

### Running Tests
```bash
./mvnw test
```

### Test Coverage
- Unit Tests: Service layer, Repository layer
- Integration Tests: API endpoints
- End-to-End Tests: Complete user flows

## Monitoring

### Health Check
```
GET /actuator/health
- Response: Service health status
```

### Metrics
```
GET /actuator/metrics
- Response: Service metrics
```

## Error Handling

The service uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 