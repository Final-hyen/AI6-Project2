import React, { useEffect, useMemo } from "react";
import { Link } from 'react-router-dom';
import queryString from 'query-string'
import { atom, useRecoilState } from "recoil";
import { api } from "../utils/customAxios";
import BoardListRow from "./BoardListRow";

type paginationProps = {
    num: number,
    limit: number;
}



export interface Participants {
        totalCount: number,
        currentCount: number,
        userIdList: string[]
    }

export interface Post {
        _id: number,
        title: string,
        content: string,
        participantInfo : Participants,
        authorId: string,
        createdAt: Date,
        isDeleted: boolean,
        __v: number,
    }

export const postListState = atom<Post[]>({
    key: "postList",
    default :[
        {
            _id: 1,
            title: "null",
            content: "null",
            participantInfo:{
                totalCount:10,
                currentCount:2,
                userIdList: ["user1","user2"]
            },
            authorId:"1111",
            createdAt: new Date(),
            isDeleted: false,
            __v: 0
        }
    ]
});

const totalPostsCountState = atom<number>({
    key: "totalPostsCount",
    default:0
});

const pageNowState = atom<number>({
    key: "pageNow",
    default:1
});

const limitState = atom<number>({
    key: "limit",
    default:10
});



const BoardList: React.FC = ()=>{
    
    const qsPage = useMemo(
    () => queryString.parse(window.location.search)["page"] as string || null,
    []);
    const qsLimit = useMemo(
    () => queryString.parse(window.location.search)["limit"] as string || null,
    []);

    const [postList,setPostList]= useRecoilState(postListState);
    const [totalPostsCount,setTotalPostsCount]= useRecoilState(totalPostsCountState);
    const [pageNow, setPageNow]= useRecoilState(pageNowState);
    const [limit,setLimit] = useRecoilState(limitState);

    const PaginationDefault : React.FC<paginationProps> = ({num,limit})=>{
        return(
            <li>
                <div onClick={
                    async ()=>{
                        try {
                            const response = await api.get(`/api/boards?page=${num}&limit=${limit}`);
                            setPostList(response.data.data.boards);
                            setTotalPostsCount(response.data.data.totalPage);
                            const newPageNow = num;
                            setPageNow(newPageNow);
                        } catch (error:any){
                            alert(error.response.data.errorMessage);
                            setPostList([]);
                        };
                    }
                } className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{num}</div>
            </li>
        )
    }

    const PaginationChecked : React.FC<paginationProps> = ({num,limit})=>{
        return(
            <li>
                <div onClick={
                    async ()=>{
                        try {
                            const response = await api.get(`/api/boards?page=${num}&limit=${limit}`);
                            setPostList(response.data.data.boards);
                            setTotalPostsCount(response.data.data.totalPage);
                            const newPageNow = num;
                            setPageNow(newPageNow);
                        } catch (error:any){
                            alert(error.response.data.errorMessage);
                            setPostList([]);
                        };
                    }
                } className="z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">{num}</div>
            </li>
        )
    }

    const getPostList =async()=>{
        try {
            const response = await api.get(`/api/boards?page=${qsPage}&limit=${qsLimit}`);
            if(response.data.data.totalPage===0){
                alert("등록된 게시물이 없습니다.");
            }
            if(response.data.data.boards.length===0 && response.data.data.totalPage!==0){
                alert("page나 limit가 잘못되었습니다.");
            }
            setPostList(response.data.data.boards);
            setTotalPostsCount(response.data.data.totalPage);
            
        } catch (error:any){
                alert(error.response.data.errorMessage);
                setPostList([]);
            };
    }

    const checkQueryString = ():void=>{
        if(Number(qsPage)<1){
            setPageNow(1);
        }
        if(Number(qsLimit)<1){
            setLimit(10);
        }
        else {
        setPageNow(Number(qsPage));
        setLimit(Number(qsLimit));}
    }

    const clickPreviousPage = async (e:React.MouseEvent<HTMLDivElement>)=>{
        try {
            if(pageNow===1) return;
            const response = await api.get(`/api/boards?page=${pageNow-1}&limit=${limit}`);
            setPostList(response.data.data.boards);
            setTotalPostsCount(response.data.data.totalPage);
            const newPageNow = pageNow-1;
            setPageNow(newPageNow);
        } catch (error:any){
                alert(error.response.data.errorMessage);
                setPostList([]);
        };
    }

    const clickNextPage = async (e:React.MouseEvent<HTMLDivElement>)=>{
        try {
            if(pageNow===Math.floor((totalPostsCount-1)/limit)+1) return;
            const response = await api.get(`/api/boards?page=${pageNow+1}&limit=${limit}`);
            setPostList(response.data.data.boards);
            setTotalPostsCount(response.data.data.totalPage);
            const newPageNow = pageNow+1;
            setPageNow(newPageNow);
            
        } catch (error:any){
                alert(error.response.data.errorMessage);
                setPostList([]);
        };
    }

    useEffect(()=>{
        checkQueryString();
        getPostList();
        
    },[])

    const Pagination : React.FC = ()=>{
        const pagesCount = totalPostsCount/limit +1;
        const paginator = [];
        
        for(let i=1;i<pagesCount;i++){
            if(pageNow===i){
                paginator.push(<PaginationChecked key={i} num={i} limit={Number(qsLimit)} />)
            } else{
                paginator.push(<PaginationDefault key={i} num={i} limit={Number(qsLimit)} />)
            }
        }
        return(<>
                {paginator.map((a)=>a)}
            </>
        )
    }

    return (
        <div className="mx-40 my-32">
        <div className="text-right">
            <Link to="/board/create"><button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">글 작성하기</button></Link>
        </div>
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        번호
                    </th>
                    <th scope="col" className="px-6 py-3">
                        제목
                    </th>
                    <th scope="col" className="px-6 py-3">
                        작성자
                    </th>
                    <th scope="col" className="px-6 py-3">
                        작성시간
                    </th>
                    <th scope="col" className="px-6 py-3">
                        참가인원
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <span className="sr-only">참가하기</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                
                    {postList.map(info=>{
                        return(
                            <BoardListRow
                            key={info._id}
                            _id={info._id}
                            title={info.title}
                            content={info.content}
                            participantInfo={info.participantInfo}
                            authorId={info.authorId}
                            createdAt={info.createdAt} 
                            __v={info.__v}
                            isDeleted={info.isDeleted} />
                        )
                    })}
                    
                
            </tbody>
        </table>



    </div>
            <div className="m-5">
                <nav aria-label="Page navigation example " className="text-center">
                      <ul className="inline-flex items-center -space-x-px " >
                                  <li>
                      <div onClick={clickPreviousPage} className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Previous</span>
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" ></path></svg>
                      </div>
                                  </li>
                        <Pagination />
                                  <li>
                      <div onClick={clickNextPage} className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Next</span>
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" ></path></svg>
                      </div>
                                  </li>
                      </ul>
                
                </nav>
            </div>
        </div>
    )
}

export default BoardList;