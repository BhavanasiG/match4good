import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <header>
      <div className="flex flex-row w-screen p-12 px-6 text-xs sm:text-sm md:text-base md:px-16 lg:px-24 border-t justify-between bg-lime-500 text-white">
        <div className="flex flex-col text-center">
          <Link href={"/"}>
            <Image
              alt="Match4Good Logo"
              src={"/logo_white.svg"}
              className="sm:hidden my-auto w-full h-8 md:h-11"
              width={0}
              height={0}
            />
            <Image
              alt="Match4Good Logo"
              src={"/logo_extended_white.svg"}
              className="hidden sm:block my-auto w-full h-8 md:h-11"
              width={0}
              height={0}
            />
          </Link>
          <p className="flex pt-2 mx-auto">
            <span className="hidden sm:block">Copyright&nbsp;</span>© Match4Good
            2025
          </p>
        </div>
        <div className="flex flex-col text-center">
          <Link href={"/"}>About Match4Good</Link>
          <Link href={"/"}>Contact Us</Link>
        </div>
        <div className="flex flex-col text-center">
          <Link href={"/"}>Terms and Conditions</Link>
          <Link href={"/"}>Privacy Policy</Link>
          <Link href={"/"}>Cookies Policy</Link>
        </div>
      </div>
    </header>
  );
}
