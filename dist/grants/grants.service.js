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
exports.GrantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const grant_entity_1 = require("./grant.entity");
const roles_enum_1 = require("../users/roles.enum");
let GrantsService = class GrantsService {
    constructor(grantsRepository) {
        this.grantsRepository = grantsRepository;
    }
    async create(createGrantDto, user) {
        console.log(`user fro backend: ${user.mda}`);
        const grant = this.grantsRepository.create({
            ...createGrantDto,
            mda: user.mda,
            status: 'Active',
        });
        return this.grantsRepository.save(grant);
    }
    async findAll(user, mda) {
        const universalRoles = [roles_enum_1.Role.MoF, roles_enum_1.Role.IAA, roles_enum_1.Role.Minister, roles_enum_1.Role.Admin];
        if (universalRoles.includes(user.role)) {
            if (mda && mda !== 'All MDAs') {
                return this.grantsRepository.find({ where: { mda: mda } });
            }
            else {
                return this.grantsRepository.find();
            }
        }
        return this.grantsRepository.find({ where: { mda: user.mda } });
    }
    async findOne(id) {
        const grant = await this.grantsRepository.findOneBy({ id });
        if (!grant) {
            throw new common_1.NotFoundException(`Grant with ID "\${id}" not found`);
        }
        return grant;
    }
    async remove(id) {
        const result = await this.grantsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Grant with ID "\${id}" not found`);
        }
    }
};
exports.GrantsService = GrantsService;
exports.GrantsService = GrantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(grant_entity_1.Grant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GrantsService);
//# sourceMappingURL=grants.service.js.map