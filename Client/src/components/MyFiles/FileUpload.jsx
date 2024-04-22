import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"
import useStore from "@/Context/store";
import { LitNodeClient, encryptFileAndZipWithMetadata, checkAndSignAuthMessage } from "@lit-protocol/lit-node-client";
import { useState } from "react";

function FileUpload({ address, contract }) {
    const VITE_APP_GATEWAY_URL = import.meta.env.VITE_APP_GATEWAY_URL;
    const VITE_APP_PINATA_JWT_ACCESS_TOKEN = import.meta.env.VITE_APP_PINATA_JWT_ACCESS_TOKEN;

    const [files, setfiles] = useState([]);

    const { uploadTrigger, setUploadTrigger } = useStore();
    const { toast } = useToast();

    const changeHandler = async (event) => {
        const file = event.target.files[0];
        if (file) {
            await handleSubmission(file); // Pass the file directly to handleSubmission
            event.target.value = '';
        }
    };

    const handleSubmission = async (file) => {
        try {
            // Create our litNodeClient
            const litNodeClient = new LitNodeClient({
                litNetwork: 'cayenne',
            });
            // Then get the authSig
            await litNodeClient.connect();
            const authSig = await checkAndSignAuthMessage({
                chain: 'ethereum'
            });

            const accs = [
                {
                    contractAddress: '',
                    standardContractType: '',
                    chain: 'ethereum',
                    method: 'eth_getBalance',
                    parameters: [':userAddress', 'latest'],
                    returnValueTest: {
                        comparator: '>=',
                        value: '0',
                    },
                },
            ];

            const encryptedZip = await encryptFileAndZipWithMetadata({
                accessControlConditions: accs,
                authSig,
                chain: 'ethereum',
                file: file,
                litNodeClient: litNodeClient,
                readme: "Use IPFS CID of this file to decrypt it"
            });

            const encryptedBlob = new Blob([encryptedZip], { type: 'text/plain' })
            const encryptedFile = new File([encryptedBlob], file.name)

            const formData = new FormData();
            formData.append("file", encryptedFile);
            const metadata = JSON.stringify({
                name: encryptedFile.name, // Include the file name
                size: encryptedFile.size, // Include the file size
                type: encryptedFile.type, // Include the file type
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
            const CID = `${resData.IpfsHash}`;
            console.log("line before contract");
            const filename = encryptedFile.name;
            const filesize = encryptedFile.size;
            console.log(filename);
            console.log(filesize);
            console.log(contract);
            console.log(CID);

            await contract.uploadfile(CID, filename, filesize);
            console.log(uploadTrigger);
            setUploadTrigger(!uploadTrigger);

            toast({
                variant: "green",
                title: "File Uploaded Successfully",
                description: "Your file has been uploaded.",
            });

            console.log("contract executed")
            console.log(resData);
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Error Uploading File",
                description: "There was an error uploading your file. Please try again."
            });
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
                    <span className='pr-2'><Upload /></span> Upload
                </label>

            </li>
        </>
    );
}

export default FileUpload;
