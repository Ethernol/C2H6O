<script>
	import { page } from '$app/stores';
	import { onMount } from "svelte";
	import { smartContractABI } from "$lib/constants/abi.js";

	import Web3 from 'web3';


	let address = "Enter target wallet"
	if ($page.url.searchParams.has('target')){
		address = $page.url.searchParams.get('target');
	}

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


<svelte:head>
	<title>Send</title>
	<meta name="description" content="Send" />
</svelte:head>

<section>
	<h1>Send </h1>
	<span class="welcome">
		<div class="center">
			{#if !connected}
			<button class="button-22" on:click={onMetaMaskButton}>
				{metaMaskButtonString}
			</button>
			{/if}
			{#if connected}
			<input type="text" bind:value={address} placeholder={address}>
			<button class="button-22" on:click={donate10}>
				Doante 10 WEI to me!
			</button>
			{/if}
		</div>
	</span>
</section>

<!-- 
{#if target}
<p>This is {address}</p>
{:else}
<p>No target defined.</p>
{/if} -->

<style>
	input[type=text] {
		border: 2px solid orangered;
		border-radius: 4px;
		color: var(--color-bg-0);
		text-decoration: none;
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>