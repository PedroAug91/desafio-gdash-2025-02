import { createBrowserRouter, redirect } from "react-router";
import { api } from "@/lib/api";
import { isAuthenticated, setToken } from "@/lib/auth";
import type { AuthResponse } from "@/types";

import { Dashboard } from "@/pages/Dashboard";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignUpPage";
import { AuthLayout } from "@/components/layout/AuthLayout";

export const router = createBrowserRouter([
    {
        path: "/",
        loader: async () => {
            if (!isAuthenticated()) {
                return redirect("/login");
            }
            try {
                const response = await api.get("/weather/latest");
                return response.data;
            } catch (error) {
                return redirect("/login");
            }
        },
        element: <Dashboard />,
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
                action: async ({ request }) => {
                    const formData = await request.formData();
                    const email = formData.get("email") as string;
                    const password = formData.get("password") as string;

                    try {
                        const res = await api.post<AuthResponse>("/auth/signin", { email, password });
                        if (res.data.success) {
                            setToken(res.data.data.token);
                            return redirect("/");
                        }
                    } catch (error: any) {
                        return error.response?.data?.message || "Invalid credentials";
                    }
                    return null;
                },
            },
            {
                path: "/signup",
                element: <SignupPage />,
                action: async ({ request }) => {
                    const formData = await request.formData();
                    const email = formData.get("email") as string;
                    const password = formData.get("password") as string;
                    const name = formData.get("name") as string;

                    try {
                        await api.post("/auth/signup", { email, password, name });
                        return redirect("/login");
                    } catch (error: any) {
                        return error.response?.data?.message || "Registration failed";
                    }
                },
            },
        ],
    },
]);
