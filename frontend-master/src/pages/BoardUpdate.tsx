import queryString from "query-string";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { postState } from "./BoardDetail";
import { api } from "../utils/customAxios";

const BoardUpdate: React.FC = ()=>{
    const qs = queryString.parse(window.location.search);

    const navigate = useNavigate();

    type PostForm={
        title: string,
        content: string
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PostForm>();

    const onSubmit: SubmitHandler<PostForm> = async (data) => {
        try {
            const response = await api.put(`/api/boards/${qs.id}`,data)
            if(response.status===200){
                navigate('/board?page=1&limit=10');
            }
            else{
                 alert("권한이 없습니다.");
            }
            
        } catch (error: any){
            alert(error.response.data.errorMessage);
        };
    };

    const [post, setPost]= useRecoilState(postState);

    const loadPost =async ()=>{
        try{
            const response = await api.get(`/api/boards/${qs.id}`)
            setPost(response.data.data);
        } catch (error:any){
            alert(error.response.data.errorMessage);
        }
    }

    useEffect(()=>{
        loadPost();
    },[])

    return (
        
        <div>
            <div className="border-solid py-10 mx-32 my-20 bg-slate-100">
                
                <div onSubmit={handleSubmit(onSubmit)} className="block max-w-6xl mx-auto my-3 p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h1>변경 전 내용</h1>
            <div className="mt-3">
                        <label  className="block mb-2 text-2xl font-medium text-gray-900 dark:text-white">제목</label>
                        <input className="block p-2.5 m-auto w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={post.title}></input>
                        {errors.title && <span>max 50 words</span>}
                    </div>
                    <div className="mt-3">
                        <label  className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">내용</label>
                        <input className="block p-2.5 m-auto w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={post.content} ></input>
                    </div>
                    
                    </div>
            </div>
            <div className="border-solid py-10 mx-32 my-20 bg-slate-100">
                <form onSubmit={handleSubmit(onSubmit)} className="block max-w-6xl mx-auto my-3 p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h1>변경 후 내용</h1>

                    <div className="mt-3">
                        <label  className="block mb-2 text-2xl font-medium text-gray-900 dark:text-white">제목</label>
                        <input className="block p-2.5 m-auto w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={post.title} {...register("title",{required:true, pattern:/^.{1,50}$/})}></input>
                        {errors.title && <span>max 50 words</span>}
                    </div>
                    <div className="mt-3">
                        <label  className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">내용</label>
                        <input className="block p-2.5 m-auto w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={post.content} {...register("content",{required:true, pattern:/^.{1,500}$/})}></input>
                        {errors.content && <span>max 500 words</span>}
                    </div>
                    
                    <div className="text-right mt-5"><button type="submit" className="rounded-full text-lg bg-slate-300 p-3 ml-3">등록하기</button></div>
                </form>
            </div>
        </div>
        
    )
}

export default BoardUpdate;