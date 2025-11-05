import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, screenName, password, newsletter, disability } = req.body;
      
      const result = await authService.signup({
        email,
        screenName,
        password,
        newsletter,
        disability,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, rememberMe } = req.body;
      
      console.log('Login attempt for email:', email);
      
      const result = await authService.login(email, password);

      console.log('Login successful for:', email);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      console.error('Login error:', error.message);
      res.status(401).json({
        success: false,
        message: error.message || 'Invalid email or password'
      });
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const user = await authService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}