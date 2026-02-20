-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "adminId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Slot_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slotId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BOOKED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" DATETIME,
    CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_slotId_key" ON "Booking"("slotId");
