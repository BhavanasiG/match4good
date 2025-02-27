import DynamicLoginLogoutButton from "@/components/login"
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header>
      <div className="flex w-screen p-4 px-6 sm:px-12 md:px-24 border-b justify-between">
        <div className="flex">
          <Link href={'/'}>
            <Image src={'logo_extended.svg'} alt="Match4Good Logo" width={0} height={0} className="w-auto h-8"/>
          </Link>
        </div>
        <div className="flex">
          <DynamicLoginLogoutButton />
        </div>
      </div>
    </header>
)}