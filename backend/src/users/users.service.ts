import { ConflictException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const createdUser = new this.userModel(createUserDto);
        if (await this.findOne(createdUser.email)) {
            throw new ConflictException("Email already in use.");
        }

        return createdUser.save();
    }

    findAll() {
        return this.userModel
            .find()
            .select(["_id", "name", "email"])
            .lean()
            .exec();
    }

    findOne(email: string): Promise<User | null> {
        return this.userModel
            .findOne({ email: email })
            .select(["_id", "name", "email", "role", "password_hash"])
            .lean()
            .exec();
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
