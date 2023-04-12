<script lang="ts">
    import ConnectionStatusLine from '$lib/components/ConnectionStatusLine.svelte';

    import { appStateController } from '$lib/script/app_state_controller';
    const { userAccount } = appStateController;

    import { page } from '$app/stores';
    import { hex2int, int2hex } from '$lib/script/utils';
    import { onMount } from 'svelte';
    import { fanImageContractABI } from '$lib/constants/fan_image_abi.js';
    import { canvasStateController } from '$lib/script/canvas_state_controller';
    const { pricePerPixel, changedPixels } = canvasStateController;

    import Web3 from 'web3';
    import type Contract from 'web3-eth-contract';
    import type { AbiItem } from 'web3-utils';
    import { ethernolDBService } from '$lib/script/services/ethernol_db_service';

    let canvas: HTMLCanvasElement;
    let guide: HTMLElement;
    let colorInput: HTMLInputElement;
    let toggleGuide: HTMLInputElement;
    let remover: HTMLInputElement;

    let canvasWidth: number;
    let canvasHeight: number;
    let drawingContext: CanvasRenderingContext2D;
    let cellPixelLength: number;

    let initialImage: number[][];

    const emptyColor = '#ffffff55';

    let imageAddress = '0x570BA4F0A9e272a7C8999eE061B789C1f001CaFf';
    if ($page.url.searchParams.has('target')) {
        imageAddress = $page.url.searchParams.get('target') as string;
    }

    let metaMaskButtonString = '';
    let connected = false;
    let loaded = false;
    let ready = false;

    let account = '';
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

    async function getFanImage() {
        web3 = new Web3(window.ethereum);
        fanImageContractInstance = new web3.eth.Contract(
            fanImageContractABI as unknown as AbiItem[],
            imageAddress
        );
        fanImageContractInstance.methods
            .getPricePerPixel()
            .call({ from: account })
            .then((ppp: number) => {
                $pricePerPixel = ppp;
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
        let amount = Object.keys($changedPixels).length;
        let xs = Object.keys($changedPixels).map((key) => key.split(',')[0]);
        let ys = Object.keys($changedPixels).map((key) => key.split(',')[1]);
        let colors = Object.keys($changedPixels).map(
            (key: string) => $changedPixels[key]
        );
        await fanImageContractInstance.methods
            .paintPixels(amount, xs, ys, colors)
            .send({ from: account, value: amount * $pricePerPixel })
            .catch((err: Error) => {
                console.error(err.message);
                return err;
            });

        ethernolDBService.createNewTransaction(
            $userAccount,
            account,
            amount * $pricePerPixel
        );
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
            if (String([cellX, cellY]) in $changedPixels) {
                clearCell(cellX, cellY);
                delete $changedPixels[String([cellX, cellY])];
            }
        } else {
            console.log(initialImage[cellY][cellX]);
            if (initialImage[cellY][cellX] == 999999999) {
                fillCell(cellX, cellY, colorInput.value);
                $changedPixels[String([cellX, cellY])] = hex2int(
                    colorInput.value
                );
            }
        }
        console.log(int2hex(initialImage[cellY][cellX]));
        console.log(Object.keys($changedPixels).length);
        ready = Object.keys($changedPixels).length > 0;
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
</script>

<svelte:head>
    <title>Send</title>
    <meta name="description" content="Send" />
</svelte:head>

<section>
    <ConnectionStatusLine title="Send" />
    <span class="welcome">
        <div class="center">
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
                    <label for="colorInput">Set Color:</label>
                    <input
                        type="color"
                        bind:this={colorInput}
                        id="colorInput"
                    />
                </div>
                <div>
                    <label for="toggleGuide">Show Guide:</label>
                    <input
                        type="checkbox"
                        bind:this={toggleGuide}
                        checked
                        id="toggleGuide"
                    />
                </div>
                <div>
                    <label for="toggleRemover">Remove Pixel:</label>
                    <input
                        type="checkbox"
                        bind:this={remover}
                        id="toggleRemover"
                    />
                </div>
            </div>

            {#if !loaded}
                <div class="center">
                    <input
                        type="text"
                        bind:value={imageAddress}
                        placeholder={imageAddress}
                    />
                    <button class="button-22" on:click={getFanImage}>
                        Open Fan Image.
                    </button>
                </div>
            {/if}

            {#if loaded && ready}
                <div class="center">
                    <button class="button-22" on:click={paintPixels}>
                        Paint pixels (for {Object.keys($changedPixels).length *
                            $pricePerPixel} WEI.).
                    </button>
                </div>
            {/if}
        </div>
    </span>
</section>

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
