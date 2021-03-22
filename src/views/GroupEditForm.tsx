/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const { ipcRenderer } = window.require('electron');
import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import {
  Button, TextField,
  Table, TableRow, TableHead,
  TableFooter, TableBody, TableCell,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { Group, WebItem } from '../models/web_content.model';

const GroupEditForm: React.FC<{ groupIndex: number, group: Group }> = ({ groupIndex, group }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: group.name,
      links: group.links.map((webItem) => ({
        zoom: webItem.zoom,
        scroll_to: webItem.scroll_to,
        url: webItem.url,
        prepend_element_by_class_to_body: webItem.prepend_element_by_class_to_body,
        prepend_element_by_id_to_body: webItem.prepend_element_by_id_to_body,
      }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  });

  const history = useHistory();

  return (

    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={4}>
            <Controller
              name="name"
              as={<TextField variant="outlined" label="Group" fullWidth />}
              control={control}
              defaultValue={group.name}
            />
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {fields.map((item, index) => (
          <React.Fragment key={item.id}>
            <TableRow>
              <TableCell>
                <Controller
                  name={`links[${index}].url`}
                  control={control}
                  as={<TextField variant="outlined" size="small" label="URL" fullWidth />}
                  defaultValue={item.url}
                />
              </TableCell>

              <TableCell style={{ width: '20%' }}>
                <Controller
                  name={`links[${index}].zoom`}
                  control={control}
                  as={<TextField variant="outlined" size="small" label="Zoom (def: 1)" />}
                  defaultValue={item.zoom}
                />
              </TableCell>

              <TableCell style={{ width: '15%' }}>
                <Controller
                  name={`links[${index}].scroll_to`}
                  control={control}
                  as={<TextField variant="outlined" size="small" label="Scroll (px)" />}
                  defaultValue={item.scroll_to || 0}
                />
              </TableCell>

              <TableCell style={{ width: '5%' }}>
                <IconButton onClick={() => { remove(index); }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Controller
                  name={`links[${index}].prepend_element_by_class_to_body`}
                  control={control}
                  as={<TextField variant="outlined" size="medium" label="Zoom in on Element with class name" />}
                  defaultValue={item.prepend_element_by_class_to_body || ''}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`links[${index}].prepend_element_by_id_to_body`}
                  control={control}
                  as={<TextField variant="outlined" size="medium" label="Zoom in on Element with id" />}
                  defaultValue={item.prepend_element_by_id_to_body || ''}
                />
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell>
            <Button
              type="button"
              variant="contained"
              color="default"
              onClick={() => { append({ url: '', zoom: 1 }); }}
            >
              Add URL
          </Button>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell align="right" colSpan={4}>
            <Button onClick={() => {
              history.push('/');
            }}>Cancel</Button>
            <Button
              color="primary"
              variant="contained"
              type="button"
              onClick={handleSubmit((data: Group) => {
                const newGroup = data;
                newGroup.links = newGroup.links.map((link): WebItem => {
                  return {
                    url: link.url,
                    scroll_to: Number(link.scroll_to),
                    zoom: Number(link.zoom),
                    prepend_element_by_class_to_body: link.prepend_element_by_class_to_body,
                    prepend_element_by_id_to_body: link.prepend_element_by_id_to_body,
                  };
                });
                ipcRenderer.send('save_group', data, groupIndex);
                history.push('/');
              })}
            >
              Save
          </Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default GroupEditForm;
