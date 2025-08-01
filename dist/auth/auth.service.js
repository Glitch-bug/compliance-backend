"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const users_repository_1 = require("../users/users.repository");
const roles_enum_1 = require("../users/roles.enum");
let AuthService = class AuthService {
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger('AuthService');
    }
    async login(authCredentialsDto) {
        const universalRoles = [roles_enum_1.Role.MoF, roles_enum_1.Role.IAA, roles_enum_1.Role.Minister, roles_enum_1.Role.Admin];
        const user = await this.usersRepository.validateUserPassword(authCredentialsDto);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isUniversal = universalRoles.includes(user.role);
        this.logger.debug(`universal ${isUniversal} role ${user.role}`);
        if (!isUniversal && user.mda != authCredentialsDto.mda) {
            throw new common_1.UnauthorizedException('You can only access your assigned MDA');
        }
        const payload = { username: user.username };
        const accessToken = this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
        const userProfile = {
            ...user,
            activeMda: authCredentialsDto.mda,
        };
        return { accessToken, user: userProfile };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_repository_1.UsersRepository)),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map