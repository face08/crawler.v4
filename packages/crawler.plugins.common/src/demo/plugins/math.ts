


import { injectable, inject } from "inversify";
import * as Seneca from 'seneca';
import * as bluebird from 'bluebird';

import { Plugin, Add, Wrap, Init } from "../../index";
import { aaa } from "../aaa";

@Plugin("math-plugin", {})
@injectable()
export class MathPlugin {
    constructor( @inject(aaa) private aa: aaa) {
        // aa.aaaa.push("234234");
    }

    @Init()
    init(a: any, b: any, c: any): Promise<any> {
        return new Promise(async (resolve: (value?: any | PromiseLike<any>) => void, reject: (reason?: any) => void) => {
            await bluebird.delay(2000);

            resolve();
        });
    }

    @Wrap("role:math")
    wrap(msg: any) {
        if (!msg.ddd) {
            msg.ddd = 10;
        }

        console.log(this.aa.aaaa.length);
    }

    @Add("role:math,cmd:add")
    add(msg: any): { data: number } {
        this.aa.aaaa.push("234234");
        return { data: msg.left + msg.right };
    }

    @Add("role:math,cmd:remove")
    async remove(msg: any): Promise<{ data: number }> {
        this.aa.aaaa.push("234234");
        console.log(this.aa.aaaa.length);

        if (!msg.ddd) {
            throw new Error("缺少参数！");
        }

        return { data: msg.left - msg.right + msg.ddd };
    }
}