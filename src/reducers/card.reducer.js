import { createAction, handleActions } from 'redux-actions';
import setState from './reduxUtils';

const SETSTATE = '/card/SETSTATE';

export const setCardData = createAction(SETSTATE);

const initialState = {
  loading: false,
  axiosStatus: false,
  taglist: [],
  cardlist: {},
  checklist: {},
  boardlabels: [],
  cardlabels: {},
  boardEventLogs: [],
  cardEventLogs: {},
  currentBoardId: '',
  currentBoardUrl: '',
  currentTagName: '',
  currentCardId: '',
};

const card = handleActions(
  {
    [SETSTATE]: setState,
  },
  initialState,
);
export default card;
