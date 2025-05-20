import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// AccessRole might not be directly needed if search is only name-based for now
// import { AccessRole } from 'src/access/enums/enums';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(userId: number, searchTerm: string) {
    const ownedFiles = await this.prisma.file.findMany({
      where: {
        owner_id: userId,
        filename: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });

    const ownedFolders = await this.prisma.folder.findMany({
      where: {
        user_id: userId,
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });

    const accessEntries = await this.prisma.access.findMany({
      where: {
        user_id: userId,
        file: {
          filename: {
            contains: searchTerm,
            mode: 'insensitive',
          },
          owner_id: {
            not: userId,
          },
        },
      },
      include: {
        file: {
          include: {
            owner: {
              select: { id: true, email: true, firstname: true, lastname: true },
            },
          },
        },
      },
    });

    const sharedFiles = accessEntries.map(access => access.file);

    // Combine ownedFiles and sharedFiles
    // A simple way to deduplicate by ID:
    const allFiles = [...ownedFiles, ...sharedFiles];
    const uniqueFiles = Array.from(new Map(allFiles.map(file => [file.id, file])).values());

    return { files: uniqueFiles, folders: ownedFolders };
  }
}
