import { Module } from "@nestjs/common";
import { WeatherForecastsService } from "./weather-forecasts.service";
import { WeatherForecastsController } from "./weather-forecasts.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Weather, WeatherSchema } from "./schemas/weather-forecast.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Weather.name, schema: WeatherSchema },
        ]),
    ],
    controllers: [WeatherForecastsController],
    providers: [WeatherForecastsService],
    exports: [WeatherForecastsService],
})
export class WeatherForecastsModule {}
