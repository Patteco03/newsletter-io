/*
  Warnings:

  - You are about to drop the column `authorId` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `articles` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."articles" DROP CONSTRAINT "articles_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."articles" DROP CONSTRAINT "articles_categoryId_fkey";

-- DropIndex
DROP INDEX "public"."articles_authorId_idx";

-- DropIndex
DROP INDEX "public"."articles_categoryId_idx";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "authorId",
DROP COLUMN "categoryId",
ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "category_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "articles_author_id_idx" ON "articles"("author_id");

-- CreateIndex
CREATE INDEX "articles_category_id_idx" ON "articles"("category_id");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
