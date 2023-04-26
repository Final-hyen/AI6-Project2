import React from 'react';

function ParkingDetail() {
    return (
        <>
            <div className='flex flex-col p-10' style={{height: '70rem'}}>
                <div className='flex place-content-between w-1/5 h-16 mb-12'> 
                    <div className='text-lg font-bold'>여의도한강공원 1주차장
                        <div className='text-xs font-light'>서울특별시 영등포구 여의도동 314-3<br/>3km</div>
                    </div>
                    <div className='w-4 h-4 mt-5 bg-green-500 rounded-full'></div>
                </div>

                <div className='flex h-1/3 place-content-between mb-24'>
                    <div className='p-4 mr-10 w-1/3 h-full overflow-auto bg-gray-100 rounded-md'>
                        <div className='font-bold'>주차장 정보</div>
                        <div className='p-4'>
                            예상 혼잡도: <br/><br/>
                            요금 <br/>
                            <ul>
                                <li>- 기본 요금:</li>
                                <li>- 시간당 요금:</li>
                                <li>- 하루 요금:</li>
                            </ul> <br/>
                            주차 면수: 
                        </div>
                    </div>
                    <div className='p-4 w-4/5 h-full border-solid border border-gray-200 rounded-md'>
                        <select className='block h-10 mb-4 border-solid border border-gray-400 rounded-md'>
                            <option>1월</option> <option>2월</option> <option>3월</option> 
                            <option>4월</option> <option>5월</option> <option>6월</option>
                            <option>7월</option> <option>8월</option> <option>9월</option>
                            <option>10월</option> <option>11월</option> <option>12월</option>
                        </select>
                        그래프
                    </div>
                </div>

                <div className='w-1/2 h-24'>
                    <div className='mb-2 font-bold'>실시간 주차장 정보 공유하기</div>
                    <textarea className='w-full h-12 p-0 border-solid border border-gray-300 rounded-md' placeholder="실시간 주차장 정보를 알려주세요!" />
                </div>

                <div className='flex flex-col h-96 bg-gray-100 rounded-md'>
                    <div className='flex flex-row h-1/2 p-4'>
                        <div className='w-1/2 p-4 h-full mx-4 bg-gray-300 rounded-md'>
                            <div className='font-bold border-solid border-b border-gray-500'>닉네임</div>
                            <div className='m-2'>
                                주차장 대박이에요~
                                <div className='text-xs'>2023.03.28 13:40</div>
                            </div>
                            <div>
                                <button className='float-right mx-2 text-sm font-bold text-red-600 hover:scale-105'>별로예요</button>
                                <button className='float-right mx-2 text-sm font-bold text-green-500 hover:scale-105'>도움돼요</button>
                            </div>
                        </div>
                        <div className='w-1/2 h-full mx-4 bg-gray-300 rounded-md'>
                            <div></div>
                        </div>
                    </div>
                    <div className='flex flex-row h-1/2 p-4'>
                        <div className='w-1/2 h-full mx-4 bg-gray-300 rounded-md'>
                            <div></div>
                        </div>
                        <div className='w-1/2 h-full mx-4 bg-gray-300 rounded-md'>
                            <div></div>
                        </div>
                    </div>              
                </div>
            </div>
        </>
    );
}

export default ParkingDetail;