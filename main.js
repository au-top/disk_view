"use strict";

var _electron = require("electron");

function createWindow() {
  var win = new _electron.BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadFile(__dirname + "/index.html");
}

_electron.app.whenReady().then(createWindow);

_electron.app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    _electron.app.quit();
  }
});

_electron.app.on("activate", function () {
  if (_electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
/*
index.html:1 Uncaught (in promise) 
  Error: EPERM: operation not permitted, scandir 'c:\Documents and Settings
*/