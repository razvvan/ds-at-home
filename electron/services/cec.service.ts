import { exec } from 'child_process';
import log from 'electron-log';

export class CECService {
  withCEC: boolean;

  constructor(withCEC: boolean) {
    this.withCEC = withCEC;
  }

  powerOn = (): void => {
    if (!this.withCEC) { return; }

    exec('/usr/bin/bash -c "echo \'pow 0\' | cec-client -s -d 2; echo \'as\' | cec-client -s -d 2"', (err, stdout, stderr) => {
      log.error(err);
      log.info(stdout);
      log.warn(stderr);
    });
  };

  powerOff = (): void => {
    if (!this.withCEC) { return; }

    exec('/usr/bin/bash -c "echo \'standby 0\' | cec-client -s -d 2"', (err, stdout, stderr) => {
      log.error(err);
      log.info(stdout);
      log.warn(stderr);
    });
  };
}
