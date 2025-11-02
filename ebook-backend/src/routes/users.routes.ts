import { Router } from 'express';
import UsersController from '../controllers/users.controller';

const router = Router();
const usersController = new UsersController();

router.get('/:id', usersController.getUserProfile);
router.put('/:id', usersController.updateUserProfile);
router.delete('/:id', usersController.deleteUser);

export default router;