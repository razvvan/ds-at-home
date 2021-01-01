const { ipcRenderer } = window.require('electron');
import React, { useEffect, useState } from 'react';

import { AppConfig } from '../models/web_content.model';
import GroupEditForm from './GroupEditForm';

const GroupEdit: React.FC = () => {
  const [appConfig, setAppConfig] = useState<AppConfig>({ groups: [], settings: { defaultGroup: 0 } });

  ipcRenderer.on('get_app_config_reply', (event: never, appConfig: AppConfig) => {
    setAppConfig(appConfig);
  });

  useEffect(() => {
    ipcRenderer.send('get_app_config');
  }, []);

  return (<GroupEditForm groupIndex={appConfig.groups.length} group={{ name: '', links: [] }} />);
};

export default GroupEdit;
