import { Form, Link, useActionData, useNavigation } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export const LoginPage = () => {
    const navigation = useNavigation();
    const error = useActionData() as string | undefined;
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Or <Link to="/signup" className="text-blue-600 hover:underline">create an account</Link>
                </p>
            </div>

            <Form method="post" className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                </Button>
            </Form>
        </div>
    );
};
