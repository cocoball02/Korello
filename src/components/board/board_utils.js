import { setData } from '../../reducers/board.reducer';
import { fetchData } from '../../api';
import { getDocuments } from '../../firebase';

const makeRecentList = data => {
  let result = [];
  let lastView = localStorage.getItem('lastView');
  if (lastView !== null && JSON.parse(lastView).length > 0) {
    let arr = [];
    JSON.parse(lastView).forEach(el => {
      if (!arr.includes(parseInt(el))) {
        arr.push(parseInt(el));
      }
    });
    let boards = arr
      .map(element => {
        return data.filter(e => parseInt(e.id) === element)[0];
      })
      .filter(el => el);
    result = boards;
  } else {
    result = [];
  }
  console.log(result);
  return result;
};
//서버로부터 board 데이터 받아옴.
export const getBoard = async dispatch => {
  let [board, code, error] = await fetchData('/boards');
  if (error) {
    console.log(error);
  } else {
    getDocuments(board);
    let recentBoard = makeRecentList(board);

    let payload = {
      loading: false,
      data: board ? board : [],
      code: code ? code : 0,
      recentBoard: recentBoard ? recentBoard : [],
    };

    dispatch(setData(payload));
  }
};
