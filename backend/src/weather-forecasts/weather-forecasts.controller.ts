import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
} from "@nestjs/common";

import { WeatherForecastsService } from "./weather-forecasts.service";
import { CreateWeatherForecastDto } from "./dto/create-weather.dto";
import { AuthGuard } from "src/auth/auth.guard";

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

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("latest")
    findLatest() {
        return this.weatherForecastsService.findLatest();
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("insights/:_id")
    getInsights(@Param() params: any) {
        return this.weatherForecastsService.getInsights(params._id);
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param("id") id: string) {
        return this.weatherForecastsService.remove(id);
    }
}
