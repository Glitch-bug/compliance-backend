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
exports.GrantsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_decorator_1 = require("../shared/user.decorator");
const user_entity_1 = require("../users/user.entity");
const roles_guard_1 = require("../auth/guards/roles.guard");
const grants_service_1 = require("./grants.service");
const create_grant_dto_1 = require("./dto/create-grant.dto");
const roles_enum_1 = require("../users/roles.enum");
const public_decorator_1 = require("../auth/decorator/public.decorator");
let GrantsController = class GrantsController {
    constructor(grantsService) {
        this.grantsService = grantsService;
    }
    create(createGrantDto, user) {
        return this.grantsService.create(createGrantDto, user);
    }
    findAll(user) {
        console.log(`get response ${user}`);
        return this.grantsService.findAll(user);
    }
    findOne(id) {
        return this.grantsService.findOne(id);
    }
    remove(id) {
        return this.grantsService.remove(id);
    }
};
exports.GrantsController = GrantsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('roles', ['MDA']),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_grant_dto_1.CreateGrantDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, public_decorator_1.Roles)(roles_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "remove", null);
exports.GrantsController = GrantsController = __decorate([
    (0, common_1.Controller)('grants'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:paramtypes", [grants_service_1.GrantsService])
], GrantsController);
//# sourceMappingURL=grants.controller.js.map