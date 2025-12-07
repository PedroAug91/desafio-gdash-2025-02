import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDTO } from "./dto/signIn.dto";
import type { ResponseSchema } from "src/common/types";
import { SignUpDTO } from "./dto/signUp.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("signin")
    async signIn(@Body() signInDTO: SignInDTO): Promise<ResponseSchema> {
        const token = await this.authService.signin(signInDTO);
        return {
            success: true,
            message: "User authenticated.",
            data: { token },
        };
    }

    @Post("signup")
    async signUp(@Body() signUpDTO: SignUpDTO): Promise<ResponseSchema> {
        await this.authService.signup(signUpDTO);
        return { success: true, message: "User created.", data: null };
    }
}
