<script>
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

</script>
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
		<span class="welcome">
			<div class="center">
				{#if !connected}
				<button class="button-22" on:click={onMetaMaskButton}>
					{metaMaskButtonString}
				</button>
				{/if}
				{#if connected}
					<h3> You are connected</h3>
				{/if}
			</div>
		</span>
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

	.center {
		margin: 0;
		position: absolute;
		top: 50%;
		left: 50%;
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
}
</style>
