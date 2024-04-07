import React, { useState } from 'react';
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
import {Share2} from 'lucide-react';
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

const formSchema = z.object({
  address: z.string().length(42, {
    message: "address must be of 42 characters",
  }),
});

const GrantAcess = () => {
  const {setUserAddress} = useStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: ""
    }
  })


  function onSubmit(values) {

    console.log(values.address)
    setUserAddress(values.address);
    // console.log("user address stored", userAddress)

  }

 return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='ghost' className="bg-blue-400 hover:bg-blue-200 mx-2"><Share2/></Button>
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
              <AlertDialogAction><Button type="submit">Submit</Button></AlertDialogAction>
            </AlertDialogFooter>
      </form>
    </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
 );
};

export default GrantAcess;
