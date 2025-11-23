import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, pass: string) {
        const user = await this.usersService.findByUsername(username);
        if (!user) return null;

        const valid = await bcrypt.compare(pass, user.password);
        if (!valid) return null;

        return { id: user.id, username: user.username, role: user.role };
    }

    async login(user: { id: number; username: string; role: string }) {
        const payload = { sub: user.id, username: user.username, role: user.role };

        // Access token
        const accessToken = this.jwtService.sign(payload);

        // Refresh token
        const refreshToken = this.jwtService.sign(
            { sub: user.id },
            { expiresIn: "7d", secret: process.env.JWT_REFRESH_TOKEN_SECRET }
        );

        // Save refresh token in DB
        await this.usersService.setRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    }

    async logout(userId: number) {
        await this.usersService.setRefreshToken(userId, null);
        return { ok: true };
    }

    async refreshToken(refreshToken: string) {
        try {
            // Verify token
            const decoded: any = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_TOKEN_SECRET
            });

            // Check token matches DB
            const found = await this.usersService.findByRefreshToken(refreshToken);
            if (!found) throw new UnauthorizedException("Invalid refresh token");

            const payload = { sub: found.id, username: found.username, role: found.role };

            // Generate new access token
            const newAccessToken = this.jwtService.sign(payload);

            // Generate new refresh token
            const newRefreshToken = this.jwtService.sign(
                { sub: found.id },
                { expiresIn: "7d", secret: process.env.JWT_REFRESH_TOKEN_SECRET }
            );

            await this.usersService.setRefreshToken(found.id, newRefreshToken);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (err) {
            throw new UnauthorizedException("Could not refresh tokens");
        }
    }

async register(username: string, password: string) {
    // Check if the username already exists
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
        throw new UnauthorizedException("Username already taken");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await this.usersService.create({
        username,
        password: hashedPassword,
        role: "user" // or default role
    });

    return {
        message: "User registered successfully",
        user: {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role
        }
    };
}


}
