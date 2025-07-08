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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const request_entity_1 = require("./request.entity");
const roles_enum_1 = require("../users/roles.enum");
let RequestsService = class RequestsService {
    constructor(requestsRepository) {
        this.requestsRepository = requestsRepository;
    }
    async create(createRequestDto, user) {
        const request = this.requestsRepository.create({
            ...createRequestDto,
            mda: user.mda,
            createdById: user.id,
            status: createRequestDto.isJoint ? 'Awaiting Co-Submitter Approval' : 'Pending Review',
        });
        return this.requestsRepository.save(request);
    }
    async findAll(user, mda) {
        const universalRoles = [roles_enum_1.Role.MoF, roles_enum_1.Role.IAA, roles_enum_1.Role.Minister, roles_enum_1.Role.Admin];
        if (universalRoles.includes(user.role)) {
            if (mda && mda !== 'All MDAs') {
                return this.requestsRepository.find({ where: [{ mda: mda }, { partnerMda: mda }] });
            }
            else {
                return this.requestsRepository.find();
            }
        }
        return this.requestsRepository.find({ where: [{ mda: user.mda }, { partnerMda: user.mda }] });
    }
    async findForReview() {
        const statusesForReview = ['Pending Review', 'Awaiting Co-Submitter Approval'];
        return this.requestsRepository.find({ where: { status: (0, typeorm_2.In)(statusesForReview) } });
    }
    async update(id, updateRequestDto, user) {
        const request = await this.requestsRepository.findOneBy({ id });
        if (!request) {
            throw new Error('Request not found');
        }
        if (updateRequestDto.reviewComments) {
            const newComment = { by: user.fullName, date: new Date().toISOString(), comment: updateRequestDto.reviewComments };
            request.reviewComments = request.reviewComments ? [...request.reviewComments, newComment] : [newComment];
            delete updateRequestDto.reviewComments;
        }
        Object.assign(request, updateRequestDto);
        return this.requestsRepository.save(request);
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(request_entity_1.Request)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RequestsService);
//# sourceMappingURL=requests.service.js.map