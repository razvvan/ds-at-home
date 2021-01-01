import * as net from 'net';
import * as childProcess from 'child_process';
import log from 'electron-log';

const port: number = process.env.PORT ? Number.parseInt(process.env.PORT, 10) - 100 : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();
let startedElectron = false;

const tryConnection = () => {
  client.connect(
    { port },
    () => {
      client.end();

      if (!startedElectron) {
        startedElectron = true;
        log.info('starting electron');

        // const cmd = 'nodemon -V --watch "build" --exec "electron . --load-from-file=./links.json" --inspect=5858';
        const cmd = 'nodemon -V --watch "build" --exec "electron ." --inspect=5858';

        const cp =  childProcess.exec(cmd, {
          windowsHide: false,
        });

        cp.stdout.on('data', (data) => {
          log.info(`stdout: ${data}`);
        });

        cp.stderr.on('data', (data) => {
          log.error(`stderr: ${data}`);
        });
      }
    }
  );
};

tryConnection();

client.on('error', (err) => {
  log.info('Retrying...', err);
  setTimeout(tryConnection, 1000);
});
