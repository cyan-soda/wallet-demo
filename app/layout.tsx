
// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { cookieToInitialState } from 'wagmi'

import { config } from '@/app/config'
import Web3ModalProvider from '@/app/context'

export const metadata: Metadata = {
  title: 'Wallet Auth',
  description: 'A wallet authentification example',
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
      <body>
        <Web3ModalProvider initialState={initialState}>{children}</Web3ModalProvider>
      </body>
    </html>
  )
}