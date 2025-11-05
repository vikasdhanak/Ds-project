import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error.middleware';
import routes from './routes';

const app: Application = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: [
    'http://localhost:5500', 
    'http://127.0.0.1:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5501',
    'http://localhost:3000'
  ],
  credentials: true,
  exposedHeaders: ['Content-Type', 'Content-Length'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded books
app.use('/storage', express.static('storage'));
app.use('/uploads', express.static('storage/uploads'));
app.use('/pdf', express.static('storage/pdf'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// Temporary mock endpoint (bypasses DB) — remove when DB is fixed
app.get('/api/mock-books', (req, res) => {
  const books = [
    { id: 1, title: 'Atomic Habits', author: 'James Clear', description: 'Practical guide to habit change.' },
    { id: 2, title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', description: 'Counterintuitive advice on prioritization.' },
    { id: 3, title: 'The Power of Your Subconscious Mind', author: 'Joseph Murphy', description: 'Harness the subconscious for success.' }
  ];
  res.json(books);
});

// Error handling
app.use(errorMiddleware);

export { app };