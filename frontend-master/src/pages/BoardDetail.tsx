import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import { api } from "../utils/customAxios";
import { Post } from "../components/BoardList";
import Comment, { commentArrayState, CommentData, commentPageState, endOfCommentState, newCommentState, totalCommentCountState } from "../components/Comment";
import { useForm, SubmitHandler } from 'react-hook-form';
// import { getCommentRange } from "typescript";
// import { clear } from "console";

interface FormValue {
    content: string;
    receiverId: number;
}

export const postState = atom<Post>({
    key:"post",
    default:{
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
        },
});

const BoardDetail: React.FC = ()=>{
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();

    const {id} = useParams();

    const navigate = useNavigate();
    const clickBoardList =(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        navigate('/board?page=1&limit=10');
    }

    const clickUpdate = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        navigate(`/board/update?id=${id}`);
    }

    const clickDelete = async (e:React.MouseEvent<HTMLButtonElement>)=>{
        try {
            e.preventDefault();
            const response = await api.delete(`/api/boards/${id}`)
            if(response.status===200){
                navigate('/board?page=1&limit=10');
            }
            else{
                alert("삭제할 수 없습니다.")
            }
        } catch (error:any){
            alert(error.response.data.errorMessage);
        }

    }

    const clickParticipate = async (e:React.MouseEvent<HTMLButtonElement>)=>{
        try{
            e.preventDefault();
            const response = await api.post(`/api/boards/${id}/participants`);
            setPost(response.data.data);
        } catch (error : any){
            alert(error.response.data.errorMessage);
        }
    }

    const clickCommentAdd = async (e:React.MouseEvent<HTMLButtonElement>)=>{
        try{
            e.preventDefault();
            await api.post(`/api/boards/${id}/comments`,{content: newComment});
            const tempCount = totalCommentCount+1;
            setTotalCommentCount(tempCount);
            
            const response2 = await api.get(`/api/boards/${id}/comments?page=${totalCommentCount+1}&limit=1`);
            const temp:CommentData[]=[...comment];

            temp.unshift(response2.data.data.comments[0]);
            if(temp.length!==0){
                setComment(temp);
            }

            alert("댓글이 작성되었습니다.");
            
        }
        catch(error:any){
            alert(error.response.data.errorMessage);
        }
    }
    const [post, setPost]= useRecoilState(postState);
    const [comment, setComment] = useRecoilState(commentArrayState);
    const [commentPage, setCommentPage] = useRecoilState(commentPageState);
    const [totalCommentCount,setTotalCommentCount]=useRecoilState(totalCommentCountState);
    const [newComment,setNewComment] = useRecoilState(newCommentState);
    const [endOfComment, setEndOfComment] = useRecoilState(endOfCommentState);

    // 쪽지 관련
    const [Receiver, setReceiver] = useState("");
    const [ShowMsg, setShowMsg] = useState(0);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const getPost=async ()=>{
        try {
            const response = await api.get(`/api/boards/${id}`)
            setPost(response.data.data);
            setReceiver(response.data.data.userId);
        } catch (error : any) {
            alert(error.response.data.errorMessage);
        }
    }

    const getComment = async()=>{
        try{
            const response = await api.get(`/api/boards/${id}/comments?page=1&limit=5`);
            if(response.data.data.comments.length===0){
                setComment([]);
                return;
            }
            setTotalCommentCount(response.data.data.totalPage);
            const pages = Math.ceil(response.data.data.totalPage/5);
            if(pages!==1){
                setEndOfComment(false);
            }
            const response2 = await api.get(`/api/boards/${id}/comments?page=${pages}&limit=5`)
            const commentsData = response2.data.data.comments;
            setComment(commentsData.reverse());
            setCommentPage(pages-1);
        } catch (error : any) {
            alert(error.response.data.errorMessage);
        }
    }

    const deleteComment = async (_id:string)=>{
        try{
            await api.delete(`/api/boards/${id}/comments/${_id}`);
            const newComment = comment.filter((data)=>data._id!==_id);
            setComment(newComment);
            const newTotalCommentCount=totalCommentCount;
            setTotalCommentCount(newTotalCommentCount-1);

        } catch (error : any) {
            alert(error.response.data.errorMessage);
        }
    }

    const clickGetComment = async ()=>{
        try {
            if(commentPage===0){
                return ;
            }
            const response = await api.get(`/api/boards/${id}/comments?page=${commentPage}&limit=5`);
            if(response.data.data.comments.length===0){
                return;
            }
            let newComment:CommentData[]=comment;
            newComment = newComment.concat(response.data.data.comments.reverse());
            setComment(newComment);
            setTotalCommentCount(response.data.data.totalPage);
            

            const newCommentPage = commentPage-1;
            setCommentPage(newCommentPage);
            if(newCommentPage===0){
                setEndOfComment(true);
            }
            

            
        } catch (error : any) {
            alert(error.response.data.errorMessage);
        }
    }

    // 쪽지 버튼을 눌렀을때 쪽지 입력창을 보여줌
    const clickMsg = () => {
        setShowMsg(1);
    }

    // 쪽지 전송버튼 핸들러
    const onSubmitHandler: SubmitHandler<FormValue> = async (data) => {
        try {
            setShowMsg(0);
            data.receiverId = parseInt(Receiver);
            await api.post(`/api/users/${user.id}/letters`, data);
            alert("쪽지가 성공적으로 보내졌습니다.")
        } catch (error : any) {
            alert(error);
        }
    };

    useEffect(()=>{
        getPost();
        getComment();        
    },[])

    return (
        <>
        {/* 쪽지 보내는 박스 */}
        {ShowMsg == 1 &&
            <div className="absolute flex justify-center items-center min-h-screen min-w-full bg-slate-50/75">
                <form onSubmit={handleSubmit(onSubmitHandler)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            쪽지
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            {...register('content', {
                                required: true,
                                minLength: 1,
                                maxLength: 200,
                            })}                        
                            type="text"
                            placeholder="Write youe message here"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            전송
                        </button>
                    </div>
                </form>
            </div>
        }

        <div className="mx-40 py-8">
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                    <p className="text-2xl">{post.title}</p>
                    <span className="text-sm mr-5">{post.authorId}</span>
                    <span className="text-sm">{String(post.createdAt)}</span>
                </div>
                <div>
                    <button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={clickParticipate}>참가하기</button>
                </div>
            </div>
            <hr />
            <div className="grid grid-cols-4 gap-4 mt-5">
                <div className="col-span-3">
                    <p className="text-xl m-10">{post.content}</p>
                </div>
                <div>
                    <table>
                        <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    참가자 ( {post.participantInfo.currentCount} / {post.participantInfo.totalCount})
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {post.participantInfo.userIdList.map((id)=>{
                                return(
                                    <tr key={id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">
                                    {id}
                                </td>
                            </tr>
                                )
                            })}
                            
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-5">
                <ul className="inline-flex items-center ">
                    <li>
                        <button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={clickBoardList}>목록</button>
                    </li>
                    <li>
                        <Link to="/board/update"><button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={clickUpdate}>수정</button></Link>
                    </li>
                    <li>
                        <button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={clickDelete}>삭제</button>
                    </li>
                    <li>
                        <button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={clickMsg}>쪽지</button>
                    </li>
                </ul>
            </div>

            <div className="border-solid py-10 mx-32 my-20 bg-slate-100">
                <div className="block max-w-6xl mx-auto my-3 p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    
                    <div className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <textarea className="block p-2.5 m-auto w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..." onChange={(e)=>{
                            e.preventDefault();
                            setNewComment(e.target.value);
                        }}></textarea>
                        <div className="text-right"><button className="rounded-full bg-sky-200 p-1 ml-3" onClick={clickCommentAdd}>등록</button></div>
                    </div>
                </div>
                {comment&&comment.map((data)=>{
                        return (
                            <Comment 
                            deleteComment={deleteComment}
                            key={data._id}
                            _id={data._id}
                            boardId={data.boardId}
                            content={data.content}
                            authorId={data.authorId}
                            createdAt={data.createdAt}
                            updatedAt={data.updatedAt}
                            __v={data.__v}
                            isDeleted={data.isDeleted} />
                        )
                })}
                {(endOfComment)?(<></>):(<div className="text-center"><button className="rounded-full bg-sky-200 py-1 px-10 ml-3" onClick={clickGetComment}>댓글 더보기</button></div>)}
                
            </div>
        </div>
        </>
    )
}

export default BoardDetail;