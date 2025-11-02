import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash the password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // First, create a test user (required for uploadedBy foreign key)
  const testUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: hashedPassword, // Update password if user exists
    },
    create: {
      email: 'admin@example.com',
      screenName: 'Admin',
      password: hashedPassword,
      newsletter: false,
      disability: false,
    },
  });

  console.log('✅ Test user created/found');
  console.log('📧 Email: admin@example.com');
  console.log('🔑 Password: admin123');

  // Create sample books
  const books = [
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
      category: 'Self-Help',
      tags: 'habits,productivity,psychology',
      pdfPath: 'storage/uploads/atomic-habits.pdf',
      coverPath: 'storage/uploads/atomic-habits-cover.jpg',
      uploadedBy: testUser.id,
      views: 0,
    },
    {
      title: 'The Subtle Art of Not Giving a F*ck',
      author: 'Mark Manson',
      description: 'A Counterintuitive Approach to Living a Good Life',
      category: 'Self-Help',
      tags: 'philosophy,life,mindfulness',
      pdfPath: 'storage/uploads/subtle-art.pdf',
      coverPath: 'storage/uploads/subtle-art-cover.jpg',
      uploadedBy: testUser.id,
      views: 0,
    },
    {
      title: 'The Power of Your Subconscious Mind',
      author: 'Joseph Murphy',
      description: 'There are no limits to the prosperity, happiness, and peace of mind you can achieve',
      category: 'Psychology',
      tags: 'psychology,mind,success',
      pdfPath: 'storage/uploads/subconscious-mind.pdf',
      coverPath: 'storage/uploads/subconscious-mind-cover.jpg',
      uploadedBy: testUser.id,
      views: 0,
    },
    {
      title: 'Think and Grow Rich',
      author: 'Napoleon Hill',
      description: 'The classic guide to wealth and success',
      category: 'Business',
      tags: 'business,wealth,success,motivation',
      pdfPath: 'storage/uploads/think-grow-rich.pdf',
      coverPath: 'storage/uploads/think-grow-rich-cover.jpg',
      uploadedBy: testUser.id,
      views: 0,
    },
    {
      title: 'Rich Dad Poor Dad',
      author: 'Robert Kiyosaki',
      description: 'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not',
      category: 'Finance',
      tags: 'finance,investing,money,wealth',
      pdfPath: 'storage/uploads/rich-dad-poor-dad.pdf',
      coverPath: 'storage/uploads/rich-dad-poor-dad-cover.jpg',
      uploadedBy: testUser.id,
      views: 0,
    },
  ];

  for (const book of books) {
    await prisma.book.create({ data: book });
  }

  console.log('✅ Seeded 5 books successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
