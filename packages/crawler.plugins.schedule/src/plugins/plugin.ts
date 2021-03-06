import * as Seneca from "seneca";
import inversify, { injectable, inject } from "inversify";
import { Plugin, Add, Wrap, Init, Validate } from "crawler.plugins.common";
import * as _ from "lodash";
import * as pathToRegexp from "path-to-regexp";
import * as Joi from "joi";

import { pluginResultName } from "../constants";
import { ExecutePluginService } from "../libs/plugin";
import { PageModel } from "../models/page";

@Plugin(pluginResultName)
@injectable()
export class PluginPlugin {

    /**
     * 执行插件列表的服务
     */
    @inject(ExecutePluginService)
    private pluginService: ExecutePluginService;

    /**
    * 找到当前queueItem对应的规则配置
    * @param queueItem 链接的数据
    * @param pages     定义的page
    */
    @Add(`role:${pluginResultName},cmd:getFieldFlow`)
    private getFieldFlow(
        { queueItem, pages }: { queueItem: any, pages: Array<PageModel> }
        ): Array<any> | null {

        if (!queueItem || !queueItem.url) {
            console.log("queueItem 为空，或格式不正确！");
            return [];
        }
        console.log("开始爬取：------------", queueItem, queueItem.url);

        let rules = _.filter(pages, ({ path }) => {
            let pathToReg = pathToRegexp(path.toString(), []);

            return pathToReg.test(queueItem.path || "");
        });

        if (!rules.length) {
            console.error(`没有找到${queueItem.path}的匹配规则！`);
            return [];
        }

        return rules[0].msgFlow || [];
    }

    /**
     * 测试一个流
     * @param config        流配置
     * @param options       seneca的options
     * @param globalOptions 全局options
     */
    @Add(`role:${pluginResultName},cmd:testFlow`)
    private async testFlow(
        @Validate(Joi.object().keys({
            msgFlow: Joi.array().required(),
            data: Joi.object().required()
        }).required(), { allowUnknown: true }) config: any,
        options?: any,
        globalOptions?: any
        ): Promise<any> {
        return await this.pluginService.executePlugins(options.seneca, config.msgFlow, config.data || {});
    }

    /**
     * 测试一个流
     * @param config        流配置
     * @param options       seneca的options
     * @param globalOptions 全局options
     */
    @Add(`role:${pluginResultName},cmd:startNormalFlow`)
    private async startNormalFlow(
        config: any,
        options?: any,
        globalOptions?: any
        ): Promise<any> {
        let data = config.data || {};

        try {
            let rtn = await this.pluginService.executePlugins(options.seneca, config.config.msgFlow, data);

            console.log(data.__META__);

            return rtn;
        } catch (e) {
            console.log("META:", data.__META__);
            throw e;
        }
        // return await this.pluginService.executePlugins(options.seneca, config.config.msgFlow, config.data || {});
    }

    /**
     * 启动流
     * @param config 参数
     * @param options 配置
     */
    @Add(`role:${pluginResultName},cmd:startFlow`)
    private async startFlow(config: any, options?: any): Promise<any> {
        let data = config.data || {};

        try {
            let rtn = await this.pluginService.preExecute(options.seneca, config.config, data);

            console.log(data.__META__);

            return rtn;
        } catch (e) {
            console.log(data.__META__);
            throw e;
        }
    }
}
