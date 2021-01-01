import * as path from 'path';
import * as url from 'url';
import { app } from 'electron';


export function fileURL(fileName: string): string {
  if (!app.isPackaged) {
    return url.format({
      pathname: path.join(__dirname, '../../../electron/assets', fileName),
      protocol: 'file:',
      slashes: true
    });
  } else {
    return url.format({
      pathname: path.join(process.resourcesPath, 'electron-assets', fileName),
      protocol: 'file:',
      slashes: true
    });
  }
}
