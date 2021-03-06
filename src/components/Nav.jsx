import React, { useState } from 'react';
import styled from 'styled-components';
import { clearStorage } from '../api';
import BoardButtonModal from './BoardButtonModal';
import SearchUser from './user/SearchUser';
import { BiHome } from 'react-icons/bi';
import { FaChalkboard } from 'react-icons/fa';

const Nav = ({ history, setLogin }) => {
  const [boardButton, setBoardButton] = useState(false);
  const login = localStorage.getItem('loginStatus');

  const logoutHandler = () => {
    clearStorage();
    alert('로그아웃 되었습니다');
    setLogin('false');
    localStorage.setItem('loginStatus', false);
    history.push('/');
  };
  const onClickHandler = () => {
    setBoardButton(p => !p);
  };

  return login === 'true' ? (
    <NavHeader>
      <NavHeaderButtons>
        <a href='/boards'>
          <BiHome size='25' color='white' />
        </a>
        <BoardButton onClick={onClickHandler}>
          <FaChalkboard size='17' color='white' />
          Boards
        </BoardButton>
        {boardButton && (
          <BoardButtonModal
            boardButton={boardButton}
            setBoardButton={setBoardButton}
          />
        )}

        <SearchUser />
      </NavHeaderButtons>
      <NavTitle>
        <a href='/boards'>
          <span className='image'></span>
        </a>
      </NavTitle>
      <NavStatusButton>
        <button onClick={logoutHandler}>logout</button>
      </NavStatusButton>
    </NavHeader>
  ) : (
    <NavHeader>
      <NavHeaderButtons></NavHeaderButtons>
      <NavTitle>
        <a href='/'>
          <span className='image'></span>
        </a>
      </NavTitle>
      <NavStatusButton>
        <button>Sign In</button>
      </NavStatusButton>
    </NavHeader>
  );
};

export default Nav;

const NavHeader = styled.div`
  background-color: #026aa7;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  max-height: 40px;
  overflow: hidden;
  text-align: center;
  padding: 4px;
`;
const NavHeaderButtons = styled.div`
  display: flex;
  flex-basis: 40%;

  a {
    height: 31px;
    background-color: hsla(0, 0%, 100%, 0.3);
    width: 31px;
    border-radius: 4px;
    :hover {
      opacity: 0.5;
    }
  }
  svg {
    position: relative;
    top: 3px;
  }
`;

const NavTitle = styled.div`
  flex-basis: 20%;
  height: 31px;
  align-content: center;
  .image {
    background-image: url('https://korello.s3.ap-northeast-2.amazonaws.com/icons/title-logo.png');
    background-repeat: no-repeat;
    background-size: 133px;
    cursor: pointer;
    display: inline-block;
    height: 40px;
    width: 120px;
    position: relative;
    bottom: 8px;
  }
  a {
    :hover {
      opacity: 0.5;
    }
  }
`;
const NavStatusButton = styled.div`
  flex-basis: 40%;
  text-align: right;

  button {
    position: relative;
    font-size: 14px;
    font-weight: 400;
    border: 0;
    border-radius: 4px;
    color: #fff;
    padding: 5px;
    margin: 0px;

    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.3);
    &:hover {
      opacity: 0.5;
    }
  }
`;

const BoardButton = styled.button`
  background-color: hsla(0, 0%, 100%, 0.3);
  border: 0px;
  padding: 5px;
  margin: 0px;
  margin-left: 3px;
  font-weight: bold;

  color: #fff;
  :hover {
    opacity: 0.5;
  }
  svg {
    margin-right: 5px;
  }
`;
