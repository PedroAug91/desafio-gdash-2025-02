import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from './constants';

@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: jwtConstant.secret,
            signOptions: {
                expiresIn: "3h",
            }
        })
    ],
    exports: [AuthService],
})
export class AuthModule {}
