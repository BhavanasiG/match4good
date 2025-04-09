"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from "@/lib/prisma";
import { useState } from "react";
export type Props = { user: User };

export default function SecurityForm({ user }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleAccountDeletion = async () => {
    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/users/${user.user_id}`, {
        method: 'DELETE',
      });
      
      console.log("response:\n", response.text());
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete account');
      }

      /** Add success toast */
    } catch (error) {
      console.error(error)
      setError('An error occured');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          Delete Account
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and all of your data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" className="hover:cursor-pointer hover:bg-red-700" onClick={() => handleAccountDeletion()}>
              Delete
            </Button>
            <DialogClose>
              <Button variant="outline" className="ml-2 hover:cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}