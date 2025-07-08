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
exports.ChecklistsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_decorator_1 = require("../shared/user.decorator");
const user_entity_1 = require("../users/user.entity");
const roles_guard_1 = require("../auth/guards/roles.guard");
const checklists_service_1 = require("./checklists.service");
const create_active_checklist_dto_1 = require("./dto/create-active-checklist.dto");
const update_active_checklist_dto_1 = require("./dto/update-active-checklist.dto");
let ChecklistsController = class ChecklistsController {
    constructor(checklistsService) {
        this.checklistsService = checklistsService;
    }
    createActive(createDto, user) {
        return this.checklistsService.createActiveChecklist(createDto, user);
    }
    findAllActive(user, mda) {
        return this.checklistsService.findAllActive(user, mda);
    }
    updateActive(id, updateDto) {
        console.log(`update DTO : ${JSON.stringify(updateDto)}`);
        return this.checklistsService.updateActiveChecklist(id, updateDto);
    }
    findAllTemplates() {
        return this.checklistsService.findAllTemplates();
    }
};
exports.ChecklistsController = ChecklistsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('roles', ['MDA']),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_active_checklist_dto_1.CreateActiveChecklistDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ChecklistsController.prototype, "createActive", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('mda')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], ChecklistsController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('roles', ['MDA']),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_active_checklist_dto_1.UpdateActiveChecklistDto]),
    __metadata("design:returntype", void 0)
], ChecklistsController.prototype, "updateActive", null);
__decorate([
    (0, common_1.Get)('/templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChecklistsController.prototype, "findAllTemplates", null);
exports.ChecklistsController = ChecklistsController = __decorate([
    (0, common_1.Controller)('checklists'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:paramtypes", [checklists_service_1.ChecklistsService])
], ChecklistsController);
//# sourceMappingURL=checklists.controller.js.map