
import React from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../utils/customAxios";
import { Post } from "./BoardList"


const BoardListRow = ({_id,title,content,participantInfo,authorId,createdAt}:Post):JSX.Element=>{
    const navigate = useNavigate();
    const link = ()=>{
        navigate(`/board/${_id}`);
    }
    return(
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" onClick={link}>
            <td className="px-6 py-4">
                {_id}
            </td>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {title}
            </th>
            <td className="px-6 py-4">
                {authorId}
            </td>
            <td className="px-6 py-4">
                {createdAt.toLocaleString()}
            </td>
            <td className="px-6 py-4">
                {participantInfo.currentCount} / {participantInfo.totalCount}
            </td>
            <td className="px-6 py-4 text-right">
                <button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"  >참가하기</button>
            </td>
        </tr>
    )
}

export default BoardListRow;