// File: dto/create-weather.dto.ts
import { IsNumber, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";

export class TimeRangeDto {
    @IsNumber()
    start: number;

    @IsNumber()
    end: number;
}

export class CurrentWeatherDto {
    @ValidateNested()
    @Type(() => TimeRangeDto)
    time: TimeRangeDto;

    @IsNumber()
    temperature: number;

    @IsNumber()
    relative_humidity: number;

    @IsNumber()
    weather_code: number;

    @IsNumber()
    wind_speed: number;
}

export class HourlyWeatherDto {
    @ValidateNested()
    @Type(() => TimeRangeDto)
    time: TimeRangeDto;

    @IsArray()
    @IsNumber({}, { each: true })
    temperature: number[];

    @IsArray()
    @IsNumber({}, { each: true })
    relative_humidity: number[];

    @IsArray()
    @IsNumber({}, { each: true })
    weather_code: number[];

    @IsArray()
    @IsNumber({}, { each: true })
    wind_speed: number[];
}

export class CreateWeatherForecastDto {
    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsNumber()
    elevation: number;

    @ValidateNested()
    @Type(() => CurrentWeatherDto)
    current_weather: CurrentWeatherDto;

    @ValidateNested()
    @Type(() => HourlyWeatherDto)
    hourly_weather: HourlyWeatherDto;
}
