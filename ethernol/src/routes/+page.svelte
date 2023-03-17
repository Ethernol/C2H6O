<script>
	import { onMount } from "svelte";	

	let metaMaskButtonString = "";
	let connected = false;

	let account;

	onMount(async () => {
		metaMaskButtonString = checkMetaMask();

		function checkMetaMask() {
			if (typeof window.ethereum == 'undefined') {			
				console.log('MetaMask is not installed!');
				return 'MetaMask is not installed.\nClick here to install!';
			}
			return 'Click to login with MetaMask';
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
	<meta name="description" content="Home" />
</svelte:head>

<section>
		<h1>Home</h1>
		<span class="welcome">
			<div class="center">
				{#if !connected}
				<div class="center">
					<button class="button-22" on:click={onMetaMaskButton}>
						{metaMaskButtonString}
					</button>
				</div>
				{/if}
				{#if connected}
					<h3> You are connected</h3>
				{/if}
			</div>
		</span>
</section>