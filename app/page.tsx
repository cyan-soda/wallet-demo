'use client'

import Link from "next/link";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <main className="flex h-screen overflow-auto flex-row p-24 items-center bg-white">
      <div className="flex flex-col items-center gap-4 bg-zinc-100 p-16 rounded-3xl shadow-inner overflow-auto w-full">
        <span className="text-black  text-4xl font-semibold">Hello!</span>
        <div className="mt-8 rounded-3xl bg-black text-base text-white font-medium px-5 py-4 hover:cursor-pointer hover:bg-zinc-500 shadow-inner">
          <Link href="/sign-in">
            {isConnected ? "Go to profile" : "Connect to my wallet"}
          </Link>
        </div>
      </div>     
    </main>
  );
}
