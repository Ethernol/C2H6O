<script>
	import Header from './Header.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	import { onMount } from "svelte";
	import { smartContractABI } from "$lib/constants/abi.js";

	import Web3 from 'web3';
	

	let smartContractAddress = "0x472eCED37080fbCcb2332562f69B13e6d1c658cA";

	let metaMaskButtonString = "";
	let connected = false;

	let account;
	let smartContractInstance;
	let web3;

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

	async function onMetaMaskButton(){
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		account = accounts[0];
		connected = true;
		setSmartContractInstance();
	}

	async function setSmartContractInstance() {
		// https://sepolia.etherscan.io/tx/0x3837ce40b7a08b82c44cf4d184bb90813a7c23a40928e883f2d9d0f8c3e71e11
		web3 = new Web3(window.ethereum);		
		smartContractInstance = new web3.eth.Contract(smartContractABI, smartContractAddress);
	}
	function donate10() {
		donate(5000000000000000);
	}

	function donate(donation) {
		if (smartContractInstance !== null) {
			let a = smartContractInstance.methods.sendDonation("0xadC756EfB05506E373C1b650050daC0d5b57aE7C")
													.send({from: account,
														   value: donation,
														   });
		}
		// web3.utils.toWei(donation, 'ether')
		console.log("Donated");
	}

</script>
<Header />
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			{#if !connected}
			<button on:click={onMetaMaskButton}>
				{metaMaskButtonString}
			</button>
			{/if}
			{#if connected}
			<button on:click={donate10}>
				Doante 10 WEI to me!
			</button>
			{/if}
		</span>
	</h1>

	<h2>
	</h2>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
		color: var(--color-theme-1);
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
