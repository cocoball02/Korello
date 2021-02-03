import React, { useState } from 'react';
import { useGetApi } from '../../api/index';
import BoardForm from './BoardForm';
import NewBoardForm from './NewBoardForm';

const BoardList = ({ match }) => {
  const [update, setUpdate] = useState(false);
  const [data, code, loading] = useGetApi('get', '/boards', update);
  const [display, setDisplay] = useState(false);

  const onClickHandler = () => {
    setDisplay(p => !p);
  };
  const makeRecentBoards = () => {
    let lastView = JSON.parse(localStorage.getItem('lastView'));
    if (lastView !== null && lastView.length > 0) {
      let boards = lastView
        .map(element => {
          return data.filter(e => e.id === element)[0];
        })
        .filter(el => el);
      return boards;
    } else {
      return [];
    }
  };
  let recentList = makeRecentBoards();

  const renderRecentBoards = () => {
    return recentList.map(el => {
      return (
        <BoardForm
          key={el.id}
          url={match.path}
          data={el}
          setUpdate={setUpdate}
        />
      );
    });
  };
  const renderBoards = () => {
    console.log('Boards');
    return data
      .sort((a, b) => Date.parse(a.createDate) - Date.parse(b.createDate))
      .map(el => {
        return (
          <BoardForm
            key={el.id}
            url={match.path}
            data={el}
            setUpdate={setUpdate}
          />
        );
      });
  };
  return (
    <div id='board-container'>
      <div id='board-sidebar'>
        <nav className='board-sidebar-nav'>
          <div className='nav1'>
            <a className='board-sidebar-boards' href='/boards'>
              Boards
            </a>
          </div>
        </nav>
      </div>
      {loading ? (
        <div id='board-list-container'>
          <h3>Loading...</h3>
        </div>
      ) : (
        <div id='board-list-container'>
          {recentList.length > 0 ? (
            <div>
              <div className='list-type'>
                <span className='recent'></span>
                <h3>Recently Viewed</h3>
              </div>
              <div id='board-list'>{renderRecentBoards()}</div>
            </div>
          ) : null}
          <div className='list-type'>
            <span className='workspace'></span>
            <h3>Workspace</h3>
          </div>
          <div id='board-list'>
            {data.length > 0 ? renderBoards() : '데이터가 없습니다.'}
            <div className='board-element'>
              <div
                className='board-el-newform'
                onClick={onClickHandler}
                style={{ display: display ? 'none' : 'block' }}
              >
                <div className='board-title-newform'>
                  <div>Create New Board</div>
                </div>
              </div>
              <NewBoardForm
                onClickHandler={onClickHandler}
                setUpdate={setUpdate}
                display={display}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardList;
