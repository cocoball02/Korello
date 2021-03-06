import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { MdAccountCircle, MdEvent } from 'react-icons/md';
const BoardLogModal = ({ openLog, openLogHandler, setOpenLog }) => {
  const modalRef = useRef(null);
  const { boardEventLogs } = useSelector(state => state.card);
  const pageClickHandler = e => {
    if (modalRef.current !== null && !modalRef.current.contains(e.target)) {
      setOpenLog(!openLog);
    }
  };

  const renderLogs = () => {
    return boardEventLogs.map(el => {
      let eventTime = `${el.createdDate[0]}.0${el.createdDate[1]}.${el.createdDate[2]} ${el.createdDate[3]}:${el.createdDate[4]}`;
      return (
        <LogElement key={el.id}>
          <MdAccountCircle size='32' />
          <div>
            <div className='log-text'>
              {el.memberName}님이 {el.message}
            </div>
            <div className='log-time'>{eventTime}</div>
          </div>
          <br></br>
        </LogElement>
      );
    });
  };
  useEffect(() => {
    if (openLog) {
      window.addEventListener('click', pageClickHandler);
    }
    return () => {
      window.removeEventListener('click', pageClickHandler);
    };
  }, [openLog]);

  return (
    <EventLogContainer ref={modalRef}>
      <EventLogHeader>
        <h3>Menu</h3>
        <button onClick={openLogHandler}>x</button>
      </EventLogHeader>
      <hr />
      <LogType>
        <MdEvent size='30' />
        <h4>Activity</h4>
      </LogType>
      <LogModalList>{renderLogs()}</LogModalList>
    </EventLogContainer>
  );
};

export default BoardLogModal;

const EventLogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 339px;
  height: 100%;
  border-radius: 3px;
  box-shadow: 0 12px 24px -6px rgba(9, 30, 66, 0.25);
  background-color: aliceblue;
  z-index: 3;
  background-color: #f4f5f7;

  hr {
    position: relative;
    left: 15px;
    size: 10px;
    background-color: rgba(9, 30, 66, 0.13);
    border: 0;
    height: 1px;
    margin: 16px 0;
    padding: 0;
    width: 90%;
  }
`;

const EventLogHeader = styled.div`
  width: 100%;
  text-align: center;
  height: 60px;

  button {
    vertical-align: top;
    position: relative;
    bottom: 50px;
    left: 145px;
    height: 30px;
    width: 30px;
    font-size: large;
  }
`;
export const LogType = styled.div`
  display: flex;
  align-items: center;
  margin: 14px 15px;

  h4 {
    display: inline;
    margin: 0px 5px;
  }
`;
export const LogModalList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;
  overflow-y: scroll;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const LogElement = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0px;
  svg {
    margin: 0px 10px 0px 13px;
  }
  .log-time {
    font-size: small;
  }
`;
