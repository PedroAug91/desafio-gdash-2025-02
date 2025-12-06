import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from "@nestjs/common";

import { WeatherForecastsService } from "./weather-forecasts.service";
import { CreateWeatherForecastDto } from "./dto/create-weather.dto";

@Controller("weather")
export class WeatherForecastsController {
    constructor(
        private readonly weatherForecastsService: WeatherForecastsService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createWeatherDto: CreateWeatherForecastDto) {
        return this.weatherForecastsService.create(createWeatherDto);
    }

    @Get("latest")
    findLatest() {
        return this.weatherForecastsService.findLatest();
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param("id") id: string) {
        return this.weatherForecastsService.remove(id);
    }
}
