import * as path from 'path';
import * as url from 'url';

export function adminURL(): string {
  return process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  });
}
