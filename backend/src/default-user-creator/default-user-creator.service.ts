import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class DefaultUserCreatorService implements OnModuleInit {
    private readonly logger = new Logger(DefaultUserCreatorService.name);

    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
    ) {}

    async onModuleInit() {
        this.logger.log("Checking for default user...");

        // 1. Read configuration from environment variables
        const name = this.configService.get<string>("API_DEFAULT_USER");
        const email = this.configService.get<string>("API_DEFAULT_EMAIL");
        const password = this.configService.get<string>("API_DEFAULT_PASSWORD");
        const role = this.configService.get<string>("API_DEFAULT_ROLE");

        if (!email || !password) {
            this.logger.warn(
                "Default user creation skipped: Missing EMAIL or PASSWORD environment variables.",
            );
            return;
        }

        const existingUser = await this.userService.findOne(email);

        if (existingUser) {
            this.logger.log(
                `Default user with email: ${email} already exists. Skipping creation.`,
            );
            return;
        }

        const saltRounds = 10;
        const password_hash = bcrypt.hashSync(password, saltRounds);
        try {
            const defaultUserDto: CreateUserDto = {
                name: name || "Default Admin",
                email,
                password_hash,
                role: role || "ADMIN", // Ensure this role exists in your application logic
            };

            await this.userService.create(defaultUserDto);
            this.logger.log(`Successfully created default user: ${email}`);
        } catch (error) {
            this.logger.error("Failed to create default user.", error.stack);
        }
    }
}
