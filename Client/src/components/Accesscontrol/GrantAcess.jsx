import React, { useContext, useState } from 'react';
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
import { Button } from "@/components/ui/button"
import { Share2 } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useStore from '@/Context/store';
import { useToast } from "@/components/ui/use-toast"
import AccountContractContext from '@/Context/AccountContractContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const formSchema = z.object({
  address: z.string().length(42, {
    message: "address must be of 42 characters",
  }),
});

const GrantAcess = ({ FileUrl }) => {
  const { contract } = useContext(AccountContractContext);
  const { userAddress, setUserAddress } = useStore();
  const { setFileurl } = useStore();
  const { grantTrigger, setgrantTrigger } = useStore();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: ""
    }
  })

  const fileurlAccess = () => {
    setFileurl(FileUrl);
    console.log(`Granting access to file: ${FileUrl}`);
  }

  function onSubmit(values) {

    console.log(values.address)
    setUserAddress(values.address);

    (async () => {
      try {
        await contract.grantAccess(FileUrl, values.address);

        setgrantTrigger(!grantTrigger);

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
          description: "Failed to grant access. Check whether access is already granted or try again.",
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
              <Button variant='ghost' className="bg-blue-400 hover:bg-blue-200 mx-2" onClick={fileurlAccess}><Share2 /></Button>
              </TooltipTrigger>
              <TooltipContent className='bg-black text-white'>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share File</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the address of the user you want to share the file with.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Wallet Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Submit</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GrantAcess;
