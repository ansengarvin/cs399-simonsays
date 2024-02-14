import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import {Root, Home, SimonSays} from "./Routes"
import './index.css'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {index: true, element: <Home/>},
      {path: '/simonsays', element: <SimonSays/>}
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
