import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

/*
 * Hello, how you doin?
 *
 * You might be thinking to yourself: "Wow, there are so little properties for this schema"
 * And the reason for that is:
 * (...drumroll)
 * Because we don't really need much for this project's scope, just the basics for auth.
 * That's it.
 * */

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password_hash: string;

    @Prop({ enum: ["ADMIN", "USER"], default: "USER" })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
