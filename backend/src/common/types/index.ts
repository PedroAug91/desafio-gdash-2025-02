export type ResponseSchema<T = any> = {
    success: boolean;
    message: string;
    data: T | null;
}
