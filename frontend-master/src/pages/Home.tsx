import React from 'react';
import TypeIt from 'typeit-react';

function Home() {
    return (
        <>
            <img src='run.jpg' alt='background' className='opacity-90' style={{height: '51.7rem', width: '120rem'}} />
            <TypeIt
                className='absolute top-[15%] left-[5%] text-6xl'
                options={{
                    strings: ['우리... 같이 운동할까요?'],
                    speed: 100,
                    waitUntilVisible: true,
                }}
            />
        </>
    );
}

export default Home;
