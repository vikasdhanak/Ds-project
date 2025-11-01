# E-Book Reading Platform

## Overview
This project is an e-book reading platform that allows users to upload PDF books and read them online. The backend is built using TypeScript and Express, providing a robust API for managing user authentication, book uploads, and reading sessions.

## Features
- User authentication (registration and login)
- Upload and manage PDF books
- Stream PDF content for online reading
- User profile management
- Error handling and rate limiting

## Project Structure
```
ebook-backend
├── src
│   ├── app.ts
│   ├── server.ts
│   ├── config
│   │   ├── env.ts
│   │   └── logger.ts
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   ├── books.controller.ts
│   │   ├── reading.controller.ts
│   │   └── users.controller.ts
│   ├── routes
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── books.routes.ts
│   │   ├── reading.routes.ts
│   │   └── users.routes.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── books.service.ts
│   │   ├── pdf.service.ts
│   │   ├── storage.service.ts
│   │   └── streaming.service.ts
│   ├── middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── upload.middleware.ts
│   ├── repositories
│   │   ├── book.repository.ts
│   │   └── user.repository.ts
│   ├── utils
│   │   ├── http.ts
│   │   └── validators.ts
│   └── types
│       ├── express.d.ts
│       └── index.ts
├── prisma
│   ├── schema.prisma
│   ├── migrations
│   │   └── .gitkeep
│   └── seed.ts
├── storage
│   ├── uploads
│   │   └── .gitkeep
│   ├── tmp
│   │   └── .gitkeep
│   └── pdf
│       └── .gitkeep
├── tests
│   ├── integration
│   │   └── books.spec.ts
│   └── unit
│       └── pdf.service.spec.ts
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── jest.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started
1. Clone the repository:
   ```
   git clone <repository-url>
   cd ebook-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

4. Run the application:
   ```
   npm run start
   ```

## Testing
To run tests, use:
```
npm run test
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.