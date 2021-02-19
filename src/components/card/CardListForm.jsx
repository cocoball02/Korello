import React, { memo, useState } from 'react';
import CardModal from './CardModal';
import { postData, getRefreshToken, fetchData } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { getCard } from '../../containers/CardContainer';
import { setData } from '../../reducers/card.reducer';
import { Draggable } from 'react-beautiful-dnd';

const CardListForm = ({ id, title, tag, labels, index }) => {
  const [editButton, setEditButton] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const { currentBoardUrl } = useSelector(state => state.card);
  const dispatch = useDispatch();

  const editCard = () => {
    setEditButton(p => !p);
  };

  const clickModal = () => {
    if (modalVisible) {
      dispatch(
        setData({
          checklist: [],
          currentCardId: id,
        }),
      );
    } else {
      const fetchModal = async () => {
        const [data] = await fetchData(`/card/${id}/todo`);
        dispatch(
          setData({
            checklist: data,
            currentCardId: id,
          }),
        );
      };
      fetchModal();
    }
    setModalVisible(p => !p);
  };

  const deleteCard = async () => {
    let code = await postData(
      currentBoardUrl.slice(0, currentBoardUrl.length - 1) + '/delete',
      {
        id: id,
      },
    );
    if (code === 201) {
      getCard(currentBoardUrl, dispatch);
    } else if (code >= 401001) {
      await getRefreshToken();
      await deleteCard();
    } else {
      alert('삭제에 실패하였습니다.');
    }
  };

  return (
    <>
      {modalVisible ? (
        <CardModal
          clickModal={clickModal}
          id={id}
          title={title}
          tag={tag}
          labels={labels}
        />
      ) : null}
      <Draggable draggableId={id} index={index}>
        {provided => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div className='card' onClick={clickModal}>
                {labels.length > 0 ? (
                  <div className='card-labels'>
                    {labels
                      .sort((a, b) => a.id - b.id)
                      .map((el, i) => (
                        <span
                          key={i}
                          className='label'
                          style={{
                            backgroundColor: el.color,
                          }}
                        ></span>
                      ))}
                  </div>
                ) : (
                  <div className='card-labels'></div>
                )}
                <div className='card-title' onClick={editCard}>
                  {title}
                </div>
                {editButton ? null : (
                  <div className='card-buttons'>
                    {/* <button className='modal' >
                      modal
                    </button> */}
                    <span
                      className='card-delete-button'
                      onClick={deleteCard}
                    ></span>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Draggable>
    </>
  );
};

export default memo(CardListForm);
