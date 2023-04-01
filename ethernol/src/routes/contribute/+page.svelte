<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { ethernolContractABI } from '$lib/constants/ethernol_abi.js';
    import { fanImageContractABI } from '$lib/constants/fan_image_abi.js';

    import Web3 from 'web3';
    import type Contract from 'web3-eth-contract';
    // import { check_outros } from 'svelte/internal';

    let canvas: HTMLCanvasElement;
    let guide: HTMLElement;
    let colorInput: HTMLInputElement;
    let toggleGuide: HTMLInputElement;
    let remover: HTMLInputElement;

    let canvasWidth;
    let canvasHeight;
    let drawingContext: CanvasRenderingContext2D;
    let cellPixelLength: number;

    let initialImage: number[][];
    let pricePerPixel: number;

    const emptyColor = '#ffffff55';
    const changedPixels: { [key: string]: any } = {};

    // let address = "Enter target wallet"
    // let address = "0x845cBA718f7645E8984AF893425050850411f7D0";
    let address = '0x570BA4F0A9e272a7C8999eE061B789C1f001CaFf';
    if ($page.url.searchParams.has('target')) {
        address = $page.url.searchParams.get('target') as string;
    }

    let smartContractAddress = '0x472eCED37080fbCcb2332562f69B13e6d1c658cA';

    let metaMaskButtonString = '';
    let connected = false;
    let loaded = false;
    let ready = false;

    let account = '';
    let smartContractInstance: Contract;
    let fanImageContractInstance: Contract;
    let web3;

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

    async function onMetaMaskButton() {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        account = accounts[0];
        connected = true;
    }

    async function setSmartContractInstance() {
        // https://sepolia.etherscan.io/tx/0x3837ce40b7a08b82c44cf4d184bb90813a7c23a40928e883f2d9d0f8c3e71e11
        web3 = new Web3(window.ethereum);
        smartContractInstance = new web3.eth.Contract(
            ethernolContractABI,
            smartContractAddress
        );
        return true;
    }

    async function getFanImage() {
        web3 = new Web3(window.ethereum);
        fanImageContractInstance = new web3.eth.Contract(
            fanImageContractABI,
            address
        );
        fanImageContractInstance.methods
            .getPricePerPixel()
            .call({ from: account })
            .then((ppp: number) => {
                pricePerPixel = ppp;
            });
        fanImageContractInstance.methods
            .getImage()
            .call({ from: account })
            .then((img: number[][]) => {
                initialImage = img;
                initImage();
            });

        loaded = true;
    }
    async function paintPixels() {
        // TODO: Move in own function getColors
        let amount = Object.keys(changedPixels).length;
        let xs = Object.keys(changedPixels).map((key) => key.split(',')[0]);
        let ys = Object.keys(changedPixels).map((key) => key.split(',')[1]);
        let colors = Object.keys(changedPixels).map(
            (key: string) => changedPixels[key]
        );
        fanImageContractInstance.methods
            .paintPixels(amount, xs, ys, colors)
            .send({ from: account, value: amount * pricePerPixel });
    }

    function donate(donation: number) {
        if (smartContractInstance !== null) {
            smartContractInstance.methods
                .sendDonation('0xadC756EfB05506E373C1b650050daC0d5b57aE7C')
                .send({ from: account, value: donation });
        }
        // web3.utils.toWei(donation, 'ether')
        console.log('Donated');
    }

    function handleCanvasMousedown(e: MouseEvent) {
        if (e.button !== 0) {
            return;
        }

        const canvasBoundingRect: DOMRect = canvas.getBoundingClientRect();
        const x = e.clientX - canvasBoundingRect.left;
        const y = e.clientY - canvasBoundingRect.top;
        const cellX: number = Math.floor(x / cellPixelLength);
        const cellY: number = Math.floor(y / cellPixelLength);

        if (remover.checked) {
            if (String([cellX, cellY]) in changedPixels) {
                clearCell(cellX, cellY);
                delete changedPixels[String([cellX, cellY])];
            }
        } else {
            console.log(initialImage[cellY][cellX]);
            if (initialImage[cellY][cellX] == 999999999) {
                fillCell(cellX, cellY, colorInput.value);
                changedPixels[String([cellX, cellY])] = hex2int(colorInput.value);
            }
        }
        console.log(int2hex(initialImage[cellY][cellX]));
        console.log(Object.keys(changedPixels).length);
        ready = Object.keys(changedPixels).length > 0;
    }

    function handleToggleGuideChange() {
        guide.style.display = toggleGuide.checked ? '' : 'none';
    }

    function fillCell(cellX: number, cellY: number, color: string) {
        const startX = cellX * cellPixelLength;
        const startY = cellY * cellPixelLength;

        drawingContext.fillStyle = color;
        drawingContext.fillRect(
            startX,
            startY,
            cellPixelLength,
            cellPixelLength
        );
    }

    function clearCell(cellX: number, cellY: number) {
        const startX = cellX * cellPixelLength;
        const startY = cellY * cellPixelLength;

        drawingContext.clearRect(
            startX,
            startY,
            cellPixelLength,
            cellPixelLength
        );
        drawingContext.fillStyle = emptyColor;
        drawingContext.fillRect(
            startX,
            startY,
            cellPixelLength,
            cellPixelLength
        );
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

    function initImage() {
        drawingContext = canvas.getContext('2d') as CanvasRenderingContext2D;

        const CELLS_X: number = initialImage[0].length;
        const CELLS_Y: number = initialImage.length;

        cellPixelLength = Math.floor(500 / CELLS_X);
        canvasWidth = cellPixelLength * CELLS_X;
        canvasHeight = cellPixelLength * CELLS_Y;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // default color
        colorInput.value = '#000000';

        // background
        drawingContext.fillStyle = emptyColor;
        drawingContext.fillRect(0, 0, canvasWidth, canvasHeight);
        drawInitialImage();

        {
            guide.style.width = `${canvasWidth}px`;
            guide.style.height = `${canvasHeight}px`;
            guide.style.gridTemplateColumns = `repeat(${CELLS_X}, 1fr)`;
            guide.style.gridTemplateRows = `repeat(${CELLS_Y}, 1fr)`;

            [...Array(CELLS_X * CELLS_Y)].forEach(() =>
                guide.insertAdjacentHTML('beforeend', '<div></div>')
            );
        }

        canvas.addEventListener('mousedown', handleCanvasMousedown);
        toggleGuide.addEventListener('change', handleToggleGuideChange);
    }
    function componentToHex(c: number) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    function int2hex(i: number) {
        let m = i % 1000000;
        return (
            '#' +
            componentToHex(Math.floor(i / 1000000)) +
            componentToHex(Math.floor(m / 1000)) +
            componentToHex(Math.floor(m % 1000))
        );
    }

    function hex2int(hex: string) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? parseInt(result[1], 16) * 1000000 +
                  parseInt(result[2], 16) * 1000 +
                  parseInt(result[3], 16)
            : null;
    }
</script>

<svelte:head>
    <title>Send</title>
    <meta name="description" content="Send" />
</svelte:head>

<section>
    <h1>Send</h1>
    <span class="welcome">
        <div class="center">
            {#if !connected}
                <div class="center">
                    <button class="button-22" on:click={onMetaMaskButton}>
                        {metaMaskButtonString}
                    </button>
                </div>
            {/if}

            <div>
                <div>
                    <div id="guide" bind:this={guide} />
                    <canvas
                        width="0"
                        height="0"
                        bind:this={canvas}
                        id="canvas"
                    />
                </div>
                <div>
                    <label for="colorInput">Set Color: </label>
                    <input
                        type="color"
                        bind:this={colorInput}
                        id="colorInput"
                    />
                </div>
                <div>
                    <label for="toggleGuide">Show Guide: </label>
                    <input
                        type="checkbox"
                        bind:this={toggleGuide}
                        checked
                        id="toggleGuide"
                    />
                </div>
                <div>
                    <label for="toggleRemover">Remove Pixel: </label>
                    <input
                        type="checkbox"
                        bind:this={remover}
                        id="toggleRemover"
                    />
                </div>
            </div>

            {#if connected && !loaded}
                <div class="center">
                    <input
                        type="text"
                        bind:value={address}
                        placeholder={address}
                    />
                    <button class="button-22" on:click={getFanImage}>
                        Open Fan Image.
                    </button>
                </div>
            {/if}

            {#if loaded && ready}
                <div class="center">
                    <button class="button-22" on:click={paintPixels}>
                        Paint pixels (for {Object.keys(changedPixels).length *
                            pricePerPixel} WEI.).
                    </button>
                </div>
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
    input[type='text'] {
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

