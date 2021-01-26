import { globalShortcut } from 'electron';
import log from 'electron-log';

export class KeysService {
  prefix: string;
  cronStart: () => void;
  cronStop: () => void;
  nextGroup: () => void;
  nextItem: () => void;
  prevItem: () => void;
  powerOff: () => void;
  powerOn: () => void;
  goBack: () => void;

  constructor(
    withCTRL: boolean,
    cronStart: () => void,
    cronStop: () => void,
    nextGroup: () => void,
    nextItem: () => void,
    prevItem: () => void,
    powerOff: () => void,
    powerOn: () => void,
    goBack: () => void,
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
    this.powerOff = powerOff;
    this.powerOn = powerOn;
    this.goBack = goBack;

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
      this.powerOff();
    });

    globalShortcut.register(`${this.prefix}J`, () => {
      this.powerOn();
    });

    globalShortcut.register(`${this.prefix}Left`, () => {
      this.prevItem();
    });

    globalShortcut.register(`${this.prefix}Right`, () => {
      this.nextItem();
    });

    globalShortcut.register(`${this.prefix}B`, () => {
      this.goBack();
    });

    globalShortcut.register('CommandOrControl+Shift+D', () => {
      log.info('turn global shortcuts off');
      globalShortcut.unregisterAll();

      globalShortcut.register('CommandOrControl+Shift+D', () => {
        log.info('turn global shortcuts on');
        globalShortcut.unregisterAll();
        this.register();
      });
    });
  }

  unregister(): void {
    globalShortcut.unregisterAll();
  }
}