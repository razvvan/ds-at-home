const { ipcRenderer } = window.require('electron');
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import {
  Button, Table, TableHead,
  TableBody, TableRow, TableCell, TableFooter
} from '@material-ui/core';

import { AppConfig } from '../models/web_content.model';

const GroupsView: React.FC = () => {
  const [appConfig, setAppConfig] = useState<AppConfig>({ groups: [], settings: { defaultGroup: 0 } });

  ipcRenderer.on('get_app_config_reply', (event: never, appConfig: AppConfig) => {
    setAppConfig(appConfig);
  });

  useEffect(() => {
    ipcRenderer.send('get_app_config');
  }, []);

  const history = useHistory();

  return (
    <Table>
      <TableHead>
        <TableCell>Group</TableCell>
        <TableCell align="center">Default</TableCell>
        <TableCell></TableCell>
      </TableHead>
      <TableBody>
        {appConfig.groups.map((group, index) => (
          <TableRow key={group.name}>
            <TableCell>
              {group.name}
            </TableCell>

            <TableCell align="center">
              {appConfig.settings.defaultGroup == index ? (<span>✅</span>) : null}
            </TableCell>

            <TableCell align="right">

              {appConfig.settings.defaultGroup !== index ? (
                <Button
                  onClick={() => {
                    ipcRenderer.send('set_default_group', index);
                    setInterval(() => { ipcRenderer.send('get_app_config'); }, 100);
                  }}
                >Set as Default</Button>
              ) : null}

              <Link to={`/groups/${index}/edit`}>
                <Button>Edit</Button>
              </Link>

              <Button
                onClick={() => {
                  if (confirm('are you sure?')) {
                    ipcRenderer.send('delete_group', index);
                    setInterval(() => { ipcRenderer.send('get_app_config'); }, 100);
                  }
                }}
              >Delete</Button>

            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow><TableCell colSpan={3} align="right">
          <Button color="primary" onClick={() => {
            ipcRenderer.send('add_new_group', '');
            history.push('/groups/add');
          }}>New Group</Button>
        </TableCell></TableRow>
      </TableFooter>
    </Table>
  );
};

export default GroupsView;
