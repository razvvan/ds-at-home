import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { WebItem } from '../../src/models/web_content.model';

export class DisplayService {
  mainWindow: BrowserWindow;
  errHandler: (_err: never) => void;

  userAgent = 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';

  constructor(mainWindow: BrowserWindow, errHandler: (_err: never) => void) {
    this.mainWindow = mainWindow;
    this.errHandler = errHandler;
  }

  goBack = (): void => {
    this.mainWindow.webContents.goBack();
  };

  showURL = (wc: WebItem): void => {
    if (this.mainWindow === undefined) {
      log.error('mainWindow not ready');
      return;
    }

    log.debug('will load', wc);

    this.mainWindow.loadURL(wc.url, { userAgent: this.userAgent }).catch(this.errHandler);

    this.mainWindow.webContents.once('dom-ready', () => {

      this.mainWindow.webContents.setZoomFactor(wc.zoom || 1);

      this.mainWindow.webContents.executeJavaScript(`
        window.scrollTo(0, ${wc.scroll_to || 0});
      `);

      if (wc.prepend_element_by_class_to_body !== '') {
        this.mainWindow.webContents.executeJavaScript(`
        document.body.prepend(document.getElementsByClassName('${wc.prepend_element_by_class_to_body}')[0])
      `);
      }

      if (wc.prepend_element_by_id_to_body !== '') {
        this.mainWindow.webContents.executeJavaScript(`
        document.body.prepend(document.getElementById('${wc.prepend_element_by_id_to_body}'))
      `);
      }
    });
  };
}
