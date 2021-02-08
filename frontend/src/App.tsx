import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Navigation from './components/Navigation/Navigation';
import SellersPage from './pages/Sellers/Sellers';
import SellsPage from './pages/Sells/Sells';

import './App.scss'
import ReportContextProvider from './context/ReportContext';

function App() {
  return (
    <Fragment>
      <Router>
        <ReportContextProvider>
            <Navigation />
                <Switch>
                  <Route path='/sellers' component={SellersPage} />
                  <Route path='/sells' component={SellsPage} />
                  <Redirect to='/'/>
                </Switch>
        </ReportContextProvider>  
      </Router>    
    </Fragment>
  );
}

export default App;
