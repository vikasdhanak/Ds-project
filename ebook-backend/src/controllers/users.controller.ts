import { Request, Response } from 'express';
import UserRepository from '../repositories/user.repository';

class UsersController {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async getUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const user = await this.userRepository.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async updateUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const updatedData = req.body;
            const updatedUser = await this.userRepository.update(userId, updatedData);
            if (!updatedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const deletedUser = await this.userRepository.delete(userId);
            if (!deletedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default UsersController;