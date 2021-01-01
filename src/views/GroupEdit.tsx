const { ipcRenderer } = window.require('electron');
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AppConfig } from '../models/web_content.model';
import GroupEditForm from './GroupEditForm';

interface ParamTypes {
  id: string
}

const GroupEdit: React.FC = () => {
  const { id } = useParams<ParamTypes>();
  const idx = Number(id);
  const [appConfig, setAppConfig] = useState<AppConfig>({ groups: [], settings: { defaultGroup: 0 } });

  ipcRenderer.on('get_app_config_reply', (event: never, appConfig: AppConfig) => {
    setAppConfig(appConfig);
  });

  useEffect(() => {
    ipcRenderer.send('get_app_config');
  }, []);

  if (appConfig.groups.length - 1 < idx) {
    return (null);
  }

  return (<GroupEditForm groupIndex={idx} group={appConfig.groups[idx]} />);
};

export default GroupEdit;
