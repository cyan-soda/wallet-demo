'use client'
import {
    Connector,
    useAccount,
    useBalance,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
    useChainId,
    useSwitchChain,
    useSignMessage
} from "wagmi"

import { useEffect, useState } from "react";

const WalletOptions = () => {
    const { connect, connectors, isPending, isError, error } = useConnect();
    const { connector: activeConnector, isConnected } = useAccount();
    return (
        <div className="flex flex-col items-start justify-between mt-8">
            {isConnected && <div>Connected to {activeConnector?.name}</div>}
            {connectors.map((connector: Connector) => (
                <button
                    disabled={isPending || isError}
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className='px-5 py-4 mt-2 bg-black text-base text-slate-100 font-semibold rounded-3xl'
                >
                    {connector.name}
                </button>
            ))}

            {isError && <div>{error.message}</div>}
        </div>
    )
}

const SwitchChain = () => {
    const chainId = useChainId();
    const { chains, switchChain, error, isError } = useSwitchChain();
    return (
        <div>
            <div className="flex flex-col flex-1 h-full items-center justify-between gap-2 p-16 bg-white rounded-3xl">
                {/* <div className="flex flex-row items-center justify-between">
                    <FiArrowLeft />
                    <span className="text-base font-semibold">Choose Network</span>
                    <FiX />
                </div> */}
                <span className="text-black  text-4xl font-semibold">Choose Network</span>
                <div className="flex flex-col flex-1 h-full items-center justify-between gap-1">
                    <span className="text-md font-medium mb-4 mt-8">Current connected chain: {chainId}</span>
                    {chains.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            disabled={chainId === c.id}
                            onClick={() => {
                                switchChain({ chainId: c.id })
                            }}
                            className='p-4 mt-2 bg-black text-slate-100 font-semibold rounded-3xl w-full disabled:bg-gray-300'
                        >
                            {c.name}
                        </button>
                    ))}
                    {isError && <div>{error.message}</div>}
                </div>
            </div>
        </div>
    )
}

type SIGN_MESSAGE = {
    data: {
        sign_msg: string,
        nonce: string
    },
    errors: any[],
    msg: string,
    error_code: string
}

type SIGN_RESPONSE = {
    data: {
        signature: string,
        public_address: string,
        device_id: string,
        xrip: string,
        nonce: string,
        access_token: string
    },
    errors: any[],
    msg: string,
    error_code: string
}

const GetSignMessage = async (): Promise<SIGN_MESSAGE> => {
    const res = await fetch('https://api.inz-dev.esollabs.com/v1/dapp/auth/sign');
    const data: SIGN_MESSAGE = await res.json();
    return data;
}

const PostSignIn = async (
    signature: string,
    nonce: string,
    public_address: string,
    chain_id: number
): Promise<SIGN_RESPONSE> => {
    const res = await fetch('https://api.inz-dev.esollabs.com/v1/dapp/auth/sign_in', {
        method: 'POST',
        body: JSON.stringify({
            signature,
            nonce,
            public_address,
            chain_id
        })
    });
    console.log("hehe", res)
    const data: SIGN_RESPONSE = await res.json();
    console.log(data);
    return data;
}

const Profile = () => {
    const { address, connector, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { data, isError, isLoading } = useBalance();
    const chainId = useChainId();

    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

    const [isSwitch, setIsSwitch] = useState<boolean>(false);
    const handleSwitchNetwork = () => {
        setIsSwitch(!isSwitch)
    }

    const { data: signMessageData, error, signMessage, variables } = useSignMessage();
    const [message, setMessage] = useState('');
    const [nonce, setNonce] = useState('');
    const [signature, setSignature] = useState('');

    const handleSignMsg = async () => {
        const data:any = await GetSignMessage();
        if(data && data.data){
            setMessage(data.data.sign_msg);
            setNonce(data.data.nonce);
            signMessage({ message: data.data.sign_msg });
        }    
    }

    useEffect(() => {
        console.log('signMessageData', signMessageData);
        ;(async () => {
            if (signMessageData && variables.message) {
                // handleSign()
                const signInData = await PostSignIn(
                    signMessageData!, 
                    nonce, 
                    address!, 
                    chainId
                );
                console.log("Sign in response: ", signInData);
            }
        })()  
    }, [signMessageData, variables?.message]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await GetSignMessage();
    //         setMessage(data.data.sign_msg);
    //         setNonce(data.data.nonce);
    //     };
    //     // const getSignMessage = async () => {
    //     //     const data = await signMessage({ message });
    //     //     setSignature(data!);
    //     // }
    //     // getSignMessage();
    //     fetchData();
    // }, [address, signMessageData]);

    const handleSign = async () => {
        const signInData = await PostSignIn(
            signMessageData!, 
            nonce, 
            address!, 
            chainId
        );
        console.log("Sign in response: ", signInData);
    }

    if (isConnected) {
        return (
            <div>
                {isSwitch && <SwitchChain />}
                {!isSwitch &&
                    <div className="flex flex-col items-center gap-2 bg-zinc-100 p-16 my-16 rounded-3xl h-full">
                        <span className="text-black  text-4xl font-semibold">Your profile</span>
                        <div className="flex flex-col items-center justify-between gap-2 mb-4 mt-8">
                            <div className="w-10 h-10 rounded-3xl bg-black">
                                <img src={ensAvatar ?? ''} alt="" />
                            </div>
                            <div className="text-2xl font-bold">
                                {ensName ? `${ensName}` : `${address?.substring(0, 4)}...${address?.substring(38)}`}
                            </div>
                            {isError && <div>Error fetching balance.</div>}
                            {isLoading && <div>Fetching balance...</div>}
                            {data && <div>Balance: {data?.formatted} {data?.symbol}</div>}
                            <div>Connected to {connector?.name}</div>
                        </div>
                        <div className="flex flex-col w-full">
                            <button
                                className='p-5 mt-2 bg-black text-slate-100 font-semibold rounded-3xl w-full'
                                onClick={() => handleSwitchNetwork()}
                            >
                                Switch network
                            </button>
                            <button
                                className='p-5 mt-2 bg-black text-slate-100 font-semibold rounded-3xl w-full'
                                onClick={() => disconnect()}
                            >
                                Disconnect
                            </button>
                            <button
                                className='p-5 mt-2 bg-black text-slate-100 font-semibold rounded-3xl w-full'
                                onClick={() => {
                                    handleSignMsg()
                                }}
                            >
                                Sign
                            </button>
                        </div>
                        {signMessageData &&
                            <div className="pt-6">
                                <div>Public address: {address}</div>
                                <div>Chain ID: {chainId}</div>
                                <div>Message: {message}</div>
                                <div>Nonce: {nonce}</div>
                                <div>Signature: {signMessageData.substring(0, 20)}</div>
                            </div>
                        }
                        {error && <div>{error.message}</div>}
                    </div>
                }
            </div>
        )
    }
}

const SignIn = () => {
    const { isConnected } = useAccount();
    return (
        <main className="flex min-h-screen flex-col items-center p-24 bg-white">
            {!isConnected &&
                <>
                    <span className="text-black  text-4xl font-semibold">Hello, please connect to your wallet.</span>
                    <WalletOptions />
                </>
            }
            {isConnected &&
                <>
                    <Profile />
                </>
            }
        </main>
    )
}

export default SignIn;