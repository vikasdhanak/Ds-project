const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setAdmin() {
  try {
    const result = await prisma.user.updateMany({
      where: { email: 'vikasdhanak181@gmail.com' },
      data: { role: 'admin' }
    });
    
    console.log('✅ Updated', result.count, 'user(s) to admin!');
    
    // Verify
    const user = await prisma.user.findUnique({
      where: { email: 'vikasdhanak181@gmail.com' },
      select: { email: true, screenName: true, role: true }
    });
    
    console.log('Current user:', user);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setAdmin();
