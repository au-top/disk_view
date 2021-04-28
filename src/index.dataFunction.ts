import { ChartSunburstNodeData } from "d2b/src/types";
import { chartSunburst } from "d2b";
import { select } from "d3";

import { sizeUnit } from "./lib/sizeUnit";
import { DirLsGod, mapDeskInfo } from "./lib/dirLsGod";
interface viewDeskInfoNode extends mapDeskInfo {
  children: viewDeskInfoNode | ChartSunburstNodeData | mapDeskInfo[];
  label: string;
  descendantLevels: number;
  size:number;
}

export const dlg = new DirLsGod({
  useError: false,
  ignoreSize: sizeUnit.MB * 90,
});

export const lookPath = async (LookPathRoot:string) => {
  //root node
  const startDate= Date.now();
  const rootNode = (await dlg.lookDir(LookPathRoot)) as viewDeskInfoNode;
  console.log(` ${LookPathRoot} from dist use time  ${(Date.now()-startDate)/1000}s`);

  {
    const viewNodeModuleIterable = Array.from(dlg.deskMap.entries()) as [
        string,
        viewDeskInfoNode
      ][];
      viewNodeModuleIterable.forEach((v) => {
        v[1].children = v[1].child;
        v[1].label = v[1].path.split("/").pop() ?? "Name is Not Get";
        v[1].size = v[1].fileSizeB / sizeUnit.MB;
      });
  }
  console.log(` ${LookPathRoot} use time   ${(Date.now()-startDate)/1000}s`);
  

  const viewNodeModule: ChartSunburstNodeData = rootNode;
  const sunburst: any = chartSunburst();
  const chart = select("#diskMapBox");
  chart.datum(viewNodeModule).call(sunburst.advanced);
  window.addEventListener("resize", function () {
    chart.call(sunburst.advanced);
  });
};
