import React from 'react';
import {
  Switch,
  Route,
  HashRouter
} from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme, CssBaseline, Paper, withWidth } from '@material-ui/core';
import { blue, deepOrange } from '@material-ui/core/colors';
import classNames from 'classnames';
import 'react-perfect-scrollbar/dist/css/styles.css';

import './App.css';
import GroupsView from '../views/GroupsView';
import GroupEdit from '../views/GroupEdit';
import GroupAdd from '../views/GroupAdd';

const currentHours = new Date().getHours();
const gdgTheme = createMuiTheme({
  'palette': {
    'primary': blue,
    'secondary': deepOrange,
    'type': currentHours > 8 && currentHours < 22 ? 'light' : 'dark'
  }
});

const App: React.FC = () => {
  return (
    <HashRouter>
      <MuiThemeProvider theme={gdgTheme}>
        <CssBaseline />
        <div className="App">
          <section className={classNames({
            'App__section': true,
            'App__section--small': false
          })}>
            <Paper className={classNames({
              'App__paper': true,
              'App__paper--small': false
            })}>
              <Switch>
                <Route path="/" exact>
                  <GroupsView />
                </Route>

                <Route path="/groups/add">
                  <GroupAdd />
                </Route>

                <Route path="/groups/:id/edit">
                  <GroupEdit />
                </Route>
              </Switch>
            </Paper>
          </section>
        </div>
      </MuiThemeProvider>
    </HashRouter>
  );
};

export default withWidth()(App);
