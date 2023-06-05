-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parent_id_fkey";

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "parent_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
