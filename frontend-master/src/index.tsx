import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/tailwind.css';
import './styles/index.css';

// 전역 CSS 리셋을 위함
// import { createGlobalStyle } from 'styled-components';
// import reset from 'styled-reset';

// 상태관리 하기 위함
import { RecoilRoot } from 'recoil';

// 라우터 적용을 위함
import { BrowserRouter } from 'react-router-dom';

// 각 브라우저의 기본 css값이 다를 수 있기 때문에 리셋해줌
// const GlobalStyles = createGlobalStyle`
//     ${reset}
//     /* other styles */
// `;

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <RecoilRoot>
                {/* <GlobalStyles /> */}
                <App />
            </RecoilRoot>
        </BrowserRouter>
    </React.StrictMode>
);
