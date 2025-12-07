export interface User {
    name: string;
    role: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
    };
}

export interface WeatherData {
    _id: string;
    latitude: number;
    longitude: number;
    elevation: number;
    current_weather: {
        time: { start: number; end: number };
        temperature: number;
        relative_humidity: number;
        weather_code: number;
        wind_speed: number;
    };
    hourly_weather: {
        time: { start: number; end: number };
        temperature: number; 
        relative_humidity: number;
        weather_code: number;
        wind_speed: number;
    };
    ai_Insights: string;
}
