
// config/index.tsx

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage, http } from 'wagmi'
import { mainnet, goerli, bsc, zkSync } from 'wagmi/chains'

// Your WalletConnect Cloud project ID
export const projectId = 'd8bb3479483ece9c162238e52d76f5ea'

if (!projectId) throw new Error('Project ID is undefined');

// Create a metadata object
const metadata = {
  name: 'Wallet Auth',
  description: 'A wallet authentification example',
  url: 'https://localhost:3000', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
const chains = [mainnet, goerli, bsc, zkSync ] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  transports: {
    [mainnet.id]: http(),
    [goerli.id]: http(),
    [bsc.id]: http(),
    [zkSync.id]: http(),
  }
})