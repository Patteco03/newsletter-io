import { faker } from '@faker-js/faker'
import bcrypt from "bcryptjs";
import db from "../src";

async function seed(): Promise<void> {
  const password = process.env.ADMIN_PASSWORD || "admin@admin2025";
  const email = process.env.ADMIN_EMAIL || "testuser@exemple.com";

  const hashedPassword = await bcrypt.hash(password, 10);
  const author = await db.user.create({
    data: {
      email,
      name: "Admin User",
      role: "ADMIN",
      password: hashedPassword,
    },
  });

  const categories = await db.category.createManyAndReturn({
    data: [
      { name: 'Política', description: 'Ea proident incididunt nulla proident.' },
      { name: 'Economia', description: 'Laboris reprehenderit veniam ut veniam.' },
      { name: 'Tecnologia', description: 'Proident sunt consequat qui fugiat consequat.' },
      { name: 'Esportes', description: 'Reprehenderit qui consectetur nulla.' },
    ]
  })

  const allCategories = categories;
  const articlesData = Array.from({ length: 100 }).map(() => {
    const category = faker.helpers.arrayElement(allCategories);

    const title = faker.lorem.sentence(6);
    const slug = faker.helpers.slugify(title.toLowerCase());
    const content = faker.lorem.paragraphs({ min: 3, max: 8 });
    const excerpt = content.substring(0, 120) + "...";

    return {
      title,
      slug,
      content,
      excerpt,
      authorId: author.id,
      categoryId: category.id,
      published: faker.datatype.boolean(),
    };
  });

  await db.article.createMany({ data: articlesData });
}

seed()
  .then(() => console.log('Database seeded!'))
  .catch((e) => {
    console.error("Erro seed:", e);
    process.exit(1);
  })
  .finally(async () => await db.$disconnect());
