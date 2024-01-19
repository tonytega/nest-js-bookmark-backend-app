import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) { }
    async getBookmarks(userId: number) {
        const bookmark = await this.prisma.bookmark.findMany({where:{userId:userId}})

        return bookmark;
    }

    async creteBookmarks(userId: number, dto: CreateBookmarkDto) {
        const bookmark = await this.prisma.bookmark.create({data:{userId,...dto}})

        return bookmark;
    }
    async getBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findFirst({where:{userId,id:bookmarkId}})

        return bookmark;

    }


    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        const bookmark = await this.prisma.bookmark.findUnique({where:{id : bookmarkId}})

        if( !bookmark || bookmark.userId !== userId){
            throw new ForbiddenException('access to resource denied')
        }

        return this.prisma.bookmark.update({where:{id : bookmarkId},data : {...dto}})

    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findUnique({where:{id : bookmarkId}})

        if( !bookmark || bookmark.userId !== userId){
            throw new ForbiddenException('access to resource denied')
        }

        return this.prisma.bookmark.delete({where:{id:bookmarkId}})

    }
}
