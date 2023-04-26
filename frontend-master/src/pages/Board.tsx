import React, { useMemo } from "react";
import BoardList from '../components/BoardList'
import BoardDetail from "./BoardDetail";
import queryString from 'query-string';

const Board: React.FC = ()=>{
    const boardId = useMemo(
    () => queryString.parse(window.location.search)["id"] as string || null,
    []
  );


    return boardId?(<BoardDetail/>):(<BoardList />);

}

export default Board;