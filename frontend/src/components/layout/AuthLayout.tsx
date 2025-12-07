import { Outlet, Navigate } from "react-router";
import { isAuthenticated } from "@/lib/auth";

export const AuthLayout = () => {
    if (isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
                <Outlet />
            </div>
        </div>
    );
};
