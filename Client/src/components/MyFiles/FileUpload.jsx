import React, { useState } from "react";
import { Upload } from "lucide-react";


function FileUpload({contract}) {
  const VITE_APP_GATEWAY_URL = import.meta.env.VITE_APP_GATEWAY_URL;
  const VITE_APP_PINATA_JWT_ACCESS_TOKEN = import.meta.env.VITE_APP_PINATA_JWT_ACCESS_TOKEN;
  // const [selectedFile, setSelectedFile] = useState();
  const [cid, setCid] = useState();

  const changeHandler = async (event) => {
    const file = event.target.files[0];
    if (file) {
        await handleSubmission(file); // Pass the file directly to handleSubmission
    }
};

  const handleSubmission = async (file) => {
      try {
          const formData = new FormData();
          formData.append("file", file);
          const metadata = JSON.stringify({
              name: file.name, // Include the file name
              size: file.size, // Include the file size
              type: file.type, // Include the file type
          });
          formData.append("pinataMetadata", metadata);

          const options = JSON.stringify({
              cidVersion: 0,
          });
          formData.append("pinataOptions", options);

          const res = await fetch(
              "https://api.pinata.cloud/pinning/pinFileToIPFS",
              {
                  method: "POST",
                  headers: {
                      Authorization: `Bearer ${VITE_APP_PINATA_JWT_ACCESS_TOKEN}`,
                  },
                  body: formData,
              }
          );
          const resData = await res.json();
          const file_url = `${VITE_APP_GATEWAY_URL}/ipfs/${resData.IpfsHash}`;
          console.log("line before contract");
          const filename = file.name;
          const filesize = file.size;
          console.log(filename);
          console.log(filesize);
          console.log(contract);
          console.log(file_url);

          contract.uploadfile(file_url,filename,filesize);
          console.log("contract executed")
          setCid(resData.IpfsHash);
          console.log(resData);
      } catch (error) {
          console.log(error);
      }
  };

  return (
      <>
          <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={changeHandler}
          /> 
          <label htmlFor="fileInput" className="upload-button">
          </label>
          <li>
                                <label htmlFor="fileInput"
                                    className=
                                    "flex justify-left py-2 pr-4 pl-3 duration-200 border-gray-1100 border-2 hover:bg-gray-400 hover:text-white  rounded-[13px] mb-1"
                                    
                                  >
                                  <span className='pr-2'><Upload/></span> Upload
                                </label>
                      
          </li>
      </>
  );
}

export default FileUpload;
