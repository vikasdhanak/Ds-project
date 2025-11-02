import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class UserRepository {
    async createUser(data: any) {
        return await prisma.user.create({
            data,
        });
    }

    async getUserById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
        });
    }

    async getAllUsers() {
        return await prisma.user.findMany();
    }

    async updateUser(id: string, data: any) {
        return await prisma.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: string) {
        return await prisma.user.delete({
            where: { id },
        });
    }
}

export default new UserRepository();