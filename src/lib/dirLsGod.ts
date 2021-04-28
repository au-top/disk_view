import fs from "fs";
import path from "path";
import {sizeUnit} from "./sizeUnit";
export interface mapDeskInfo {
  path: string;
  fileSizeB: number;
  date: number;
  child: mapDeskInfo[];
}
export interface resAsync<dataType> {
  err: any;
  data: dataType;
  filePath?: any;
}
export interface DirLsGodOption {
  useError?: boolean;
  cacheTime?: number;
  ignoreSize?:number
}

class DirLsGod {
  deskMap: Map<string, mapDeskInfo>;
  deskCacheTime: number = 60 * 1000; //60 s
  useLogError: boolean;
  ignoreSize:number;
  
  constructor(option?: DirLsGodOption) {
    this.useLogError = option?.useError ?? true;
    this.deskCacheTime = option?.cacheTime ?? 145 * 1000;
    this.deskMap = new Map<string, mapDeskInfo>();
    this.ignoreSize = option?.ignoreSize??sizeUnit.MB*130;
  }

  errorLog(info: any) {
    if (this.useLogError) console.log(info);
  }

  async lookDir(lookPath: string): Promise<mapDeskInfo|null> {
    lookPath = path.resolve(__dirname, lookPath);
    if (
      (!this.deskMap.has(lookPath)) ||
      this.deskMap.get(lookPath)!.date + this.deskCacheTime < Date.now()
    ) {
      const res = await new Promise<resAsync<string[]>>((res, rej) =>
        fs.readdir(lookPath, (err, files) => res({ err, data: files }))
      );

      if (res.err != null){
        console.log('ReadDirError',res.err);
        // is error  return null is 0 
        return null;
      }

      const resFileLietState = (res.data as string[]).map(
        (element) =>
          new Promise<resAsync<fs.Stats>>((res, rej) => {
            const filePath = path.resolve(lookPath, element);
            return fs.stat(filePath, (err, data) =>
              res({ err, data, filePath: filePath })
            );
          })
      );

      const resFileListRes = await Promise.all(resFileLietState);

      const resFileList = (
        await Promise.all(
          resFileListRes.map(async (tarState) => {
            if (tarState.err != null)
              return void this.errorLog(tarState.err) || undefined;
            if (tarState.data.isDirectory())
              return await this.lookDir(
                path.resolve(__dirname, tarState.filePath)
              );
            if (tarState.data.isFile()) {
              return this.setCacheInfo(
                tarState.filePath,
                tarState.data.size,
                []
              );
           }
            return undefined;
          })
        )
      ).filter((v) => v !== undefined && v !== null) as mapDeskInfo[];
      const dirSize = resFileList.reduce(
        (a: number, v) => a + (v.fileSizeB ?? 0),
        0
      );
      
      const resFileListFilter=resFileList.filter(v=>v.fileSizeB>this.ignoreSize)
      
      this.setCacheInfo(lookPath, dirSize, resFileListFilter);

    }
    return this.deskMap.get(lookPath)!;
  }

  setCacheInfo(
    lookPath: string,
    dirSize: number,
    child: mapDeskInfo[]
  ): mapDeskInfo {
    const mapDeskInfoElem: mapDeskInfo = {
      fileSizeB: dirSize,
      date: Date.now(),
      path: lookPath,
      child: child,
    };
    this.deskMap.set(lookPath, mapDeskInfoElem);
    return mapDeskInfoElem;
  }
}

export { DirLsGod };

// const startDate = Date.now();

// lookDir("../../../../").then((v) => {
//   console.log(v / 1024 / 1024, "M");
//   console.log("run use time ", Date.now() - startDate, "MS");
// });

/**
 * lookDir
 * path
 */
// lookDir('c:/')
// lookDir('/')
// lookDir('./')
// lookDir('../')
// lookDir('../../')
// lookDir('d:/')
