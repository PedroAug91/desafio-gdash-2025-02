import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { WeatherForecastsModule } from "./weather-forecasts/weather-forecasts.module";
import { DefaultUserCreatorService } from "./default-user-creator/default-user-creator.service";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.getOrThrow<string>("MONGODB_URI"),
            }),
        }),
        UsersModule,
        AuthModule,
        WeatherForecastsModule,
    ],
    controllers: [AppController],
    providers: [AppService, DefaultUserCreatorService],
})
export class AppModule {}
