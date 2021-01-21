import React, { useState, useRef } from 'react';
import { usePostApi } from '../../api/index';

const NewBoardForm = ({ onClickHandler, setUpdate, display }) => {
  const [boardName, setBoardName] = useState('');
  const inputRef = useRef(null);
  const [postData] = usePostApi();

  const onChangeHandler = e => {
    setBoardName(e.target.value);
  };

  const keyHandler = e => {
    if (e.key === 'Enter') {
      addBoard();
    }
  };
  const addBoard = async () => {
    if (boardName.length > 0) {
      const code = await postData('/board', {
        name: boardName,
      });

      if (code === 201) {
        setBoardName('');
        onClickHandler();
        setUpdate(p => !p);
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

  return (
    <span
      className='add-board-form'
      style={{ display: display ? 'block' : 'none' }}
    >
      <input
        ref={inputRef}
        placeholder='board name'
        value={boardName}
        onChange={onChangeHandler}
        onKeyPress={keyHandler}
      />
      <button onClick={addBoard}>Add</button>
      <button onClick={onClickHandler}>Cancel</button>
    </span>
  );
};

export default NewBoardForm;
