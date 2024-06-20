'use client'

import { useState } from "react";
import { signMessage } from "wagmi/actions";
import { config } from "../config";

type SIGN_MESSAGE = {
    data: {
        sign_msg: string,
        nonce: string
    },
    errors: any[],
    msg: string,
    error_code: string
}

const SignMessage = (address: any) => {
    const [verified, setVerified] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState('');

    const logInWithEth = () => {

    }

    const fetchData = async (address: any) => {
        // const res = await fetch('https://api.inz-dev.esollabs.com/v1/dapp/auth/sign');
        // const data: SIGN_MESSAGE = await res.json();
        // console.log(data);
        // return data;
        const res = 
            await fetch('https://api.inz-dev.esollabs.com/v1/dapp/auth/sign')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('error');
                }
                return response.json();
            })
            .then((res: { data: { sign_msg: string; nonce: string; }}) => {
                createSignature(res.data.sign_msg, res.data.nonce);
            })
            .catch((error) => {
                error.json().then(setErrorMessage(error.message));
            })
        return res;
    }

    const createSignature = async (message: any, nonce: any) => {
        const signedMessage = await signMessage(
            config,
            {
                account: address,
                message: message,
            }
        )
    }

    const authSignature = (message: any, signedMessage: any) => {
        setVerified(false);
        
    }

    return (
        logInWithEth()
        // {isLoading ? 'Checking wallet...' : 'Log in with Ethereum'}
        // {verified && <div></div>}
                
    )
}

export default SignMessage;

    // const [signMessageData, setSignMessageData] = useState<SIGN_MESSAGE>();
    // const [result, setResult] = useState<any>(null);

    // useEffect(() => {
    //     const fetchSignMessage = async () => {
    //         const messageData = await GetSignMessage();
    //         console.log("Fetched successfully: ", messageData);
    //         setSignMessageData(messageData);
    //         const result = signMessage(
    //             config,
    //             {
    //                 account: address,
    //                 message: signMessageData?.data.sign_msg!
    //             })
    //         console.log("Signature: ", result);
    //         setResult(result);
    //     }
    //     fetchSignMessage();
    // }, [address]);

    // useEffect(() => {
    //     (async () => {
    //         if (variables?.message && signMessageData) {
    //             const res = await GetSignMessage();
    //             console.log("Fetched successfully: ", res);
    //             setResult(res);
    //         }
    //     })
    // }, [signMessageData, variables?.message])