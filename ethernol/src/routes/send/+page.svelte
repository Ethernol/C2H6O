<script>
	import { page } from '$app/stores';
	import { onMount } from "svelte";
	import { ethernolContractABI } from "$lib/constants/ethernol_abi.js";
	import { fanImageContractABI } from "$lib/constants/fan_image_abi.js";

	import Web3 from 'web3';
    import { check_outros } from 'svelte/internal';

	let canvas;
	let guide;
	let colorInput;
	let toggleGuide;
	let remover;

	let canvasWidth;
	let canvasHeight;
	let drawingContext;
	let cellPixelLength;

	let initialImage;

	const emptyColor = "#ffffff55";
	const changedPixels = {};

	// let address = "Enter target wallet"
	// let address = "0x845cBA718f7645E8984AF893425050850411f7D0";
	let address = "0x570BA4F0A9e272a7C8999eE061B789C1f001CaFf";
	if ($page.url.searchParams.has('target')){
		address = $page.url.searchParams.get('target');
	}

	let smartContractAddress = "0x472eCED37080fbCcb2332562f69B13e6d1c658cA";

	let metaMaskButtonString = "";
	let connected = false;

	let account;
	let smartContractInstance;
	let fanImageContractInstance;
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
	}

	async function setSmartContractInstance() {
		// https://sepolia.etherscan.io/tx/0x3837ce40b7a08b82c44cf4d184bb90813a7c23a40928e883f2d9d0f8c3e71e11
		web3 = new Web3(window.ethereum);		
		smartContractInstance = new web3.eth.Contract(ethernolContractABI, smartContractAddress);
	}
	async function getFanImage() {
		web3 = new Web3(window.ethereum);		
		fanImageContractInstance = new web3.eth.Contract(fanImageContractABI, address);
		fanImageContractInstance.methods.getImage()
							.call({from: account})
							.then((img) => {
								initialImage = img;
								initImage();});
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
					clearCell(cellX, cellY);
					delete(changedPixels[`${cellX}_${cellY}`]);
				}
			}else{
				console.log(initialImage[cellY][cellX]);
				if(initialImage[cellY][cellX] == 999999999){
					fillCell(cellX, cellY, colorInput.value);
					changedPixels[`${cellX}_${cellY}`] = colorInput.value;
				}
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

		function clearCell(cellX, cellY) {
			const startX = cellX * cellPixelLength;
			const startY = cellY * cellPixelLength;

			drawingContext.clearRect(startX, startY, cellPixelLength, cellPixelLength);
			drawingContext.fillStyle = emptyColor;
			drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
		}
		
		function drawInitialImage() {
			for (let j = 0; j < initialImage.length; j++) {
				let row = initialImage[j];
				for (let i = 0; i < row.length; i++) {		
					if (row[i] != 999999999) {
						fillCell(i, j, int2hex(row[i]));
					}
				}
			}
		}

		function initImage(){
		 	drawingContext = canvas.getContext("2d");

			const CELLS_X = initialImage[0].length;
			const CELLS_Y = initialImage.length;

			cellPixelLength = Math.floor(500 / CELLS_X);
			canvasWidth = cellPixelLength * CELLS_X;
			canvasHeight = cellPixelLength * CELLS_Y;
			
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;

			// default color
			colorInput.value = "#000000";

			// background
			drawingContext.fillStyle = emptyColor;
			drawingContext.fillRect(0, 0, canvasWidth, canvasHeight);
			drawInitialImage();

			{	
				guide.style.width = `${canvasWidth}px`;
				guide.style.height = `${canvasHeight}px`;
				guide.style.gridTemplateColumns = `repeat(${CELLS_X}, 1fr)`;
				guide.style.gridTemplateRows = `repeat(${CELLS_Y}, 1fr)`;

				[...Array(CELLS_X * CELLS_Y)].forEach(() => guide.insertAdjacentHTML("beforeend", "<div></div>"));
			}

			canvas.addEventListener("mousedown", handleCanvasMousedown);
			toggleGuide.addEventListener("change", handleToggleGuideChange);

		}
		
		function int2hex(i) {
			let m = Math.floor((i % 1000000) / 1000)
			return "#" + (1 << 24 | Math.floor(i/1000000) << 16 | m << 8 | Math.floor(m % 1000)).toString(16).slice(1);
		}

		function hex2int(hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? [parseInt(result[1], 16)* 1000000,
							parseInt(result[2], 16)* 1000,
							parseInt(result[3], 16)] : null;
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
				<div>
					<div id="guide" bind:this={guide}></div>
					<canvas width=0 height=0 bind:this={canvas} id="canvas"></canvas>
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
			</div>

			{#if connected}	
				<input type="text" bind:value={address} placeholder={address}>
				<button class="button-22" on:click={getFanImage}>
					Open Fan Image.
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