import { Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UsersRepository } from '../users/users.repository';
import { User } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersRepository;
    private configService;
    constructor(usersRepository: UsersRepository, configService: ConfigService);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
