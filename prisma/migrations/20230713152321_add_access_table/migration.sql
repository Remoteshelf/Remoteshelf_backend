-- CreateTable
CREATE TABLE "Access" (
    "id" SERIAL NOT NULL,
    "file_id" INTEGER NOT NULL,
    "access_right" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Access_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Access" ADD CONSTRAINT "Access_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Access" ADD CONSTRAINT "Access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
