/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const { ipcRenderer } = window.require('electron');
import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import {
  Button, TextField, Card,
  Divider, List, ListItem,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { Group } from '../models/web_content.model';

const GroupEditForm: React.FC<{ groupIndex: number, group: Group }> = ({ groupIndex, group }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: group.name,
      links: group.links.map((webItem) => ({
        zoom: webItem.zoom,
        scroll_to: webItem.scroll_to,
        url: webItem.url
      }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  });

  const history = useHistory();

  return (
    <Card>
      <List>
        <ListItem>
          <Controller
            name="name"
            as={<TextField variant="outlined" label="Group" style={{ width: '46ch' }} />}
            control={control}
            defaultValue={group.name}
          />
        </ListItem>

        <Divider />

        {fields.map((item, index) => (
          <ListItem key={item.id}>
            <Controller
              name={`links[${index}].url`}
              control={control}
              as={<TextField variant="outlined" size="small" label="URL" fullWidth />}
              defaultValue={item.url}
            />

            <Controller
              name={`links[${index}].zoom`}
              control={control}
              as={<TextField variant="outlined" size="small" label="Zoom (def: 1)" />}
              defaultValue={item.zoom}
            />

            <Controller
              name={`links[${index}].scroll_to`}
              control={control}
              as={<TextField variant="outlined" size="small" label="Scroll (px)" />}
              defaultValue={item.scroll_to || 0}
            />

            <ListItemSecondaryAction>
              <IconButton onClick={() => { remove(index); }}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}

        <ListItem>
          <Button
            type="button"
            variant="contained"
            color="default"
            onClick={() => { append({ url: '', zoom: '1' }); }}
          >
            Add
          </Button>
          <ListItemSecondaryAction>
            <Button
              color="primary"
              variant="contained"
              type="button"
              onClick={handleSubmit((data) => {
                ipcRenderer.send('save_group', data, groupIndex);
                history.push('/');
              })}
            >
              Save
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Card >
  );
};

export default GroupEditForm;
