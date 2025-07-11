# Invoice Generator Backend

A robust Node.js backend API for the Invoice Generator application built with Express.js, MongoDB, and TypeScript.

## Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 📄 **Invoice Management** - Complete CRUD operations for invoices
- 🛍️ **Product Management** - Manage products/services for invoices
- 📊 **PDF Generation** - Generate professional PDF invoices using Puppeteer
- 🔍 **Search & Filtering** - Advanced search and filtering capabilities
- 📈 **Analytics** - Invoice statistics and reporting
- 🛡️ **Security** - Rate limiting, input validation, and security headers
- 📱 **Responsive API** - RESTful API with proper error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **PDF Generation**: Puppeteer
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Navigate to backend directory**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Update the `.env` file with your configuration:
   \`\`\`env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/invoice_generator
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   \`\`\`

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   \`\`\`bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Invoices
- `GET /api/invoices` - Get all invoices (protected)
- `GET /api/invoices/stats` - Get invoice statistics (protected)
- `GET /api/invoices/:id` - Get specific invoice (protected)
- `POST /api/invoices` - Create new invoice (protected)
- `PUT /api/invoices/:id` - Update invoice (protected)
- `DELETE /api/invoices/:id` - Delete invoice (protected)
- `GET /api/invoices/:id/pdf` - Generate PDF (protected)

### Products
- `GET /api/products` - Get all products (protected)
- `GET /api/products/categories` - Get product categories (protected)
- `GET /api/products/:id` - Get specific product (protected)
- `POST /api/products` - Create new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

## Project Structure

\`\`\`
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript (generated)
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
\`\`\`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/invoice_generator` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm test` - Run tests

## Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation using express-validator
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configured for specific frontend origin
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage

## Error Handling

The API uses consistent error response format:

\`\`\`json
{
  "success": false,
  "message": "Error description",
  "error": "Additional error details"
}
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

This project is licensed under the MIT License.
