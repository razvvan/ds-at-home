import { app, BrowserWindow } from 'electron';

import { DisplayService } from './services/display.service';
import { WebItem } from '../src/models/web_content.model';
import { CronService } from 'services/cron.service';
import { KeysService } from 'services/keys.service';
import { GroupsService } from 'services/groups.service';

import { adminURL } from './lib/adminurl';

export class AppMenu {
  mainWindow: BrowserWindow;
  displayService: DisplayService;
  cronService: CronService;
  keysService: KeysService;
  groupsService: GroupsService;

  isMac = () : boolean => {
    return process.platform === 'darwin';
  };

  constructor(
    mainWindow: BrowserWindow,
    displayService: DisplayService,
    cronService: CronService,
    keysService: KeysService,
    groupsService: GroupsService
  ) {
    this.mainWindow = mainWindow;
    this.displayService = displayService;
    this.cronService = cronService;
    this.keysService = keysService;
    this.groupsService = groupsService;
  }


  buildMenu(): Electron.MenuItemConstructorOptions[] {
    return <Electron.MenuItemConstructorOptions[]>[
      // { role: 'appMenu' }
      ...(this.isMac() ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'toggledevtools' },
          { role: 'reload' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }] : []),
      { role: 'editMenu' },
      {
        label: 'TV',
        submenu: [
          { label: 'Start playlist',
            click: () => {
              this.cronService.start();
              this.keysService.register();
              this.groupsService.nextItem();
            }
          },
          { label: 'Change playlist',
            click: () => {
              this.cronService.start();
              this.keysService.register();
              this.groupsService.next();
            }
          }
        ]
      },
      {
        label: 'Admin',
        submenu: [
          { label: 'Manage Links',
            click: () => {
              this.displayService.showURL(<WebItem>{ url: adminURL() });
              this.cronService.stop();
              this.keysService.unregister();
            }
          }
        ]
      },
    ];
  }
}
