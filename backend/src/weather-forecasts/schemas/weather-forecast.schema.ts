import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type WeatherDocument = HydratedDocument<Weather>;

@Schema({ _id: false })
export class TimeRange {
    @Prop({ required: true })
    start: number;

    @Prop({ required: true })
    end: number;
}

const TimeRangeSchema = SchemaFactory.createForClass(TimeRange);

@Schema({ _id: false })
export class CurrentWeather {
    @Prop({ type: TimeRangeSchema, required: true })
    time: TimeRange;

    @Prop({ required: true })
    temperature: number;

    @Prop({ required: true })
    relative_humidity: number;

    @Prop({ required: true })
    weather_code: number;

    @Prop({ required: true })
    wind_speed: number;
}

const CurrentWeatherSchema = SchemaFactory.createForClass(CurrentWeather);

@Schema({ _id: false })
export class HourlyWeather {
    @Prop({ type: TimeRangeSchema, required: true })
    time: TimeRange;

    @Prop({ type: [Number], required: true })
    temperature: number[];

    @Prop({ type: [Number], required: true })
    relative_humidity: number[];

    @Prop({ type: [Number], required: true })
    weather_code: number[];

    @Prop({ type: [Number], required: true })
    wind_speed: number[];
}

const HourlyWeatherSchema = SchemaFactory.createForClass(HourlyWeather);

@Schema({ timestamps: true })
export class Weather {
    @Prop({ required: true })
    latitude: number;

    @Prop({ required: true })
    longitude: number;

    @Prop({ required: true })
    elevation: number;

    @Prop({ type: CurrentWeatherSchema, required: true })
    current_weather: CurrentWeather;

    @Prop({ type: HourlyWeatherSchema, required: true })
    hourly_weather: HourlyWeather;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
WeatherSchema.index({ latitude: 1, longitude: 1 });
WeatherSchema.index({ "current_weather.time.start": -1 });
