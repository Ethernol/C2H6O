<script>
	import Header from './Header.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	import { onMount } from "svelte";

	let meta_mask_button_string = "";

	// let smartContractRepresentation = await new ethers.Contract(
	// 										"0x0575f95B2C83b43cC9B497B2274C5673D735C434",
	// 										smartContractABI,
	// 										provider
	// 									);

	onMount(async () => {
		meta_mask_button_string = checkMetaMask();

		function checkMetaMask() {
			if (typeof window.ethereum == 'undefined') {			
				console.log('MetaMask is not installed!');
				return 'MetaMask is not installed.\nClick here to install!';
			}
			return 'Click here to login via MetaMask.';
		}
		
    });

	async function onMetaMaskButton(){
		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		const account = accounts[0];
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
			<button on:click={onMetaMaskButton}>
				{meta_mask_button_string}
			</button>
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
