-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "form" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_response" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formId" TEXT NOT NULL,

    CONSTRAINT "form_response_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "form_response" ADD CONSTRAINT "form_response_formId_fkey" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
