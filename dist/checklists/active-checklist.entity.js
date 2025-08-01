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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveChecklist = void 0;
const typeorm_1 = require("typeorm");
const checklist_template_entity_1 = require("./checklist-template.entity");
let ActiveChecklist = class ActiveChecklist {
};
exports.ActiveChecklist = ActiveChecklist;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ActiveChecklist.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_id' }),
    __metadata("design:type", String)
], ActiveChecklist.prototype, "templateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => checklist_template_entity_1.ChecklistTemplate),
    (0, typeorm_1.JoinColumn)({ name: 'template_id' }),
    __metadata("design:type", checklist_template_entity_1.ChecklistTemplate)
], ActiveChecklist.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActiveChecklist.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActiveChecklist.prototype, "mda", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActiveChecklist.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Array)
], ActiveChecklist.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ActiveChecklist.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ActiveChecklist.prototype, "updatedAt", void 0);
exports.ActiveChecklist = ActiveChecklist = __decorate([
    (0, typeorm_1.Entity)('active_checklists')
], ActiveChecklist);
//# sourceMappingURL=active-checklist.entity.js.map