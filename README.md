# Project NodeJS: E-commerce clothing website

## Team members:
- Hồ Phạm Đức Linh: 522k0002
- Lê Gia Bảo: 522k0003
- Trần Đinh Nhất Đăng: 522k0013

## Setup Instructions:

### (Recommended) Docker Setup:
1. Clone the repository
  ```bash
   git clone https://github.com/Linhinthehood/ProjectNodeJS.git
  ```
2. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Access the application at `http://localhost:8080`

## Main Features:
1. Authentication
   - Login / Sign up
   - Session management
   - Email validation
   - Asynchronous welcome email notifications (via RabbitMQ)

2. Main Page
   - Product browsing
   - Product checking
   - Search functionality
   - Product categorization

3. Account Management
   - View account information
   - Profile management

4. Shopping Cart
   - View selected products
   - Cart management

5. Payment System
   - Payment processing
   - Order management
   - Asynchronous order confirmation emails (via RabbitMQ)

6. Microservices Architecture
   - Asynchronous messaging using RabbitMQ
   - Decoupled service communication
   - Separate worker processes for handling notifications

## Technical Stack:
- Backend: Node.js with Express
- Database: MongoDB Atlas
- Template Engine: EJS
- File Storage: GridFS (MongoDB)
- Message Broker: RabbitMQ (for service decoupling)
- Caching: Redis (for session management)

## Docker Configuration:
- Base image: Node.js 20 (slim)
- Port: 8080
- Environment variables managed through docker-compose
- Automatic container restart enabled
- Redis for session storage
- RabbitMQ for message queuing
- Nginx for load balancing

## Development Notes:
- The application uses nodemon for development
- MongoDB Atlas is used for database storage
- GridFS is implemented for file storage
- Session-based authentication is implemented
- CORS is enabled for API access
- RabbitMQ is used for message queue processing

## Project Structure:
```
├── config/
│   ├── db.js           # Database configuration
│   └── rabbitmq.js     # RabbitMQ configuration
├── services/
│   ├── emailService.js # Email service
│   └── messageService.js # Messaging service
├── workers/
│   └── messagingWorkers.js # Message queue workers
├── routes/
│   ├── authRoutes.js   # Authentication routes
│   ├── productRoutes.js # Product management
│   ├── shirtsRoutes.js # Shirts category
│   ├── bottomsRoutes.js # Bottoms category
│   ├── outerwearRoutes.js # Outerwear category
│   ├── accessoriesRoutes.js # Accessories category
│   ├── aboutusRouters.js # About us page
│   ├── profileRoute.js # User profile
│   └── orderRoutes.js  # Order processing
├── views/              # EJS templates
├── public/            # Static files
├── assets/           # Project assets
├── server.js         # Main application file
├── worker.js         # Standalone worker process
├── Dockerfile        # Docker configuration
└── docker-compose.yml # Docker Compose configuration
```

## Run guide:
### For Local Development:
```bash
npm run dev       # Run main application
npm run worker:dev # Run worker process (in a separate terminal)
```

### For Docker:
```bash
npm run docker:up    # Start containers
npm run docker:down  # Stop containers
npm run docker:logs  # View logs
```

## Message Broker Implementation:
The project uses RabbitMQ as a message broker to implement:
- Service decoupling between critical components
- Asynchronous processing for non-critical operations
- Improved system scalability and resilience

Key implementation areas:
1. User Registration -> Welcome Email Service
2. Order Processing -> Order Notification Service

The messaging architecture allows services to operate independently, improving:
- Fault tolerance: If one service fails, others continue operating
- Scalability: Services can be scaled independently based on load
- Performance: Non-critical operations don't block the main response flow

## Testing load balancing:
1. Run docker compose first
2. Access to http://localhost:8080/load-balancer-demo.html
3. Click start demo for create 30 requests
4. Click clear to reset all requests

## Dependencies:
```json
{
  "dependencies": {
    "amqplib": "^0.10.3",
    "bcrypt": "^5.1.1",
    "body-parser": "^1.20.3",
    "compression": "^1.8.0",
    "connect-redis": "^7.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "ejs": "^3.1.10",
    "email-validator": "^2.0.4",
    "express": "^4.21.2",
    "express-rate-limit": "^7.5.0",
    "express-session": "^1.18.1",
    "gitignore": "^0.7.0",
    "gridfs-stream": "^1.1.1",
    "ioredis": "^5.3.2",
    "mongoose": "^8.12.1",
    "multer": "^1.4.4",
    "multer-gridfs-storage": "^1.3.0",
    "nodemon": "^3.1.9",
    "redis": "^4.7.0"
  }
}
```
