'use client'

import Link from "next/link";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-white">
      <div className="flex-1 flex flex-col items-center gap-4">
        <span className="text-black  text-4xl font-semibold">Hello</span>
        <div className="mt-8 rounded-3xl bg-black text-base text-white font-medium px-5 py-4 hover:cursor-pointer hover:bg-zinc-300">
          <Link href="/sign-in">
            {isConnected ? "Go to profile" : "Connect to your wallet"}
          </Link>
        </div>
      </div>     
    </main>
  );
}
