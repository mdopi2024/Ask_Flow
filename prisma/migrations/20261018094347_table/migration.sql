-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNPUBLISHED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'EMAIL', 'MULTIPLE_CHOICE', 'YES_NO');

-- CreateEnum
CREATE TYPE "ResponseSource" AS ENUM ('CHATBOT_WIDGET', 'PUBLIC_LINK', 'PREVIEW');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "widget_settings" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "botName" TEXT NOT NULL DEFAULT 'Assistant',
    "primaryColor" TEXT NOT NULL DEFAULT '#4F46E5',
    "backgroundColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "textColor" TEXT NOT NULL DEFAULT '#111827',
    "welcomeMessage" TEXT NOT NULL DEFAULT 'Hi there! 👋 Mind answering a few quick questions?',
    "completionMessage" TEXT NOT NULL DEFAULT 'Thanks! Your response has been recorded.',
    "launcherLabel" TEXT,
    "position" TEXT NOT NULL DEFAULT 'bottom-right',
    "allowedDomains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "widget_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "questionId" TEXT,
    "questionLabel" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forms" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "status" "FormStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "label" TEXT NOT NULL,
    "placeholder" TEXT,
    "helpText" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "source" "ResponseSource" NOT NULL DEFAULT 'CHATBOT_WIDGET',
    "respondentEmail" TEXT,
    "embedOrigin" TEXT,
    "userAgent" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "widget_settings_formId_key" ON "widget_settings"("formId");

-- CreateIndex
CREATE INDEX "answers_responseId_idx" ON "answers"("responseId");

-- CreateIndex
CREATE INDEX "answers_questionId_idx" ON "answers"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "answers_responseId_questionId_key" ON "answers"("responseId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "forms_slug_key" ON "forms"("slug");

-- CreateIndex
CREATE INDEX "forms_ownerId_status_idx" ON "forms"("ownerId", "status");

-- CreateIndex
CREATE INDEX "forms_ownerId_createdAt_idx" ON "forms"("ownerId", "createdAt");

-- CreateIndex
CREATE INDEX "questions_formId_order_idx" ON "questions"("formId", "order");

-- CreateIndex
CREATE INDEX "responses_formId_submittedAt_idx" ON "responses"("formId", "submittedAt");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- AddForeignKey
ALTER TABLE "widget_settings" ADD CONSTRAINT "widget_settings_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
