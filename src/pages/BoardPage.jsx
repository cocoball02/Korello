import React, { useState } from 'react';
import queryString from 'query-string';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import BoardList from '../components/board/BoardList';
import CardList from '../components/card/CardList';
import { initializeUser, useGetApi } from '../api/index.js';
const BoardPage = ({ match, history, location }) => {
  const [update, setUpdate] = useState(false);
  const [data, code] = useGetApi('get', '/boards', update, history);

  return (
    <Router>
      <Nav />
      <Route
        path={match.path}
        render={props => (
          <BoardList
            {...props}
            data={data}
            update={update}
            setUpdate={setUpdate}
          />
        )}
      />
      <Route
        path={`${match.path.slice(0, match.path.length - 1)}/:id/cards`}
        component={CardList}
      />
    </Router>
  );
};

export default BoardPage;
