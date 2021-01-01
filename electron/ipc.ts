import { ipcMain, IpcMainEvent } from 'electron';
import { Group, AppConfig } from '../src/models/web_content.model';
import log from 'electron-log';
import * as storage from 'electron-json-storage';
import { errHandler } from './lib';

export function addIPCListeners(): void {
  log.info('addIPCListeners()');

  ipcMain.on('get_app_config', (event: IpcMainEvent) => {
    storage.get('app_config', (err: never, appConfig: AppConfig) => {
      if (err !== undefined) {
        errHandler(err);
        return;
      }

      event.reply('get_app_config_reply', appConfig);
    });
  });

  ipcMain.on('save_group', (event: IpcMainEvent, group: Group, idx: number) => {
    log.info('ipcMain save_groups');
    storage.get('app_config', (err: never, appConfig: AppConfig) => {
      if (err !== undefined) {
        errHandler(err);
        return;
      }

      const newGroups = appConfig.groups;
      newGroups[idx] = group;
      appConfig.groups = newGroups;

      storage.set('app_config', appConfig, errHandler);
    });
  });

  ipcMain.on('delete_group', (event: IpcMainEvent, idx: number) => {
    storage.get('app_config', (err: never, appConfig: AppConfig) => {
      if (err !== undefined) {
        errHandler(err);
        return;
      }

      const newGroups = appConfig.groups;
      newGroups[idx] = newGroups[newGroups.length - 1];
      newGroups.pop();
      appConfig.groups = newGroups;

      storage.set('app_config', appConfig, errHandler);
    });
  });

  ipcMain.on('get_default_group', (event: IpcMainEvent) => {
    storage.get('app_config', (err: never, appConfig: AppConfig) => {
      event.reply('get_default_group_reply', appConfig.settings.defaultGroup);
    });
  });

  ipcMain.on('set_default_group', (event: IpcMainEvent, idx: number) => {
    storage.get('app_config', (err: never, appConfig: AppConfig) => {
      appConfig.settings.defaultGroup = idx;
      storage.set('app_config', appConfig, errHandler);
    });
  });
}
