import log from 'electron-log';

import { globalShortcut } from 'electron';

export class KeysService {
  prefix: string;
  cronStart: () => void;
  cronStop: () => void;
  nextGroup: () => void;
  nextItem: () => void;
  prevItem: () => void;

  constructor(
    withCTRL: boolean,
    cronStart: () => void,
    cronStop: () => void,
    nextGroup: () => void,
    nextItem: () => void,
    prevItem: () => void
  ) {

    this.prefix = 'CommandOrControl+Shift+';

    if (!withCTRL) {
      this.prefix ='';
    }

    this.cronStart = cronStart;
    this.cronStop = cronStop;
    this.nextGroup = nextGroup;
    this.nextItem = nextItem;
    this.prevItem = prevItem;

    this.register();
  }

  register(): void {
    globalShortcut.register(`${this.prefix}N`, () => {
      this.nextGroup();
    });

    globalShortcut.register(`${this.prefix}P`, () => {
      this.cronStop();
    });

    globalShortcut.register(`${this.prefix}R`, () => {
      this.cronStart();
    });

    globalShortcut.register(`${this.prefix}H`, () => {
      log.info('power off');
    });

    globalShortcut.register(`${this.prefix}J`, () => {
      log.info('power on');
    });

    globalShortcut.register(`${this.prefix}Left`, () => {
      this.nextItem();
    });

    globalShortcut.register(`${this.prefix}Right`, () => {
      this.prevItem();
    });
  }

  unregister(): void {
    globalShortcut.unregisterAll();
  }
}