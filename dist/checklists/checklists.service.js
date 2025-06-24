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
exports.ChecklistsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const active_checklist_entity_1 = require("./active-checklist.entity");
const checklist_template_entity_1 = require("./checklist-template.entity");
let ChecklistsService = class ChecklistsService {
    constructor(activeChecklistsRepository, checklistTemplatesRepository) {
        this.activeChecklistsRepository = activeChecklistsRepository;
        this.checklistTemplatesRepository = checklistTemplatesRepository;
    }
    async createActiveChecklist(createDto, user) {
        const template = await this.checklistTemplatesRepository.findOneBy({ id: createDto.templateId });
        if (!template) {
            throw new common_1.NotFoundException(`Template with ID "${createDto.templateId}" not found`);
        }
        const checklistItems = template.items.map(itemText => ({ text: itemText, completed: false }));
        const activeChecklist = this.activeChecklistsRepository.create({
            templateId: template.id,
            name: `${template.name} - ${new Date().toLocaleDateString()}`,
            mda: user.mda,
            status: 'In Progress',
            items: checklistItems,
        });
        return this.activeChecklistsRepository.save(activeChecklist);
    }
    async findAllActive(user) {
        const universalRoles = ['MoF Compliance', 'IAA Auditor', 'Minister', 'System Admin'];
        if (universalRoles.includes(user.role)) {
            return this.activeChecklistsRepository.find();
        }
        return this.activeChecklistsRepository.find({ where: { mda: user.mda } });
    }
    async updateActiveChecklist(id, updateDto) {
        const checklist = await this.activeChecklistsRepository.findOneBy({ id });
        if (!checklist) {
            throw new common_1.NotFoundException(`Checklist with ID "${id}" not found`);
        }
        checklist.items = updateDto.items;
        const isCompleted = checklist.items.every(item => item.completed);
        checklist.status = isCompleted ? 'Completed' : 'In Progress';
        return this.activeChecklistsRepository.save(checklist);
    }
    async findAllTemplates() {
        return this.checklistTemplatesRepository.find();
    }
};
exports.ChecklistsService = ChecklistsService;
exports.ChecklistsService = ChecklistsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(active_checklist_entity_1.ActiveChecklist)),
    __param(1, (0, typeorm_1.InjectRepository)(checklist_template_entity_1.ChecklistTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ChecklistsService);
//# sourceMappingURL=checklists.service.js.map