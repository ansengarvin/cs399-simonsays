import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Root, Home, Spheropoly } from "./Routes"
import { 
    SpheroSimonLanding,
    SpheroSimonHuman,
    SpheroSimonRobot, 
    SpheroSimonVersus, 
    action as postAction, 
} from './components/content/simon'
import './index.css'

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            { index: true, element: <Home /> },
            {
                path: "spherosimon",
                element: <Outlet/>,
                children: [
                    { index: true, element: <SpheroSimonLanding/>},
                    { 
                        path: "robot",
                        element: <SpheroSimonRobot/>,
                        action: postAction
                    },
                    {
                        path: "human",
                        element: <SpheroSimonHuman/>,
                        action: postAction
                    },
                    {
                        path: "versus",
                        element: <SpheroSimonVersus/>,
                        action: postAction
                    }
                ]
            },
            {
                path: "spheropoly",
                element: <Spheropoly/>
            }
        ]
    }
])


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>,
)
