import React, { useState } from 'react';
import { usePostApi } from '../../api/index';

const AddTagButton = ({ url, setUpdate }) => {
  const [tagName, setTagName] = useState('');
  const [cardName, setCardName] = useState('');
  const [clicked, setClicked] = useState(false);
  const [postData] = usePostApi();

  const onClickHandler = () => {
    setTagName('');
    setCardName('');
    setClicked(prevState => !prevState);
  };
  const onChangeHandler = e => {
    setTagName(e.target.value);
  };
  const onCardChangeHandler = e => {
    setCardName(e.target.value);
  };

  const addTag = async () => {
    if (tagName.length === 0 && cardName.length === 0) {
      alert('빈칸이 있습니다.');
    } else {
      const code = await postData(`${url.slice(0, url.length - 1)}`, {
        tagValue: tagName,
        name: cardName,
      });
      if (code === 201) {
        setTagName('');
        setCardName('');
        setUpdate(prevState => !prevState);
        setClicked(prevState => !prevState);
      } else {
        alert('생성에 실패했습니다.');
        setTagName('');
      }
    }
  };

  return (
    <>
      <div
        className='tag-add-button'
        style={{ display: clicked ? 'inline-block' : 'none' }}
      >
        <input
          placeholder='tag name'
          value={tagName}
          onChange={onChangeHandler}
        />
        <input
          placeholder='card name'
          value={cardName}
          onChange={onCardChangeHandler}
        />
        <button onClick={addTag}>Add</button>
        <button onClick={onClickHandler}>Cancel</button>
      </div>
      <div
        className='tag-add-button'
        style={{ display: clicked ? 'none' : 'inline-block' }}
      >
        <button onClick={onClickHandler}>Add Tag</button>
      </div>
    </>
  );
};

export default AddTagButton;
