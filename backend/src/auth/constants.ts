import { ConfigService } from "@nestjs/config";

const configService = new ConfigService()
export const jwtConstant = { secret: configService.getOrThrow("JWT_SECRET") };
