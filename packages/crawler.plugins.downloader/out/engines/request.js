"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var modelproxy_1 = require("modelproxy");
var request = require("request-promise");
var inversify_1 = require("inversify");
var url_1 = require("url");
var RequestEngine = /** @class */ (function (_super) {
    __extends(RequestEngine, _super);
    /**
     * 构造
     */
    function RequestEngine() {
        var _this = _super.call(this) || this;
        _this.engineName = "request";
        _this.init();
        return _this;
    }
    /**
     * 初始化中间件
     */
    RequestEngine.prototype.init = function () {
        var _this = this;
        this.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var path, _a, method, _b, _c, data, _d, settings, _e, params, _f, _g, timeout, _h, header, _j, charset, _k, proxyInfo, searchParams, _l, e_1;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        path = this.getFullPath(ctx.instance || {}, ctx.executeInfo || {});
                        _a = (ctx.instance || {}).method, method = _a === void 0 ? "" : _a;
                        _b = ctx.executeInfo || {}, _c = _b.data, data = _c === void 0 ? null : _c, _d = _b.settings, settings = _d === void 0 ? {} : _d, _e = _b.params, params = _e === void 0 ? {} : _e;
                        _f = settings || {}, _g = _f.timeout, timeout = _g === void 0 ? 5000 : _g, _h = _f.header, header = _h === void 0 ? {} : _h, _j = _f.charset, charset = _j === void 0 ? "utf-8" : _j, _k = _f.proxyInfo, proxyInfo = _k === void 0 ? "" : _k;
                        searchParams = new url_1.URLSearchParams();
                        Object.keys(params).forEach(function (key) {
                            if (params[key] !== undefined) {
                                searchParams.append(key, params[key]);
                            }
                        });
                        _m.label = 1;
                    case 1:
                        _m.trys.push([1, 3, , 4]);
                        _l = ctx;
                        return [4 /*yield*/, request(path + (searchParams.toString() ? "?" + searchParams.toString() : ""), {
                                method: method.toString(),
                                body: data,
                                proxy: proxyInfo ? "http://" + proxyInfo : null,
                                charset: charset || "auto",
                                json: true,
                                headers: header,
                                resolveWithFullResponse: true,
                                timeout: timeout
                            }, undefined)];
                    case 2:
                        _l.result = _m.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _m.sent();
                        ctx.err = e_1;
                        ctx.isError = true;
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, next()];
                    case 5:
                        _m.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * 调用接口
     * @param instance 接口的实例
     * @param options  参数
     */
    RequestEngine.prototype.proxy = function (instance, options) {
        return __awaiter(this, void 0, void 0, function () {
            var fn, ctx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fn = this.callback(function () { });
                        ctx = {
                            instance: instance,
                            executeInfo: options,
                        };
                        return [4 /*yield*/, fn(ctx)];
                    case 1:
                        _a.sent();
                        if (ctx.isError) {
                            throw ctx.err;
                        }
                        return [2 /*return*/, ctx.result];
                }
            });
        });
    };
    RequestEngine = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], RequestEngine);
    return RequestEngine;
}(modelproxy_1.modelProxy.BaseEngine));
exports.RequestEngine = RequestEngine;
//# sourceMappingURL=request.js.map