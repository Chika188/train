// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App.jsx'
import '@ant-design/v5-patch-for-react-19';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Battle from './pages/battle/Battle.jsx';
import PopularProjects from './pages/popular/PopularProjects.jsx';

import { Suspense } from 'react';
import React from 'react';


const BattleResult = React.lazy(() => import('./pages/battle-result/battle-result.jsx'));
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,  // 确保App组件作为根路由
        children: [
            {
                path: '/popular',
                element: <PopularProjects />
            }
        ]
    },
    {
        path: '/battle',
        element: <Battle />
    },
    {
        path: '/battle-result',
        element: (
            <Suspense fallback={<div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>}>
                <BattleResult />
            </Suspense>
        )
    }
]);
createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
