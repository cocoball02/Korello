import React, { useState, useEffect } from 'react';
// import { Route } from 'react-router-dom';
import TagForm from './TagForm';
import apiHandler from '../../api/index';
// import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import AddTagButton from './AddTagButton';

const CardList = ({ history, match, location }) => {
  //데이터를 받아와서 나열.

  // const [data, loading] = useApi('get', `${match.url}`);
  const [tagList, setTagList] = useState([]);
  const [cardList, setCardList] = useState([]);
  const [update, setUpdate] = useState(true);

  const onClickHandler = () => {
    history.goBack();
  };
  console.log(location.pathname);
  useEffect(async () => {
    const { result_body } = await apiHandler('get', `${location.pathname}`);

    if (result_body.length > 0) {
      const obj = {};
      const tags = [];
      const cards = [];
      result_body
        .sort((a, b) => a.id - b.id)
        .map(el => {
          let cardObj = {
            id: el.id,
            name: el.name,
            tagValue: el.tagValue,
            memberNames: el.memberNames,
            createDate: el.createDate,
            updateDate: el.updateDate,
          };

          if (!obj[el.tagValue]) {
            obj[el.tagValue] = [cardObj];
          } else {
            obj[el.tagValue].push(cardObj);
          }
        });
      for (let i in obj) {
        tags.push(i);
        cards.push(obj[i]);
      }

      setTagList(tags);
      setCardList(cards);
    } else {
      setTagList([]);
      setCardList([]);
    }
  }, [update]);

  return (
    <>
      {cardList.length > 0 ? (
        <>
          <button onClick={onClickHandler}>뒤로가기</button>
          <div id='all-card-list'>
            {cardList.map((el, i) => {
              let index = cardList.indexOf(el);
              return (
                <TagForm
                  key={i}
                  data={el}
                  tag={tagList[index]}
                  boardUrl={match.url}
                  setUpdate={setUpdate}
                />
              );
            })}
          </div>
        </>
      ) : (
        <>
          <button onClick={onClickHandler}>뒤로가기</button>
        </>
      )}
      <AddTagButton url={match.url} setUpdate={setUpdate} />
    </>
  );
};

export default CardList;
