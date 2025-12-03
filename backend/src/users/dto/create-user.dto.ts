export class CreateUserDto {
    readonly name: string;
    readonly email: string;
    readonly password_hash: string;
    readonly role: string;
}
