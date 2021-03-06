"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify = require("inversify");
var inversify_1 = require("inversify");
var modelproxy_1 = require("modelproxy");
var inversify_binding_decorators_1 = require("inversify-binding-decorators");
var crawler_plugins_common_1 = require("crawler.plugins.common");
var request_1 = require("./engines/request");
var superagent_1 = require("./engines/superagent");
var phantom_1 = require("./engines/phantom");
var constants_1 = require("./constants");
var proxy_1 = require("./proxy");
var download_1 = require("./plugins/download");
exports.container = new inversify_1.Container();
exports.provider = inversify_binding_decorators_1.makeFluentProvideDecorator(exports.container);
inversify.decorate(inversify.injectable(), modelproxy_1.modelProxy.Compose);
inversify.decorate(inversify.injectable(), modelproxy_1.modelProxy.BaseEngine);
exports.container.bind(proxy_1.Proxy).to(proxy_1.Proxy).inSingletonScope();
exports.container.bind(constants_1.Types.engine).to(request_1.RequestEngine).inSingletonScope();
exports.container.bind(constants_1.Types.engine).to(superagent_1.SuperAgentEngine).inSingletonScope();
exports.container.bind(constants_1.Types.engine).to(phantom_1.PhantomEngine).inSingletonScope();
exports.container.bind(crawler_plugins_common_1.Types._plugin).to(download_1.DownloadPlugin).inSingletonScope().whenNoAncestorNamed("DownloadPlugin");
//# sourceMappingURL=container.js.map