import axiosClient from "./axios"

export const walletService = {
    getSignMessage: async () => {
        return (await axiosClient.get(`https://api.inz-dev.esollabs.com/v1/dapp/auth/sign`)).data;
    },
    postSignIn: async (params: any) => {
        return (await axiosClient.post(`https://api.inz-dev.esollabs.com/v1/dapp/auth/sign_in`, params)).data;
    }
}