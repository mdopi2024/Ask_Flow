/*
  Warnings:

  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_response` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "form_response" DROP CONSTRAINT "form_response_formId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropTable
DROP TABLE "account";

-- DropTable
DROP TABLE "form";

-- DropTable
DROP TABLE "form_response";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "verification";
