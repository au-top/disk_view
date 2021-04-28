import fs from "fs";
import os from "os";
import path from "path";
export function getLogicDisk(): string[] {
  switch (os.type()) {
    case "Linux": //linux
    case "Darwin": //macos
      return ["/"];
    case "Windows_NT": { //win
      return new Array(26)
        .fill("0")
        .map((v, i) => String.fromCharCode("a".charCodeAt(0) + i))
        .map((v) => {
          try {
            fs.statSync(`${v}:\\`);
            return path.resolve(`${v}:\\`) ;
          } catch {
            return undefined;
          }
        })
        .filter((v) => v !== undefined && v !== null) as string[];
    }
    default: {
      return ["/"];
    }
  }
}
