-- CreateTable
CREATE TABLE "Image" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "creator_wallet" TEXT NOT NULL,
    "blockchain_address" TEXT NOT NULL,
    CONSTRAINT "Image_creator_wallet_fkey" FOREIGN KEY ("creator_wallet") REFERENCES "User" ("wallet") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "wallet" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "sender_wallet" TEXT NOT NULL,
    "reciever_wallet" TEXT NOT NULL,
    CONSTRAINT "Transaction_sender_wallet_fkey" FOREIGN KEY ("sender_wallet") REFERENCES "User" ("wallet") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_sender_wallet_fkey" FOREIGN KEY ("sender_wallet") REFERENCES "User" ("wallet") ON DELETE RESTRICT ON UPDATE CASCADE
);
