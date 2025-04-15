import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function notFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-10">
      <div>
        <div className="flex items-center justify-center space-x-5">
          <h1 className="text-8xl font-black text-muted-foreground">404</h1>
        </div>
        <h1 className="text-6xl font-bold">Page Not Found</h1>  
      </div>
      <div className="flex flex-col space-y-4">
        <p className="text-lg">We couldn't find the page you were looking for.</p>
        <Link href="/" className="flex justify-center">
          <Button size="lg" variant={"secondary"} className="hover:cursor-pointer">
            <IconArrowLeft />
            Back to Home
          </Button>
        </Link>  
      </div>
    </div>
  );
}