const { ipcRenderer } = window.require('electron');
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { List, ListItem, Button } from '@material-ui/core';

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
    <List>
      {appConfig.groups.map((group, index) => (
        <ListItem key={group.name}>
          <p>{group.name}</p>
          {appConfig.settings.defaultGroup == index ? (<p>*</p>) : null}
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

          <Button
            onClick={() => {
              ipcRenderer.send('set_default_group', index);
              setInterval(() => { ipcRenderer.send('get_app_config'); }, 100);
            }}
          >Set as Default</Button>
        </ListItem>
      ))}

      <ListItem>
        <Button onClick={() => {
          ipcRenderer.send('add_new_group', '');
          history.push('/groups/add');
        }}>Add</Button>
      </ListItem>
    </List>
  );
};

export default GroupsView;
