import * as request from 'superagent';

import { modelProxy, IProxyCtx, IInterfaceModel, IExecute } from 'modelproxy';
import { injectable } from 'inversify';
import { URLSearchParams } from "url";

@injectable()
export class SuperAgentEngine extends modelProxy.BaseEngine {
    public engineName: string = "superagent";
    /**
     * 构造
     */
    constructor() {
        super();
        this.init();
    }

    /**
     * 初始化中间件
     */
    init(): void {
        this.use(async (ctx: IProxyCtx, next: Function): Promise<any> => {
            let path = this.getFullPath(ctx.instance || {}, ctx.executeInfo || {});
            let { method = "" } = ctx.instance || {};
            let { data = null, settings = {}, params = {} } = ctx.executeInfo || {};
            let { timeout = 5000, header = {} } = settings || {};

            try {
                let curReq: request.SuperAgentRequest = request(method.toString(), path);

                params && curReq.query(params);
                data && curReq.send(data);
                header && curReq.set(header);
                curReq.timeout({
                    response: ~~timeout,
                    deadline: 60000
                })

                ctx.result = await curReq;
                ctx.result.body = ctx.result.text;
            } catch (e) {
                ctx.err = e;
                ctx.isError = true;
            }

            await next();
        });
    }
    /**
     * 调用接口
     * @param instance 接口的实例
     * @param options  参数
     */
    async proxy(instance: IInterfaceModel, options: IExecute): Promise<any> {
        const fn = this.callback(() => { });
        const ctx: IProxyCtx = {
            instance: instance,
            executeInfo: options,
        };

        await fn(ctx);

        if (ctx.isError) {
            throw ctx.err;
        }

        return ctx.result;
    }
}