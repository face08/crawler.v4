import * as inversify from "inversify";
import { Container } from "inversify";
import { Types as CommonTypes, PluginBase } from "crawler.plugins.common";

import { Types } from "./constants";
import { CombineFunc } from "./libs/funcs/combine";
import { MomentFunc } from "./libs/funcs/moment";
import { JparseFunc } from "./libs/funcs/jparse";
import { QsFunc } from "./libs/funcs/qs";


import { TransformExexutePlugin } from "./plugins/execute";

export const container: inversify.interfaces.Container = new Container();

container.bind<CombineFunc>(Types.FUNC).to(CombineFunc);
container.bind<MomentFunc>(Types.FUNC).to(MomentFunc);
container.bind<JparseFunc>(Types.FUNC).to(JparseFunc);
container.bind<QsFunc>(Types.FUNC).to(QsFunc);

container.bind<PluginBase>(CommonTypes._plugin).to(TransformExexutePlugin).inSingletonScope().whenAnyAncestorNamed("TransformExexutePlugin");
