import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './Layout.jsx'
import FilesHeader from './components/MyFiles/FilesHeader'
import SharedWithMeHeader from './components/SharedWithMe/SharedWithMeHeader'
import SharedByMeHeader from './components/SharedByMe/SharedByMeHeader'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: '',
        element: <FilesHeader/>
      },
      {
        path: 'SharedWithMe',
        element: <SharedWithMeHeader/>
      },
      {
        path: 'SharedByMe',
        element: <SharedByMeHeader/>
      }
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
