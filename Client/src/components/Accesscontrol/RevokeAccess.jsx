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
          title: "Granting Access",
          description: `Granting Access : ${values.address}`,
        });
      } catch (error) {
        console.error("Error granting access:", error);
        toast({
          variant: "Destructive",
          title: "Error",
          description: "Failed to grant access. Please try again.",
        });
      }
    })();

  }
  return (
    <div>
      <AlertDialog>
  <AlertDialogTrigger asChild>
  <Button variant='destructive'><FileX2/></Button>
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