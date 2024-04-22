import React, { useContext } from 'react';
import { FileInput } from 'lucide-react';
import { Button } from '../ui/button';
import { LitNodeClient, checkAndSignAuthMessage, decryptZipFileWithMetadata } from "@lit-protocol/lit-node-client";
import {
 Tooltip,
 TooltipContent,
 TooltipProvider,
 TooltipTrigger,
} from "@/components/ui/tooltip";
import AccountContractContext from '@/Context/AccountContractContext';

const FileAccess = ({ filehash }) => {
 const { address, contract } = useContext(AccountContractContext);

 const checkAccessAndDecrypt = async () => {
    try {
      const access = await contract.hasAccess(filehash, address);
      if (access) {
        const decryptFile = async () => {
          try {
            const fileRes = await fetch(`${import.meta.env.VITE_APP_GATEWAY_URL}/ipfs/${filehash}`);
            const file = await fileRes.blob();

            const litNodeClient = new LitNodeClient({
              litNetwork: 'cayenne',
            });
            await litNodeClient.connect();
            const authSig = await checkAndSignAuthMessage({
              chain: 'ethereum',
            });

            const { decryptedFile, metadata } = await decryptZipFileWithMetadata({
              file: file,
              litNodeClient: litNodeClient,
              authSig: authSig,
            });

            const blob = new Blob([decryptedFile], { type: metadata.type });
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, '_blank');
          } catch (error) {
            alert("Trouble decrypting file");
            console.error(error);
          }
        };

        decryptFile();
      }
    } catch (error) {
      console.error(error);
    }
 };

 return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant='ghost' className='bg-green-400 hover:bg-green-300' onClick={checkAccessAndDecrypt}>
              <FileInput />
            </Button>
          </TooltipTrigger>
          <TooltipContent className='bg-black text-white'>
            <p>Open</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
 );
};

export default FileAccess;
