import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { SignInDTO } from './dto/signIn.dto';
import { SignUpDTO } from './dto/signUp.dto';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async signin(signInDTO: SignInDTO) {
        console.log(signInDTO);
        const user = await this.usersService.findOne(signInDTO.email);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isMatch = bcrypt.compareSync(signInDTO.password, user.password_hash)

        if (!isMatch) {
            throw new UnauthorizedException("Invalid credentials.");
        }

        const payload = { name: user.name, role: user.role };

        return this.jwtService.signAsync(payload);
    }

    async signup(signUpDTO: SignUpDTO) {
        const saltRounds = 10;
        const password_hash = bcrypt.hashSync(signUpDTO.password, saltRounds);

        const valid_user: User = {
            name: signUpDTO.name,
            email: signUpDTO.email,
            password_hash,
            role: "USER"
        }

        return await this.usersService.create(valid_user)
    }
}
