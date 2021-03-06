"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const seneca_service_1 = require("./seneca.service");
const seneca_controller_1 = require("./seneca.controller");
const err_1 = require("../../middlewares/err");
let SenecaModule = class SenecaModule {
    configure(consumer) {
        consumer.apply(err_1.ErrorMiddleware).forRoutes(seneca_controller_1.SenecaController);
        return consumer;
    }
};
SenecaModule = __decorate([
    common_1.Module({
        components: [
            seneca_service_1.SenecaService
        ],
        controllers: [seneca_controller_1.SenecaController],
        modules: [],
    })
], SenecaModule);
exports.SenecaModule = SenecaModule;
//# sourceMappingURL=seneca.module.js.map