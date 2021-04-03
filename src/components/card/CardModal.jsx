import React, { useEffect, useRef, useState } from 'react';
import Label from '../modal/Label';
import CheckListModal from '../modal/ChecklistModal';
import Checklist from '../modal/Checklist';
import CalendarModal from '../modal/CalendarModal';
import CardEventLog from './CardEventLog';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData, postData, updateData, getRefreshToken } from '../../api';
import { getCard, progressCalculator } from './card_utils';
import { setData } from '../../reducers/card.reducer';

const CardModal = ({ visible, clickModal, title }) => {
  const {
    cardlist,
    currentTagName,
    checklist,
    currentBoardUrl,
    currentCardId,
    currentBoardId,
    cardlabels,
  } = useSelector(state => state.card);

  const [editButton, setEditButton] = useState(false);
  const [cardTitle, setCardTitle] = useState(title);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const formRef = useRef(null);

  const inputHandler = e => {
    setCardTitle(e.target.value);
  };
  const onBackgroundClick = e => {
    if (e.target === e.currentTarget) {
      clickModal();
    }
  };

  const editCard = () => {
    setEditButton(p => !p);
    if (editButton) inputRef.current.focus();
  };
  const sendUpdate = async e => {
    e.preventDefault();
    if (cardTitle !== title) {
      let code = await updateData(
        currentBoardUrl.slice(0, currentBoardUrl.length - 1) + '/name',
        {
          id: currentCardId,
          name: cardTitle,
        },
      );
      if (code === 200) {
        setEditButton(p => !p);
        let obj = cardlist;
        let list = cardlist[currentTagName].slice('');
        list.forEach(el => {
          if (el.id === currentCardId) {
            el.name = cardTitle;
          }
        });
        obj[currentTagName] = list;
        dispatch(setData({ cardlist: obj }));
      } else if (code >= 401001) {
        await getRefreshToken();
        await sendUpdate(e);
      } else {
        alert('update 실패');
      }
    } else {
      setEditButton(p => !p);
    }
  };
  const deleteCard = async () => {
    if (window.confirm('카드를 삭제하시겠습니까?')) {
      let code = await postData(
        currentBoardUrl.slice(0, currentBoardUrl.length - 1) + '/delete',
        {
          id: currentCardId,
        },
      );
      if (code === 201) {
        getCard(currentBoardUrl, dispatch, currentBoardId);
      } else if (code >= 401001) {
        await getRefreshToken();
        await deleteCard();
      } else {
        alert('삭제에 실패하였습니다.');
      }
    }
  };
  const pageClickEvent = e => {
    if (formRef.current !== null && !formRef.current.contains(e.target)) {
      setEditButton(!editButton);
    }
  };

  useEffect(() => {
    const fetchModal = async () => {
      const [data] = await fetchData(`/card/${currentCardId}/todo`);
      let obj = {};
      for (let key in checklist) {
        obj[key] = checklist[key];
      }
      obj[currentCardId] = data;
      dispatch(
        setData({
          checklist: obj,
        }),
      );
    };
    if (!checklist[currentCardId]) {
      fetchModal();
    } else {
    }
  }, []);

  useEffect(() => {
    if (editButton) inputRef.current.focus();
  });

  useEffect(() => {
    if (editButton) {
      window.addEventListener('click', pageClickEvent);
    }
    return () => {
      window.removeEventListener('click', pageClickEvent);
    };
  }, [editButton]);

  return (
    <>
      <ModalWrapper tabIndex='-1' visible={visible} onClick={onBackgroundClick}>
        <ModalInner tabIndex='0' visible={visible}>
          <CloseModalButton onClick={clickModal}></CloseModalButton>
          <CardDeleteButton onClick={deleteCard}>Delete Card</CardDeleteButton>
          <ModalHeader>
            <ModalLabels>
              {cardlabels[currentCardId] && cardlabels[currentCardId].length > 0
                ? cardlabels[currentCardId]
                    .sort((a, b) => a.id - b.id)
                    .map((el, i) => (
                      <ModalLabelElement key={i} color={el.color}>
                        {el.name}
                      </ModalLabelElement>
                    ))
                : null}
            </ModalLabels>
            {editButton ? (
              <div>
                <form onSubmit={sendUpdate} ref={formRef}>
                  <input
                    value={cardTitle}
                    onChange={inputHandler}
                    ref={inputRef}
                  />
                  <button>Save</button>
                </form>
              </div>
            ) : (
              <div>
                <h2 onClick={editCard}>{title}</h2>
              </div>
            )}
          </ModalHeader>
          <ModalContents>
            {checklist[currentCardId] !== undefined &&
            checklist[currentCardId].length > 0 ? (
              <ChecklistContainer>
                <Checklist
                  percent={progressCalculator(checklist[currentCardId])}
                />
              </ChecklistContainer>
            ) : null}
            <CardEventLog />
          </ModalContents>
          <ModalSidebar>
            <div>Sidebar</div>
            <Label />
            <CheckListModal />
            <CalendarModal />
          </ModalSidebar>
        </ModalInner>
      </ModalWrapper>
    </>
  );
};

export default CardModal;

const ModalWrapper = styled.div`
  box-sizing: border-box;
  display: ${props => (props.visible ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  overflow-y: auto;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
`;

const ModalInner = styled.div`
  box-sizing: border-box;
  display: ${props => (props.visible ? 'block' : 'none')};
  position: relative;
  background-color: #ebecf0;
  border-radius: 10px;
  width: 768px;
  height: 750px;
  margin: 48px 0px 80px;
  padding: 30px 20px;
  z-index: 11;
  top: 5%;
`;

const CardDeleteButton = styled.button`
  background-color: #cf513d;
  color: #fff;
  border: 0px;
  border-radius: 3px;
  padding: 7px;
  float: right;

  margin: 0px;
  margin-right: 7px;
  &:hover {
    background-color: #e2472f;
  }
`;

const ModalHeader = styled.div`
  min-height: 50px;
  div {
    min-height: 50px;
    margin-left: 15px;
    h2 {
      display: inline-block;
    }
    button {
      background-color: #5aac44;
      position: relative;
      bottom: 4px;
      padding: 5px;
      height: 33px;
      border: 0;
      margin: 0px;
      margin-left: 5px;
      color: #fff;
      border-radius: 3px;
      &:hover {
        opacity: 0.8;
      }
    }
    input {
      font-size: 25px;
      border: 0px;
      box-shadow: inset 0 0 0 2px #0079bf;
      margin: 12px 0px;
    }
  }
`;
const ModalLabels = styled.div`
  overflow: auto;
  position: relative;
  box-sizing: border-box;
  color: #fff;
  min-height: 38px;
`;
const ModalLabelElement = styled.span`
  background-color: ${props => props.color};
  margin: 2px;
  padding: 2px 2px;
  border-radius: 4px;
  float: left;
  width: auto;
  min-width: 50px;
  height: 28px;
  text-align: center;
  line-height: 32px;
  border-radius: 6px;
  box-shadow: 0 2px 0 rgba(9, 30, 66, 0.25);
`;

const ModalContents = styled.div`
  float: left;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  min-height: 24px;
  padding: 0 8px 8px 16px;
  position: relative;
  width: 470px;
  height: 80%;
  z-index: 0;
`;

const ChecklistContainer = styled.div`
  padding: 10px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 0 rgba(9, 30, 66, 0.25);
`;

const ModalSidebar = styled.div`
  border-radius: 6px;

  float: right;
  padding: 0 16px 8px 8px;
  width: 210px;
  height: 80%;
  z-index: 10;
`;

const CloseModalButton = styled.span`
  float: right;

  background-image: url('https://korello.s3.ap-northeast-2.amazonaws.com/icons/cancel-icon.png');
  background-repeat: no-repeat;
  background-size: 20px;
  background-position: center;
  width: 20px;
  height: 20px;
  padding: 7px;
  opacity: 0.7;
  :hover {
    opacity: 1;
    background-color: #e2e2e2;
  }
`;
