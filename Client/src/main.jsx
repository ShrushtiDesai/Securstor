import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './Layout.jsx'
import MyFiles from './components/MyFiles/MyFiles'
import SharedWithMe from './components/SharedWithMe/SharedWithMe'
import SharedByMe from './components/SharedByMe/SharedByMe'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: '',
        element: <MyFiles/>
      },
      {
        path: 'SharedWithMe',
        element: <SharedWithMe/>
      },
      {
        path: 'SharedByMe',
        element: <SharedByMe/>
      }
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
