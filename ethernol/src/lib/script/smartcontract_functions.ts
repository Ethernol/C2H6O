import { onMount } from 'svelte';
import { metaMaskButtonString } from './metadata.ts';

onMount(async () => {
    metaMaskButtonString = checkMetaMask();

    function checkMetaMask() {
        if (typeof window.ethereum == 'undefined') {
            console.log('MetaMask is not installed!');
            return 'MetaMask is not installed.\nClick here to install!';
        }
        return 'Click here to login via MetaMask.';
    }
});

async function onMetaMaskButton() {
    const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
    });
    account = accounts[0];
    connected = true;
    setSmartContractInstance();
}

async function setSmartContractInstance() {
    // https://sepolia.etherscan.io/tx/0x3837ce40b7a08b82c44cf4d184bb90813a7c23a40928e883f2d9d0f8c3e71e11
    web3 = new Web3(window.ethereum);
    smartContractInstance = new web3.eth.Contract(
        ethernolContractABI as unknown as AbiItem[],
        smartContractAddress
    );
    return true;
}
