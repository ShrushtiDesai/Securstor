import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './Layout.jsx'
import MyFiles from './components/MyFiles/MyFiles.jsx'
import SharedWithMe from './components/SharedWithMe/SharedWithMe.jsx'
import SharedByMe from './components/SharedByMe/SharedByMe.jsx'

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
