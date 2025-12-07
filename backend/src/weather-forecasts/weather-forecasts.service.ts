import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Response } from "express";
import * as ExcelJS from "exceljs";
import { Weather, WeatherDocument } from "./schemas/weather-forecast.schema";
import { CreateWeatherForecastDto } from "./dto/create-weather.dto";

@Injectable()
export class WeatherForecastsService {
    constructor(
        @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
    ) {}

    async create(createWeatherDto: CreateWeatherForecastDto): Promise<Weather> {
        const createdWeather = new this.weatherModel(createWeatherDto);
        return createdWeather.save();
    }

    async getInsights(id: string) {
        const weather = await this.findOne(id);
        const aiInsights = await this.generateWeatherInsights(weather);
        return {
            ai_Insights: aiInsights
        };
    }

    async findOne(id: string) {
        const weather = await this.weatherModel
            .findById(id)
            .select("-__v")
            .exec()

        if (!weather) {
            throw new NotFoundException("No weather data found");
        }

        return weather;

    }

    async findLatest() {
        const weather = await this.weatherModel
            .findOne()
            .select("-__v")
            .sort({ "current_weather.time.start": -1 })
            .exec();

        if (!weather) {
            throw new NotFoundException("No weather data found");
        }

        return weather;
    }

    async remove(id: string): Promise<Weather> {
        const deletedWeather = await this.weatherModel
            .findByIdAndDelete(id)
            .exec();
        if (!deletedWeather) {
            throw new NotFoundException(`Weather data with ID ${id} not found`);
        }
        return deletedWeather;
    }

    async exportToJson(weatherData: Weather[], res: Response): Promise<void> {
        const filename = `weather-export-${Date.now()}.json`;
        res.setHeader("Content-Type", "application/json");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`,
        );
        res.send(JSON.stringify(weatherData, null, 2));
    }

    async exportToCsv(weatherData: Weather[], res: Response): Promise<void> {
        const filename = `weather-export-${Date.now()}.csv`;

        const flatData = weatherData.map((weather: any) => ({
            id: weather._id,
            latitude: weather.latitude,
            longitude: weather.longitude,
            elevation: weather.elevation,
            current_time_start: weather.current_weather.time.start,
            current_time_end: weather.current_weather.time.end,
            current_temperature: weather.current_weather.temperature,
            current_humidity: weather.current_weather.relative_humidity,
            current_weather_code: weather.current_weather.weather_code,
            current_wind_speed: weather.current_weather.wind_speed,
            hourly_time_start: weather.hourly_weather.time.start,
            hourly_time_end: weather.hourly_weather.time.end,
            hourly_temperatures: JSON.stringify(
                weather.hourly_weather.temperature,
            ),
            hourly_humidity: JSON.stringify(
                weather.hourly_weather.relative_humidity,
            ),
            hourly_weather_codes: JSON.stringify(
                weather.hourly_weather.weather_code,
            ),
            hourly_wind_speeds: JSON.stringify(
                weather.hourly_weather.wind_speed,
            ),
            created_at: weather.createdAt,
            updated_at: weather.updatedAt,
        }));

        type FlatWeatherForecastData = (typeof flatData)[0];

        const headers = Object.keys(flatData[0] || {}) as Array<
            keyof FlatWeatherForecastData
            >;
        const csvRows = [
            headers.join(","),
            ...flatData.map((row) =>
                headers
                .map((header) => {
                    const value = row[header];
                    if (
                        typeof value === "string"
                            && (value.includes(",") || value.includes('"'))
                    ) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                })
                .join(","),
            ),
        ];

        const csvContent = csvRows.join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`,
        );
        res.send(csvContent);
    }

    async exportToXlsx(weatherData: Weather[], res: Response): Promise<void> {
        const filename = `weather-export-${Date.now()}.xlsx`;
        const workbook = new ExcelJS.Workbook();

        const summarySheet = workbook.addWorksheet("Weather Summary");
        summarySheet.columns = [
            { header: "ID", key: "id", width: 25 },
            { header: "Latitude", key: "latitude", width: 15 },
            { header: "Longitude", key: "longitude", width: 15 },
            { header: "Elevation", key: "elevation", width: 12 },
            {
                header: "Current Time Start",
                key: "current_time_start",
                width: 18,
            },
            { header: "Current Time End", key: "current_time_end", width: 18 },
            { header: "Current Temp", key: "current_temp", width: 12 },
            { header: "Current Humidity", key: "current_humidity", width: 15 },
            { header: "Current Weather Code", key: "current_code", width: 18 },
            { header: "Current Wind Speed", key: "current_wind", width: 16 },
            { header: "Created At", key: "created_at", width: 20 },
            { header: "Updated At", key: "updated_at", width: 20 },
        ];

        weatherData.forEach((weather: any) => {
            summarySheet.addRow({
                id: weather._id.toString(),
                latitude: weather.latitude,
                longitude: weather.longitude,
                elevation: weather.elevation,
                current_time_start: weather.current_weather.time.start,
                current_time_end: weather.current_weather.time.end,
                current_temp: weather.current_weather.temperature,
                current_humidity: weather.current_weather.relative_humidity,
                current_code: weather.current_weather.weather_code,
                current_wind: weather.current_weather.wind_speed,
                created_at: weather.createdAt,
                updated_at: weather.updatedAt,
            });
        });

        summarySheet.getRow(1).font = { bold: true };
        summarySheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" },
        };

        if (weatherData.length > 0) {
            const hourlySheet = workbook.addWorksheet("Hourly Data Sample");
            const firstWeather: any = weatherData[0];

            hourlySheet.columns = [
                { header: "Hour Index", key: "index", width: 12 },
                { header: "Temperature", key: "temp", width: 15 },
                { header: "Humidity", key: "humidity", width: 15 },
                { header: "Weather Code", key: "code", width: 15 },
                { header: "Wind Speed", key: "wind", width: 15 },
            ];

            const maxLength = Math.max(
                firstWeather.hourly_weather.temperature?.length || 0,
                firstWeather.hourly_weather.relative_humidity?.length || 0,
                firstWeather.hourly_weather.weather_code?.length || 0,
                firstWeather.hourly_weather.wind_speed?.length || 0,
            );

            for (let i = 0; i < maxLength; i++) {
                hourlySheet.addRow({
                    index: i,
                    temp: firstWeather.hourly_weather.temperature?.[i],
                    humidity:
                    firstWeather.hourly_weather.relative_humidity?.[i],
                    code: firstWeather.hourly_weather.weather_code?.[i],
                    wind: firstWeather.hourly_weather.wind_speed?.[i],
                });
            }

            hourlySheet.getRow(1).font = { bold: true };
            hourlySheet.getRow(1).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFE0E0E0" },
            };
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`,
        );

        await workbook.xlsx.write(res);
        res.end();
    }

    private async generateWeatherInsights(weather: any): Promise<string> {
        try {
            const weatherCode = this.getWeatherDescription(weather.current_weather.weather_code);

            const prompt = `Based on the following weather data, provide brief, practical insights for someone in this location:

Location: Latitude ${weather.latitude}, Longitude ${weather.longitude}
Temperature: ${weather.current_weather.temperature.toFixed(1)}°C
Humidity: ${weather.current_weather.relative_humidity}%
Wind Speed: ${weather.current_weather.wind_speed.toFixed(1)} km/h
Weather Condition: ${weatherCode}

Provide 2-3 concise, actionable insights about:
- How it feels and what to expect
- Activity recommendations
- Any weather-related precautions

Keep the response under 150 words and make it friendly and conversational.`;

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                }) 
            })

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content
        } catch (error) {
            console.error('Error generating AI insights:', error);
            return 'AI insights temporarily unavailable.';
        }
    }

    private getWeatherDescription(code: number): string {
        const weatherCodes: { [key: number]: string } = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail',
        };
        return weatherCodes[code] || 'Unknown';
    }
}
