import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import {User} from '@prisma/client'

@Injectable()
export class AuthService {
    constructor(private Prsima: PrismaService, private jwt: JwtService, private config: ConfigService) { }

    async signUp(dto: AuthDto) {
        const hash = await argon.hash(dto.password)
        try {
            const user = await this.Prsima.user.create(
                {
                    data: {
                        email: dto.email,
                        hash,
                    }
                }
            )

            return this.signToken(user.id, user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error;
        }

    }


    async signIn(dto: AuthDto) {
        // find user by email
        const user = await this.Prsima.user.findUnique({ where: { email: dto.email, } })
        // if user does not exist throw an exception
        if (!user) throw new ForbiddenException('Credentials incorrect')
        // compare password
        const pwMatches = await argon.verify(user.hash, dto.password)
        if (!pwMatches) throw new ForbiddenException('Credentials incorrect')

        return this.signToken(user.id, user.email)
    }


    async signToken(userId: number, email: string): Promise<{access_token : string}> {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWTSECRET')
        const token = await this.jwt.signAsync(payload, { expiresIn: '15m', secret: secret })

        return {
            access_token : token
        }
    }
}
