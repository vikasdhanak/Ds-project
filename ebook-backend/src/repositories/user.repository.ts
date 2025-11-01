import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class UserRepository {
    async createUser(data) {
        return await prisma.user.create({
            data,
        });
    }

    async getUserById(id) {
        return await prisma.user.findUnique({
            where: { id },
        });
    }

    async getAllUsers() {
        return await prisma.user.findMany();
    }

    async updateUser(id, data) {
        return await prisma.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id) {
        return await prisma.user.delete({
            where: { id },
        });
    }
}

export default new UserRepository();