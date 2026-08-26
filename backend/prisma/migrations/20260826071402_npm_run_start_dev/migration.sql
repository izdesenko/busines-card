-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "technologies" TEXT NOT NULL,
    "githubLink" TEXT,
    "liveLink" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "TextContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "TextContent_key_key" ON "TextContent"("key");
