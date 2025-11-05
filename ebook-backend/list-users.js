const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        screenName: true,
        role: true
      }
    });
    
    console.log('\n📋 All users in database:\n');
    users.forEach(u => {
      console.log(`  📧 Email: ${u.email}`);
      console.log(`  👤 Screen Name: ${u.screenName}`);
      console.log(`  🔑 Role: ${u.role}`);
      console.log('  ---');
    });
    console.log(`\nTotal users: ${users.length}\n`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
