import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EdituserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async editUser(userId: number, dto: EdituserDto) {
        const user = await this.prisma.user.update(
            {
                where: {
                    id: userId
                },
                data:{
                    ...dto
                }
            }
        )

        delete user.hash

        return user
    }
}
