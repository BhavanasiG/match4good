import DynamicLoginLogoutButton from "@/lib/components/login"
import Image from "next/image"

export default function Header() {
  return (
    <header>
      <div className="flex w-screen p-4 px-6 sm:px-12 md:px-24 border-b justify-between">
        <div className="flex">
          <Image alt="Match4Good Logo" src="logo_extended.svg" className="my-auto w-full h-8" width={0} height={0} />
        </div>
        <div className="flex">
          <DynamicLoginLogoutButton />
        </div>
      </div>
    </header>
)}