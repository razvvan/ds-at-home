import { app, BrowserWindow, Menu } from 'electron';
import * as fs from 'fs';
import * as storage from 'electron-json-storage';
import log from 'electron-log';

import { AppMenu } from './menu';
import { DisplayService } from './services/display.service';
import { GroupsService } from './services/groups.service';
import { CronService } from './services/cron.service';
import { KeysService } from './services/keys.service';
import { CECService } from './services/cec.service';
import { addIPCListeners } from './ipc';
import { Group, AppConfig } from '../src/models/web_content.model';
import { errHandler } from './lib';

interface CmdArgs {
  fullScreen: boolean
  singleTouch: boolean
  loadFromFile: string
  withCEC: boolean
}

function getCmdArgs(): CmdArgs {
  return {
    fullScreen: app.commandLine.getSwitchValue('full-screen') === 'true',
    singleTouch: app.commandLine.getSwitchValue('single-touch') === 'true',
    loadFromFile: app.commandLine.getSwitchValue('load-from-file'),
    withCEC: app.commandLine.getSwitchValue('with-cec') === 'true'
  };
}

let mainWindow: BrowserWindow | null;

function startApp() {
  const cmdArgs = getCmdArgs();

  mainWindow = createWindow(cmdArgs.fullScreen);
  mainWindow.on('closed', () => {
    log.info('mainWindow closed');
    mainWindow = null;
  });

  if (!app.isPackaged){
    mainWindow.webContents.openDevTools();
  }

  const displayService = new DisplayService(mainWindow, errHandler);
  const groupsService = new GroupsService(displayService.showURL);

  log.info('storage saved in:',  storage.getDefaultDataPath());

  if (cmdArgs.loadFromFile !== '') {
    // load from file
    const data: Group[] = JSON.parse(fs.readFileSync(cmdArgs.loadFromFile).toString());
    if (data === undefined) {
      const newErr = 'failed loading from: ' + cmdArgs.loadFromFile;
      errHandler(newErr as never);
    }

    storage.set('app_config', <AppConfig>{groups: data, settings: { defaultGroup: 0 }}, errHandler);

    groupsService.set(data);
  } else {
    // load from storage
    storage.get('app_config', (err: never, appConfig: AppConfig) => {
      if (err !== undefined) {
        errHandler(err);
        return;
      }

      groupsService.set(appConfig.groups, appConfig.settings.defaultGroup);
    });
  }

  const cecService = new CECService(cmdArgs.withCEC);

  const cronService = new CronService(3, groupsService.nextItem);
  cronService.start();

  addIPCListeners();

  const keysService = new KeysService(
      !cmdArgs.singleTouch,
      cronService.start,
      cronService.stop,
      groupsService.next,
      groupsService.currentGroupService.next,
      groupsService.currentGroupService.prev,
      cecService.powerOff,
      cecService.powerOn
    );

  const appMenu = new AppMenu(mainWindow, displayService, cronService, keysService, groupsService);
  const menu = Menu.buildFromTemplate(appMenu.buildMenu());
  Menu.setApplicationMenu(menu);
}

function createWindow(fullScreen: boolean): BrowserWindow {
  return new BrowserWindow({
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    },
    fullscreen: fullScreen,
    width: 1600, height: 1024,
    x: 0,
    y: 0
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', startApp);
app.on('activate', () => {
  if (mainWindow === null) {
    startApp();
  }
});
