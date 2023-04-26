import axios from "axios";
import React, { useEffect, useRef } from "react";
import { atom, useRecoilState } from "recoil";
import { api } from "../utils/customAxios";


export interface CommentData {
    _id: string, 
    __v: number,
    boardId: string, 
    content: string, 
    authorId: string,
    createdAt: string,
    updatedAt: string,
    isDeleted: boolean
}

export const commentArrayState = atom<CommentData[]>({
    key:"commentArray",
    default:[]
});

export const totalCommentCountState = atom<number>({
    key:"totalCommentCount",
    default:0
});

export const commentPageState = atom<number>({
    key:"CommentPage",
    default:1
});

export const newCommentState = atom<string>({
    key:"newComment",
    default:""
});

const checkAuthorState = atom<boolean>({
    key:"checkAuthor",
    default:false
});

const updateValueState = atom<string>({
    key:"updateValue",
    default:""
});

export const endOfCommentState = atom<boolean>({
    key:"endOfComment",
    default:true
})


interface newCommentInterface{
    _id: string, 
    __v: number,
    boardId: string, 
    content: string, 
    authorId: string,
    createdAt: string,
    updatedAt: string,
    isDeleted: boolean,
    deleteComment: Function,
}


const Comment = ({_id, createdAt, boardId, updatedAt,isDeleted,__v, content, authorId, deleteComment}:newCommentInterface):JSX.Element=>{

    const ButtonAvailable: React.FC= () =>{
        const [checkAuthor,setCheckAuthor]=useRecoilState(checkAuthorState);
        const getMyInfo = async()=>{
            const response = await api.post('/api/users/user');
            setCheckAuthor(response.data.data.nickname===authorId);
        }

        useEffect(()=>{
            getMyInfo();
            
        })

        if(checkAuthor){
            return(
                <div className="text-right">
                    <button className="rounded-full bg-sky-200 p-1" onClick={clickUpdateComment}>수정</button>
                    <button className="rounded-full bg-sky-200 p-1" onClick={(e)=>{
                        e.preventDefault();
                        deleteComment(_id);
                    }}>삭제</button>
                </div>
            )
        }
        else{
            return<></>
        }
    }
    const clickUpdateComment = async(e:React.MouseEvent<HTMLButtonElement>)=>{
        try{
            e.preventDefault();
            await api.put(`/api/boards/${boardId}/comments/${_id}`,{content:updateValue});
            alert("수정이 완료되었습니다.")
        } catch (error : any) {
            alert(error.response.data.errorMessage);
        }
        
        
    }


    const [updateValue,setUpdateValue] = useRecoilState(updateValueState);


    return(
        <div className="block max-w-6xl mx-auto my-3 p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="text-left">
                <p className="text-xl">{authorId}</p>
                <p className="text-sm">{createdAt}</p>
            </div>
            <div className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <textarea className="block p-2.5 m-auto w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={content} defaultValue={content} onChange={(e)=>{
                    setUpdateValue(e.target.value);
                }}></textarea>
            </div>
            <ButtonAvailable />
        </div>
    )
}

export default Comment;