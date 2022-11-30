import Image from "next/image";
import Link from "next/link";
import logo from "../public/logos/logo512.svg";
import cartIcon from "../public/icons/cart.svg";

const Nav = () => {
  return (
    <nav>
      <ol className="z-50 w-full min-w-[360px] h-16 fixed top-0 flex justify-evenly items-center p-4 bg-white shadow-[0px_0px_10px_0px_black] font-semibold text-lg text-zinc-800 md:text-sm md:p-2">
        <li className="shrink-0 w-24 mx-4 md:w-16 md:mx-2">
          <Link href="/" className="">
            <Image src={logo} alt="로고" />
          </Link>
        </li>
        <li>
          <Link
            href="/collection"
            className="px-4 py-2 flex justify-center items-center rounded-md whitespace-nowrap hover:bg-zinc-200 md:px-2"
          >
            Collection
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="px-4 py-2 flex justify-center items-center rounded-md whitespace-nowrap hover:bg-zinc-200 md:px-2"
          >
            Category
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="px-4 py-2 flex justify-center items-center rounded-md whitespace-nowrap hover:bg-zinc-200 md:px-2"
          >
            Event
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="px-4 py-2 flex justify-center items-center rounded-md whitespace-nowrap hover:bg-zinc-200 md:px-2"
          >
            My Shopping
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="px-4 py-2 flex justify-center items-center gap-1 rounded-md whitespace-nowrap hover:bg-zinc-200 md:px-2"
          >
            <div className="w-8 md:w-6">
              <Image src={cartIcon} alt="Shopping cart" />
            </div>
            <span className="w-5 h-5 flex justify-center self-start bg-[firebrick] border border-[firebrick] rounded-full text-white text-xs font-bold">
              9+
            </span>
          </Link>
        </li>
      </ol>
    </nav>
  );
};

export default Nav;
