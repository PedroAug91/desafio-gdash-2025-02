import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import type { WeatherData } from "@/types";
import { getUser, removeToken } from "@/lib/auth";
import { api } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Thermometer, Wind, Droplets, LogOut, Sparkles, Loader2 } from "lucide-react";

export const Dashboard = () => {
    const weather = useLoaderData() as WeatherData;
    const user = getUser();

    const [insightOpen, setInsightOpen] = useState(false);
    const [insightLoading, setInsightLoading] = useState(false);
    const [insightData, setInsightData] = useState<string | null>(null);

    const handleLogout = () => {
        removeToken();
        window.location.href = "/login";
    };

    const handleGetInsights = async () => {
        setInsightLoading(true);
        setInsightOpen(true);
        setInsightData(null);

        try {
            const response = await api.get(`/weather/insights/${weather._id}`);

            setInsightData(JSON.stringify(response.data.ai_Insights, null, 2)); 
        } catch (error) {
            setInsightData("Failed to generate weather insights. Please try again.");
        } finally {
            setInsightLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Weather Dashboard</h1>
                        <p className="text-slate-500">Welcome back, {user?.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            onClick={handleGetInsights}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Get AI Insights
                        </Button>

                        <Button variant="destructive" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                    </div>
                </div>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Current Conditions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div className="flex items-center space-x-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
                                <Thermometer className="h-8 w-8 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Temperature</p>
                                    <p className="text-2xl font-bold">
                                        {weather.current_weather.temperature.toFixed(1)}°C
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                                <Wind className="h-8 w-8 text-emerald-500" />
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Wind Speed</p>
                                    <p className="text-2xl font-bold">
                                        {weather.current_weather.wind_speed.toFixed(1)} km/h
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 p-4 rounded-lg bg-cyan-50 border border-cyan-100">
                                <Droplets className="h-8 w-8 text-cyan-500" />
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Humidity</p>
                                    <p className="text-2xl font-bold">
                                        {weather.current_weather.relative_humidity}%
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="mt-6 text-xs text-slate-400">
                            Location: {weather.latitude}, {weather.longitude}
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={insightOpen} onOpenChange={setInsightOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-indigo-600" />
                                Weather Analysis
                            </DialogTitle>
                            <DialogDescription>
                                AI-generated insights based on current weather metrics.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 p-4 bg-slate-50 rounded-md min-h-[100px] text-sm text-slate-700">
                            {insightLoading ? (
                                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                    <p>Analyzing weather patterns...</p>
                                </div>
                            ) : (
                                    <pre className="whitespace-pre-wrap font-sans">
                                        {insightData || "No insights available yet."}
                                    </pre>
                                )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};
