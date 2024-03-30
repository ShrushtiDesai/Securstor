import React from 'react'
import {FileInput, Trash2, Share2} from 'lucide-react'

const MyFiles = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Size</th>
            <th>Date</th>
            <th>Acitons</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>file_name</td>
            <td>20kb</td>
            <td>
              <span>Date</span>
            </td>
            <td>
              <span>
                <FileInput/>
                <Share2/>
                <Trash2/>
              </span>
            </td>
            </tr>
        </tbody>
      </table>
    </div>
  )
}

export default MyFiles