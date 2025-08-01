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
exports.AuthCredentialsDto = void 0;
const class_validator_1 = require("class-validator");
class AuthCredentialsDto {
}
exports.AuthCredentialsDto = AuthCredentialsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Username should not be empty.' }),
    (0, class_validator_1.MinLength)(4, { message: 'Username must be at least 4 characters long.' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Username must be at most 20 characters long.' }),
    __metadata("design:type", String)
], AuthCredentialsDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password should not be empty.' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long.' }),
    (0, class_validator_1.MaxLength)(32, { message: 'Password must be at most 32 characters long.' }),
    __metadata("design:type", String)
], AuthCredentialsDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "MDA must be selected" }),
    __metadata("design:type", String)
], AuthCredentialsDto.prototype, "mda", void 0);
//# sourceMappingURL=auth-credentials.dto.js.map