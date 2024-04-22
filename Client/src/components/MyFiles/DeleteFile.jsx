import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/components/ui/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useStore from "@/Context/store";


function DeleteFile({IpfsHash, contract}) {
  const VITE_APP_PINATA_JWT_ACCESS_TOKEN = import.meta.env.VITE_APP_PINATA_JWT_ACCESS_TOKEN;
  const { toast } = useToast();
  const {deleteTrigger, setdeleteTrigger} = useStore();

  console.log("delete file me");

  const deletePin = async (IpfsHash) => {
    try {
       console.log(`Deleting pin with hash: ${IpfsHash}`);
       const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${IpfsHash}`, {
         method: "DELETE",
         headers: {
          Authorization: `Bearer ${VITE_APP_PINATA_JWT_ACCESS_TOKEN}`,
         },
       });
   
       if (response.ok) {
         console.log("Pin deleted successfully");
         await contract.deleteFile(IpfsHash);
         console.log("file deleted.")
         setdeleteTrigger(!deleteTrigger);
         
         toast({
          variant: "green",
          title: "File Deleted",
          description: "Your file has been Deleted Successfully.",
      });
       } else {
         console.log("Failed to delete pin");
         toast({
          variant: "destructive",
          title: "Failed to Delete",
          description: "There was an error in Deleting your file. Please try again."
      });
       }
    } catch (error) {
       console.log("Error deleting pin:", error);
       toast({
        variant: "destructive",
        title: "Failed to Delete",
        description: "There was an error in Deleting your file. Please try again."
    });
    }
   };


  return (
      <>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
            <Button variant='ghost' onClick={() => deletePin(IpfsHash)} className='bg-red-500 hover:bg-red-400'><Trash2/></Button>
            </TooltipTrigger>
            <TooltipContent className='bg-black text-white'>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
      </div>
          
      </>
  );
}

export default DeleteFile;
