import React, { Fragment, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Navigation from './components/Navigation/Navigation';
import SellersPage from './pages/Sellers/Sellers';
import SellsPage from './pages/Sells/Sells';

import './App.scss'
import ReportContextProvider, { ReportContext } from './context/ReportContext';
import Loader from './components/Loader/Loader';

function App() {

  const { loading } = useContext(ReportContext);

  return (
    <Fragment>
      <Router>
        <ReportContextProvider>
            <Navigation />
            {
              loading ? <Loader />
              : <Switch>
                  <Route path='/sellers' component={SellersPage} />
                  <Route path='/sells' component={SellsPage} />
                  <Redirect to='/'/>
                </Switch>
            }
        </ReportContextProvider>  
      </Router>    
    </Fragment>
  );
}

export default App;
