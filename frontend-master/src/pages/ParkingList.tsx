import React from 'react';

function ParkingList() {
    return (
        <>
            <div className='flex flex-col p-5' style={{height: '70rem'}}>
                <div className='flex p-5 h-1/2 justify-center'>
                    <div className='flex flex-col p-8 mr-10 w-1/4 h-full overflow-auto bg-gray-100 rounded-md'>
                        <div className='flex mb-3 place-content-between w-full h-1/5'> 
                            <div className='text-lg font-bold'>여의도한강공원 1주차장
                                <div className='text-xs font-light'>서울특별시 영등포구 여의도동 314-3<br/>3km</div>
                            </div>
                            <div className='w-4 h-4 mt-5 bg-green-500 rounded-full'></div>
                        </div>
                        <div className='flex mb-3 place-content-between w-full h-1/5'> 
                            <div className='text-lg font-bold'>여의도한강공원 2주차장
                                <div className='text-xs font-light'>서울특별시 영등포구 여의도동 314-3<br/>3km</div>
                            </div>
                            <div className='w-4 h-4 mt-5 bg-red-500 rounded-full'></div>
                        </div>
                    </div>
                    <div className='flex felx-col p-8 w-3/5 h-full border-solid border border-gray-200 rounded-md'>
                        주차장
                    </div>
                </div>

                <div className='flex p-5'>
                    <div className='flex justify-start pl-24'>
                        <input type="text" className='border-solid border border-gray-300 mr-4'></input>
                        <button className='bg-gray-200 hover:bg-gray-300 p-2'>검색</button>
                    </div>
                </div>

                <div className='flex flex-col p-5 gap-8 mx-28 h-1/2 bg-gray-100 rounded-md'>
                    <div className='flex flex-row place-content-between'>
                        <div>
                            <div className='w-52 h-52 mb-1 bg-gray-300'></div>
                            <div className='text-xs'>주차장</div>
                        </div>
                        <div>
                            <div className='w-52 h-52 mb-1 bg-gray-300'></div>
                            <div className='text-xs'>주차장</div>
                        </div>
                        <div>
                            <div className='w-52 h-52 mb-1 bg-gray-300'></div>
                            <div className='text-xs'>주차장</div>
                        </div>
                        <div>
                            <div className='w-52 h-52 mb-1 bg-gray-300'></div>
                            <div className='text-xs'>주차장</div>
                        </div>
                    </div>
                    <div className='flex flex-row place-content-between'>
                        <div>
                            <div className='w-52 h-52 mb-1 bg-gray-300'></div>
                            <div className='text-xs'>주차장</div>
                        </div>
                        <div>
                            <div className='w-52 h-52 mb-1 bg-gray-300'></div>
                            <div className='text-xs'>주차장</div>
                        </div>
                        <div>
                            <div className='w-52 h-52 mb-1 bg-gray-300'></div>
                            <div className='text-xs'>주차장</div>
                        </div>
                        <div>
                            <div className='w-52 h-52 mb-1 bg-gray-300'></div>
                            <div className='text-xs'>주차장</div>
                        </div>
                    </div>                  
                </div>
            </div>
        </>
    );
}

export default ParkingList;