// import { ipcMain } from 'electron';
import { CronJob, CronTime } from 'cron';

// import log from 'electron-log';

export class CronService {
  cronJob: CronJob;

  constructor(minutes: number, onTick: () => void) {
    this.cronJob = new CronJob(`5 */${minutes} * * * *`, () => {
      // ipcMain.emit('hello', 'you')
      onTick();

      // log.info('tick')
    });
  }

  setInterval = (minutes: number): void => {
    if (minutes < 1) {
      minutes = 1;
    }

    this.cronJob.setTime(new CronTime(`5 */${minutes} * * * *`));
  };

  stop = (): void => {
    this.cronJob.stop();
  };

  start = (): void => {
    this.cronJob.start();
    // ipcMain.on('hello', (event, arg) => {
    //   console.log('whut', event, arg)
    // })
  };
}
