/**
 * Contains the security form for the settings page
 * containing security services such as
 * account deletion, password reset and email reset
 * @param Props accepts a prisma user object to display
 * @returns SecurityForm component JSX
 */

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { DeleteUser } from "./submit";

export default function SecurityForm() {
  const handleAccountDeletion = async () => {
    const deleted = await DeleteUser().catch((error) => {
      console.error(error);
      toast.error("Failed to delete account: " + error);
    });

    if (deleted) {
      toast.success("Account deleted successfully");
      redirect(`/auth/logout/`);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger
          className=" hover:cursor-pointer 
        bg-destructive hover:bg-destructive/60 text-white shadow-xs focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60
        h-9 px-4 py-2 has-[>svg]:px-3
        inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
        "
        >
          Delete Account
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and all of your data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              className="hover:cursor-pointer"
              onClick={() => handleAccountDeletion()}
            >
              Delete
            </Button>
            <DialogClose
              className="ml-2 hover:cursor-pointer
            border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50
            h-9 px-4 py-2 has-[>svg]:px-3
            inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
            "
            >
              Cancel
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
