import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private prisma: PrismaService, private bookmarkService: BookmarkService) { }

    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId)

    }

    @Get(':id')
    getBookmarkbyId(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.getBookmarkById(userId,bookmarkId)
    }

    @Post()
    creteBookmarks(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
        return this.bookmarkService.creteBookmarks(userId,dto)
    }

    @Patch(':id')
    editBookmarkbyId(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number, @Body() dto:EditBookmarkDto) {
        return this.bookmarkService.editBookmarkById(userId,bookmarkId,dto)
    }

    @Delete(':id')
    deleteBookmarkbyId(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.deleteBookmarkById(userId,bookmarkId)
    }
}
