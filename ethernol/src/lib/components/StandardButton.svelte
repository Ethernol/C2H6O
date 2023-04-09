<script lang="ts">
    import { isAddress } from '@ethersproject/address';
    import { copy } from 'svelte-copy';
    import Web3 from 'web3';

    import { emptyColor } from '$lib/script/constants';
    import { hex2int, int2hex } from '$lib/script/utils';

    import { fanImageContractABI } from '$lib/script/constants';

    import { creationStateController } from '$lib/script/creation_state_controller';
    const { shortName, link, pricePerPixel } = creationStateController;

    import { appStateController } from '$lib/script/app_state_controller';
    const { userAccount } = appStateController;

    import { canvasStateController } from '$lib/script/canvas_state_controller';
    const {
        web3,
        imageAddress,
        canvasWidth,
        canvasHeight,
        cellPixelLength,
        initialImage,
        ready,
        loaded,

        canvas,
        guide,
        colorInput,
        toggleGuide,
        remover,
        drawingContext,
        fanImageContractInstance,

        changedPixels
    } = canvasStateController;

    export let label = '';
    export let content = '';
    export let toggleHandle = '';

    async function createLink() {
        let base_link = window.location.href;
        base_link = base_link.replace('receive', 'send') + '?target=';
        $link =
            $shortName === ''
                ? base_link + $userAccount
                : base_link + $shortName;
    }

    async function setAddressFromLinkOrDefault() {
        let url_ending = window.location.href.split('/').pop() as string;
        return isAddress(url_ending)
            ? url_ending
            : '0x570BA4F0A9e272a7C8999eE061B789C1f001CaFf';
    }

    async function getFanImage() {
        let _web3 = new Web3(window.ethereum);
        web3.set(_web3);
        imageAddress.set(await setAddressFromLinkOrDefault());
        fanImageContractInstance.set(new _web3.eth.Contract(
            fanImageContractABI,
            $imageAddress
        ));

        $fanImageContractInstance.methods
            .getPricePerPixel()
            .call({ from: $userAccount })
            .then((ppp: number) => {
                $pricePerPixel = ppp;
            });
        $fanImageContractInstance.methods
            .getImage()
            .call({ from: $userAccount })
            .then((img: number[][]) => {
                $initialImage = img;
                initImage();
            });

        $loaded = true;
    }

    function handleCanvasMousedown(e: MouseEvent) {
        if (e.button !== 0) {
            return;
        }

        const canvasBoundingRect: DOMRect = $canvas.getBoundingClientRect();
        const x = e.clientX - canvasBoundingRect.left;
        const y = e.clientY - canvasBoundingRect.top;
        const cellX: number = Math.floor(x / $cellPixelLength);
        const cellY: number = Math.floor(y / $cellPixelLength);

        if ($remover.checked) {
            if (String([cellX, cellY]) in $changedPixels) {
                clearCell(cellX, cellY);
                delete $changedPixels[String([cellX, cellY])];
            }
        } else {
            console.log($initialImage[cellY][cellX]);
            if ($initialImage[cellY][cellX] == 999999999) {
                fillCell(cellX, cellY, $colorInput.value);
                $changedPixels[String([cellX, cellY])] = hex2int(
                    $colorInput.value
                );
            }
        }
        console.log(int2hex($initialImage[cellY][cellX]));
        console.log(Object.keys($changedPixels).length);
        $ready = Object.keys($changedPixels).length > 0;
    }

    async function paintPixels() {
        let amount = Object.keys(changedPixels).length;
        let xs = Object.keys(changedPixels).map((key) => key.split(',')[0]);
        let ys = Object.keys(changedPixels).map((key) => key.split(',')[1]);
        let colors = Object.keys(changedPixels).map(
            (key: string) => $changedPixels[key]
        );
        $fanImageContractInstance.methods
            .paintPixels(amount, xs, ys, colors)
            .send({ from: userAccount, value: amount * $pricePerPixel });
    }

    function initImage() {
        $drawingContext = $canvas.getContext('2d') as CanvasRenderingContext2D;

        const CELLS_X: number = $initialImage[0].length;
        const CELLS_Y: number = $initialImage.length;

        $cellPixelLength = Math.floor(500 / CELLS_X);
        $canvasWidth = $cellPixelLength * CELLS_X;
        $canvasHeight = $cellPixelLength * CELLS_Y;

        $canvas.width = $canvasWidth;
        $canvas.height = $canvasHeight;

        // default color
        $colorInput.value = '#000000';

        // background
        $drawingContext.fillStyle = emptyColor;
        $drawingContext.fillRect(0, 0, $canvasWidth, $canvasHeight);
        drawInitialImage();

        {
            $guide.style.width = `${canvasWidth}px`;
            $guide.style.height = `${canvasHeight}px`;
            $guide.style.gridTemplateColumns = `repeat(${CELLS_X}, 1fr)`;
            $guide.style.gridTemplateRows = `repeat(${CELLS_Y}, 1fr)`;

            [...Array(CELLS_X * CELLS_Y)].forEach(() =>
                $guide.insertAdjacentHTML('beforeend', '<div></div>')
            );
        }

        $canvas.addEventListener('mousedown', handleCanvasMousedown);
        $toggleGuide.addEventListener('change', handleToggleGuideChange);
    }

    function handleToggleGuideChange() {
        $guide.style.display = $toggleGuide.checked ? '' : 'none';
    }

    function clearCell(cellX: number, cellY: number) {
        const startX = cellX * $cellPixelLength;
        const startY = cellY * $cellPixelLength;

        $drawingContext.clearRect(
            startX,
            startY,
            $cellPixelLength,
            $cellPixelLength
        );
        $drawingContext.fillStyle = emptyColor;
        $drawingContext.fillRect(
            startX,
            startY,
            $cellPixelLength,
            $cellPixelLength
        );
    }

    function drawInitialImage() {
        for (let j = 0; j < $initialImage.length; j++) {
            let row = $initialImage[j];
            for (let i = 0; i < row.length; i++) {
                if (row[i] != 999999999) {
                    fillCell(i, j, int2hex(row[i]));
                }
            }
        }
    }

    function fillCell(cellX: number, cellY: number, color: string) {
        const startX = cellX * $cellPixelLength;
        const startY = cellY * $cellPixelLength;

        $drawingContext.fillStyle = color;
        $drawingContext.fillRect(
            startX,
            startY,
            $cellPixelLength,
            $cellPixelLength
        );
    }

    let handleClick: { (): Promise<void>; (): Promise<void>; (): void };
    if (toggleHandle === 'getFanImage') handleClick = getFanImage;
    else if (toggleHandle === 'paintPixels') handleClick = paintPixels;
    else if (toggleHandle === 'createLink') handleClick = createLink;
</script>

{#if content !== ''}
    <button
        class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-3 rounded mt-4"
        use:copy={content}
        >{label}
    </button>
{:else}
    <button
        class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-3 rounded mt-4"
        on:click={handleClick}
        >{label}
    </button>
{/if}
