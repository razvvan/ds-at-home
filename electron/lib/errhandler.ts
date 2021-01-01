import log from 'electron-log';

export function errHandler(err: never): void {
  log.error(err);
}
