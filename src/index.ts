import { getLogicDisk } from "./lib/osPath";
import $ from "jquery";

import { lookPath, dlg } from "./index.dataFunction";

import {
  CreateDiskConTool,
  CreateDiskElem,
  CreateLoadBox,
} from "./index.uiFunction";

let AppLookPath = "";

const initUseDiskList = () => {
  const useDiskElemBox = $(".useDiskList");
  useDiskElemBox.empty();
  const useDiskList = getLogicDisk();
  useDiskList.forEach((v) => {
    const addNode = $(CreateDiskElem(v));
    addNode.on("click", () => {

      $(".diskElem")
        .toArray()
        .forEach((v) => $(v).removeClass("use"));
      addNode.addClass("use");
      AppLookPath = v;

      //clear
      $("#diskMapBox").empty();
      $('.loadTipsBox').toArray().forEach(v=>$(v).remove());

      const chartDom = $("#chart");
      const loadBox = $(CreateLoadBox());
      chartDom.append(loadBox);
      lookPath(AppLookPath).then(() => {
        loadBox.remove();
      });
    });
    useDiskElemBox.append(addNode);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  $("#chart").append(CreateDiskConTool());

  $(".clearAppCache").on("click", () => {
    dlg.deskMap.clear();
    lookPath(AppLookPath);
  });

  $(".reDiskListButton").on("click", () => {
    initUseDiskList();
  });

  initUseDiskList();
});
