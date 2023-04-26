import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { api } from '../utils/customAxios';

interface FormValue {
    content: string;
    receiverId: number;
}

// interface message {
//     id: number,
//     authorId: number,
//     authorName: string,
//     receiverId: number,
//     content: string,
//     createdAt: Date
// }

function Msg() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    
    const [Msg, setMsg] = useState([]);
    const [Groupby, setGroupby] = useState([]);
    const [Receiver, setReceiver] = useState(0);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const getMsg = async ()=>{
        try {
            const Inmsg = await api.get(`api/users/${user.id}/letters/inbox?page=1&limit=30`);
            const Outmsg = await api.get(`api/users/${user.id}/letters/outbox?page=1&limit=30`);

            // 보낸, 받은 쪽지 데이터 통합
            let res = [];
            if (Inmsg.data.data) {
                res = Inmsg.data.data.concat(Outmsg.data.data);
            }
            else if (Outmsg.data.data) {
                res = Outmsg.data.data.concat(Inmsg.data.data);
            }

            // 보낸쪽지나 받은쪽지가 하나도 없을때 undefined 값 제거
            res = res.filter((element: Object) => element !== undefined);

            // 날짜 기준 오름차순 정렬
            res = res.sort(function(a: any, b: any) {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
            
            // 대화중인 상대방을 알기 위해 nickname 키 값 추가
            for (let element of res) {
                if (Object.keys(element).includes('authorName')) {
                    element.nickname = element.authorName;
                } else {
                    element.nickname = element.receiverName;
                }
            }
            
            // nickname별로 group
            let gb = res.reduce((x: any, y: any) => {
                (x[y.nickname] = x[y.nickname] || []).push(y);
                return x;
            }, {});

            setGroupby(gb);
        } catch (error : any) {
            alert(error);
        }
    };

    const deleteInbox = async (userId: number, id: number)=>{
        try {
            await api.delete(`api/users/${userId}/letters/${id}/inbox`);
            window.location.replace("/msg")
        } catch (error : any) {
            alert(error);
        }
    };

    const deleteOutbox = async (userId: number, id: number)=>{
        try {
            await api.delete(`api/users/${userId}/letters/${id}/outbox`);
            window.location.replace("/msg")
        } catch (error : any) {
            alert(error);
        }
    };

    useEffect(()=>{
        getMsg();
    }, []);

    // 쪽지를 보내는 함수
    const onSubmitHandler: SubmitHandler<FormValue> = async (data) => {
        try {
            data.receiverId = Receiver;
            await api.post(`/api/users/${user.id}/letters`, data);
            window.location.replace("/msg")
        } catch (error : any) {
            alert(error);
        }
    };

    // 쪽지함을 보여주는 함수
    const showMsgBox = () => {
        const result = [];
        for (let k in Groupby) {
            const v: any = Groupby[k]
            result.push(
                <button key={v.id} onClick={() => {
                getMsg();
                setMsg(v);
                setReceiver(v[0].authorId !== user.id ? v[0].authorId : v[0].receiverId);
                }} 
                className='m-3 hover:bg-blue-200'>
                    <div className='text-base'>{k}님과의 쪽지</div>
                </button>                
            );
        }
        return result;
    };

    return (
        <>
            <div className='flex items-center justify-center p-5' style={{height: '51.7rem'}}>
                <div className='flex flex-col w-1/5 h-full p-3 mx-2 border-solid border border-gray-300 rounded-md'>
                    <div className='text-xl font-bold m-2 border-solid border-b border-black'>쪽지함</div>
                    {Groupby && showMsgBox()}
                </div>

                <div className='flex flex-col w-1/2 h-full p-3 border-solid border border-gray-300 rounded-md overflow-auto'>
                    <div className='text-xl font-bold m-2 border-solid border-b border-black'>내역</div>
                        {Msg &&
                            Msg.map((msg: {content: string, id: number, authorId: number, receiverId: number, createdAt: string})=>{
                                // 쪽지 생성시간 한국 시간대로 변경
                                const date = new Date(msg.createdAt);
                                const date_kor = date.toString().substring(0, 24);

                                return(
                                    <div key={msg.id} className='m-3'>
                                        <div className='flex place-content-between'>
                                            {msg.receiverId === user.id ?
                                                <div className='text-xs font-semibold text-yellow-500'>받은 쪽지 | {date_kor}</div> :
                                                <div className='text-xs font-semibold text-green-500'>보낸 쪽지 | {date_kor}</div>
                                            }
                                            {msg.receiverId === user.id ?
                                                <button onClick={() => deleteInbox(msg.receiverId, msg.id)}className='text-xs text-red-700'>삭제</button> :
                                                <button onClick={() => deleteOutbox(msg.authorId, msg.id)}className='text-xs text-red-700'>삭제</button>
                                            }
                                        </div>
                                        <div className='text-base truncate'>{msg.content}</div>
                                    </div>                             
                                )
                            })
                        }

                    <form onSubmit={handleSubmit(onSubmitHandler)} className='w-full'>
                        <input 
                            {...register('content', {
                            required: true,
                            minLength: 1,
                            maxLength: 200,
                            })}
                            className='h-16 w-5/6 m-3 border-solid border border-gray-300 rounded-md'
                        />
                        <button>보내기</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Msg;