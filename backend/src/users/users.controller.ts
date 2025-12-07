import {
    Controller,
    Get,
    // Post,
    Body,
    Patch,
    Param,
    Delete,
    NotFoundException,
    UseGuards,
    Post,
} from "@nestjs/common";
import { UsersService } from "./users.service";
// import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/user.schema";
import type { ResponseSchema } from "src/common/types";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(":id")
    async findOne(@Param("id") id: string): Promise<ResponseSchema<User>> {
        const user = await this.usersService.findOne(id);

        if (!user) {
            throw new NotFoundException("Could not find this specific user.");
        }

        return { success: true, message: "User retrieved.", data: user };
    }

    @UseGuards(AuthGuard)
    @Patch(":id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.usersService.remove(+id);
    }
}
