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
exports.Request = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let Request = class Request {
};
exports.Request = Request;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Request.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Request.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Request.prototype, "mda", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Request.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Request.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'funding_source' }),
    __metadata("design:type", String)
], Request.prototype, "fundingSource", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'budget_line', nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "budgetLine", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'submitted_date' }),
    __metadata("design:type", Date)
], Request.prototype, "submittedDate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'last_updated' }),
    __metadata("design:type", Date)
], Request.prototype, "lastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by_id', nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], Request.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Request.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'local_content_percentage', nullable: true }),
    __metadata("design:type", Number)
], Request.prototype, "localContentPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_joint', default: false }),
    __metadata("design:type", Boolean)
], Request.prototype, "isJoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'partner_mda', nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "partnerMda", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mda_contribution', type: 'numeric', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Request.prototype, "mdaContribution", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'partner_contribution', type: 'numeric', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Request.prototype, "partnerContribution", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'review_comments', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Request.prototype, "reviewComments", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'risk_score', nullable: true }),
    __metadata("design:type", Number)
], Request.prototype, "riskScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'risk_analysis', nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "riskAnalysis", void 0);
exports.Request = Request = __decorate([
    (0, typeorm_1.Entity)('requests')
], Request);
//# sourceMappingURL=request.entity.js.map