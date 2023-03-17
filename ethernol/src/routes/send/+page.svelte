<script>
	import { page } from '$app/stores';
	import { onMount } from "svelte";
	import { smartContractABI } from "$lib/constants/abi.js";

	import Web3 from 'web3';
    import { check_outros } from 'svelte/internal';

	let canvas;
	let guide;
	let colorInput;
	let toggleGuide;
	let remover;

	const CELLS_X = 15;
	const CELLS_Y = 20;
	const cellPixelLength = Math.floor(500 / CELLS_X);
	const canvasWidth = cellPixelLength * CELLS_X;
	const canvasHeight = cellPixelLength * CELLS_Y;

	const changedPixels = {};

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
		const drawingContext = canvas.getContext("2d");

		// default color
		colorInput.value = "#000000";

		// background
		const emptyColor = "#ffffff";
		drawingContext.fillStyle = emptyColor;
		drawingContext.fillRect(0, 0, canvasWidth, canvasHeight);

		{
			guide.style.width = `${canvasWidth}px`;
			guide.style.height = `${canvasHeight}px`;
			guide.style.gridTemplateColumns = `repeat(${CELLS_X}, 1fr)`;
			guide.style.gridTemplateRows = `repeat(${CELLS_Y}, 1fr)`;

			[...Array(CELLS_X * CELLS_Y)].forEach(() => guide.insertAdjacentHTML("beforeend", "<div></div>"));
		}

		function handleCanvasMousedown(e) {
			if (e.button !== 0) {
				return;
			}

			const canvasBoundingRect = canvas.getBoundingClientRect();
			const x = e.clientX - canvasBoundingRect.left;
			const y = e.clientY - canvasBoundingRect.top;
			const cellX = Math.floor(x / cellPixelLength);
			const cellY = Math.floor(y / cellPixelLength);

			if(remover.checked) {
				if(`${cellX}_${cellY}` in changedPixels) {
					fillCell(cellX, cellY, emptyColor);
					delete(changedPixels[`${cellX}_${cellY}`]);
				}
			}else{
				fillCell(cellX, cellY, colorInput.value);
				changedPixels[`${cellX}_${cellY}`] = colorInput.value;
			}
			
			console.log(changedPixels);	
		}

		function handleToggleGuideChange() {
			guide.style.display = toggleGuide.checked ? null : "none";
		}

		function fillCell(cellX, cellY, color) {
			const startX = cellX * cellPixelLength;
			const startY = cellY * cellPixelLength;

			drawingContext.fillStyle = color;
			drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
		}

		canvas.addEventListener("mousedown", handleCanvasMousedown);
		toggleGuide.addEventListener("change", handleToggleGuideChange);

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

			<div>
				<div id="guide" bind:this={guide}></div>
					<canvas width={canvasWidth} height={canvasHeight} bind:this={canvas} id="canvas"></canvas>
				</div>
				<div>
					<label for="colorInput">Set Color: </label>
					<input type="color" bind:this={colorInput} id="colorInput">
				</div>
				<div>
					<label for="toggleGuide">Show Guide: </label>
					<input type="checkbox" bind:this={toggleGuide} checked id="toggleGuide">
				</div>
				<div>
					<label for="toggleRemover">Remove Pixel: </label>
					<input type="checkbox" bind:this={remover} id="toggleRemover">
				</div>
			  
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

	#canvas {
		cursor: pointer;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	#guide {
		display: grid;
		pointer-events: none;
		position: absolute;
		border: 1px solid rgba(0, 0, 0, 0.2);
	}

	#guide :global(div) {
		border: 1px solid rgba(0, 0, 0, 0.2);
	}
</style>