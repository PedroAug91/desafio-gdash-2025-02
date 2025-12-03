import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): Record<string, string | boolean | null> {
        const response = {
            sucess: true,
            message: "Api working.",
            data: null
        };
        return response;
    }
}
