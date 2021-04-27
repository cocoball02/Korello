import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postData, getRefreshToken } from '../../api';
import styled from 'styled-components';

import { setBoardData } from '../../reducers/board.reducer';
import { db } from '../../firebase';
import { useHistory } from 'react-router';

const NewBoardForm = () => {
  const [boardName, setBoardName] = useState('');
  const [display, setDisplay] = useState(false);
  const { boardlist } = useSelector(state => state.board);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const history = useHistory();

  const addBoard = async e => {
    if (e) {
      e.preventDefault();
    }

    if (boardName.length > 0) {
      let [responseData, code] = await postData('/board', {
        name: boardName,
      });
      if (code === 201) {
        setBoardName('');
        onClickHandler();
        let list = [...boardlist];
        list.push(responseData);
        await db.doc(responseData.id).set({});
<<<<<<< HEAD
        dispatch(setBoardData({ boardlist: list }));
=======
        dispatch(setData({ boardlist: list }));
        history.push(`/board/${responseData.id}/cards`);
>>>>>>> f808f5ee19a4fbe972440c45cc082486736ce31a
      } else if (code >= 401001) {
        await getRefreshToken();
        await addBoard();
      } else {
        alert('생성에 실패했습니다.');
        setBoardName('');
        inputRef.current.focus();
      }
    } else {
      alert('이름을 입력해주세요.');
      inputRef.current.focus();
    }
  };

  const onClickHandler = () => {
    setDisplay(p => !p);
  };

  const onChangeHandler = e => {
    setBoardName(e.target.value);
  };
  useEffect(() => {
    if (display) {
      inputRef.current.focus();
    }
  });
  return (
    <>
      <AddBoardForm>
        {!display ? (
          <AddBoardContainer>
            <div onClick={onClickHandler}>Create New Board</div>
          </AddBoardContainer>
        ) : (
          <AddBoardContainer>
            <form onSubmit={addBoard}>
              <input
                ref={inputRef}
                placeholder='board name'
                value={boardName}
                onChange={onChangeHandler}
              />
              <AddBoardButton name='add' onClick={addBoard}>
                Add
              </AddBoardButton>
            </form>
            <AddBoardButton onClick={onClickHandler}>Cancel</AddBoardButton>
          </AddBoardContainer>
        )}
      </AddBoardForm>
    </>
  );
};

export default NewBoardForm;

const AddBoardForm = styled.div`
  height: 100%;
  background-color: rgba(0, 0, 0, 0.21);
  border-radius: 4px;
`;
const AddBoardContainer = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  position: relative;
  top: 10px;
  div {
    width: 100%;
    height: 100%;
    font-size: 17px;
    font-weight: 500;

    margin-top: 0px;
    margin-bottom: 0px;
    p {
    }
  }
`;
const AddBoardButton = styled.button`
  border-radius: 6px;
  border: 0px;
  padding: 8px;
  color: ${props => (props.name ? '#fff' : '')};
  background-color: ${props => (props.name ? '#5aac44' : '')};
  &:hover {
    opacity: 0.5;
  }
`;
