import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";
import { ResponseSchema } from 'src/common/types';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async signin(email: string, password: string): Promise<ResponseSchema> {
        const user = await this.usersService.findOne(email);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password_hash)

        if (!isMatch) {
            throw new UnauthorizedException("Invalid credentials.");
        }

        const payload = { name: user.name, role: user.role };

        return {
            success: true,
            message: "User authenticated.",
            data: {
                access_token: this.jwtService.signAsync(payload)
            }
        }
    }

    async signup(createUserDto: CreateUserDto) {
        const saltRounds = 10;
        const password_hash = bcrypt.hashSync(createUserDto.password, saltRounds);

        const valid_user: User = {
            name: createUserDto.name,
            email: createUserDto.email,
            role: createUserDto.role,
            password_hash,
        }

        await this.usersService.create(valid_user)

        return {
            success: true,
            message: "User created.",
            data: null,
        }
    }
}
