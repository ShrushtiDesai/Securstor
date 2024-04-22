import React, { useContext } from 'react'
import {FileX2} from 'lucide-react'
import { Button } from '../ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import AccountContractContext from '@/Context/AccountContractContext'
import useStore from '@/Context/store'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


function RevokeAccess({fileUrl, TempOwnerAddress}) {
  const { contract } = useContext(AccountContractContext);
  const {revokeTrigger, setrevokeTrigger} = useStore();
  console.log("revoke me contract hai:",contract);
  console.log("fileurl to revoke:",fileUrl);
  console.log("temp address to revoke:", TempOwnerAddress);
  const { toast } = useToast();

  function onSubmit() {
    event.preventDefault();

    (async () => {
      try {
        await contract.revokeAccess(fileUrl, TempOwnerAddress);
        setrevokeTrigger(!revokeTrigger);

        toast({
          variant: "green",
          title: "Access Revoked",
          description: `Access Revoked : ${TempOwnerAddress}`,
        });
      } catch (error) {
        console.error("Error revoking access:", error);
        toast({
          variant: "Destructive",
          title: "Error",
          description: "Failed to revoke access. Check if access is already revoked or try again later.",
        });
      }
    })();

  }
  return (
    <div>
      <AlertDialog>
  <AlertDialogTrigger>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
        <Button variant='destructive'><FileX2/></Button>
        </TooltipTrigger>
        <TooltipContent className='bg-black text-white'>
          <p>Revoke</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently remove access to the selected Address.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <form onSubmit={onSubmit} className="space-y-8">
            {/* You can add form fields here if needed */}
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <AlertDialogAction type='submit'>Yes</AlertDialogAction>
            </AlertDialogFooter>
          </form>
  </AlertDialogContent>
</AlertDialog>
    </div>
  )
}

export default RevokeAccess