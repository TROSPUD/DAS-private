/* eslint-disable @typescript-eslint/indent */

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router';
import { App } from './App';
import './index.scss';
import { history, store } from './store';

const Root = (
    <DndProvider backend={HTML5Backend}>
        <Provider store={store}>
            <Router history={history}>
                <Route path='/:token?' component={App} />
                {/* <App /> */}
            </Router>
        </Provider>
    </DndProvider>
);


ReactDOM.render(Root, document.getElementById('root-layout') as HTMLElement);
