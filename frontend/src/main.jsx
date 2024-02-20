import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'

import { Root, Home } from "./Routes"
import { 
    SpheroSimonLanding,
    SpheroSimonHuman,
    SpheroSimonRobot, 
    SpheroSimonVersus, 
    action as postAction, 
} from './components/content/simon'
import './index.css'


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
                        element: <SpheroSimonHuman/>
                    },
                    {
                        path: "versus",
                        element: <SpheroSimonVersus/>
                    }
                ]
                
            }
        ]
    }
])


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
