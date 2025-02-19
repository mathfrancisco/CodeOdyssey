export class validateEmail {
    static validate(email: string): boolean {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}

export class validatePassword {
    static validate(password: string): boolean {
        return password.length >= 6;
    }
}