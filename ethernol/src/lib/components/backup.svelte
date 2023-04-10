<!-- <script lang="ts"> -->
<!--     import Web3 from 'web3'; -->
<!--     import { isAddress } from '@ethersproject/address'; -->
<!--     import { fanImageContractABI } from '$lib/script/constants'; -->
<!--     import { hex2int, int2hex } from '$lib/script/utils'; -->
<!--     import { emptyColor } from '$lib/script/constants'; -->

<!--     // import ConnectionStatusLine from '$lib/components/ConnectionStatusLine.svelte'; -->
<!--     // import StandardInput from '$lib/components/StandardInput.svelte'; -->
<!--     // import StandardButton from '$lib/components/StandardButton.svelte'; -->
<!--     import StandardForm from '$lib/components/StandardForm.svelte'; -->

<!--     import { creationStateController } from '$lib/script/creation_state_controller'; -->
<!--     const { pricePerPixel } = creationStateController; -->

<!--     import { appStateController } from '$lib/script/app_state_controller'; -->
<!--     const { userAccount } = appStateController; -->

<!--     import { canvasStateController } from '$lib/script/canvas_state_controller'; -->

<!--     let colorInput: HTMLInputElement; -->
<!--     let toggleGuide: HTMLInputElement; -->
<!--     let remover: HTMLInputElement; -->

<!--     const { -->
<!--         fanImageContractInstance, -->
<!--         drawingContext, -->
<!--         cellPixelLength, -->
<!--         canvasWidth, -->
<!--         canvasHeight, -->
<!--         web3, -->

<!--         initialImage, -->
<!--         imageAddress, -->
<!--         ready, -->
<!--         loaded, -->

<!--         canvas, -->
<!--         guide, -->
<!--         // colorInput, -->
<!--         // toggleGuide, -->
<!--         // remover, -->
<!--         changedPixels -->
<!--     } = canvasStateController; -->

<!--     async function paintPixels() { -->
<!--         let amount = Object.keys(changedPixels).length; -->
<!--         let xs = Object.keys(changedPixels).map((key) => key.split(',')[0]); -->
<!--         let ys = Object.keys(changedPixels).map((key) => key.split(',')[1]); -->
<!--         let colors = Object.keys(changedPixels).map( -->
<!--             (key: string) => $changedPixels[key] -->
<!--         ); -->
<!--         $fanImageContractInstance.methods -->
<!--             .paintPixels(amount, xs, ys, colors) -->
<!--             .send({ from: userAccount, value: amount * $pricePerPixel }); -->
<!--     } -->

<!--     function clearCell(cellX: number, cellY: number) { -->
<!--         const startX = cellX * $cellPixelLength; -->
<!--         const startY = cellY * $cellPixelLength; -->

<!--         $drawingContext.clearRect( -->
<!--             startX, -->
<!--             startY, -->
<!--             $cellPixelLength, -->
<!--             $cellPixelLength -->
<!--         ); -->
<!--         $drawingContext.fillStyle = emptyColor; -->
<!--         $drawingContext.fillRect( -->
<!--             startX, -->
<!--             startY, -->
<!--             $cellPixelLength, -->
<!--             $cellPixelLength -->
<!--         ); -->
<!--     } -->

<!--     function drawInitialImage() { -->
<!--         for (let j = 0; j < $initialImage.length; j++) { -->
<!--             let row = $initialImage[j]; -->
<!--             for (let i = 0; i < row.length; i++) { -->
<!--                 if (row[i] != 999999999) { -->
<!--                     fillCell(i, j, int2hex(row[i])); -->
<!--                 } -->
<!--             } -->
<!--         } -->
<!--     } -->
<!--     function handleCanvasMousedown(e: MouseEvent) { -->
<!--         if (e.button !== 0) { -->
<!--             return; -->
<!--         } -->

<!--         const canvasBoundingRect: DOMRect = $canvas.getBoundingClientRect(); -->
<!--         const x = e.clientX - canvasBoundingRect.left; -->
<!--         const y = e.clientY - canvasBoundingRect.top; -->
<!--         const cellX: number = Math.floor(x / $cellPixelLength); -->
<!--         const cellY: number = Math.floor(y / $cellPixelLength); -->

<!--         if (remover) { -->
<!--             if (String([cellX, cellY]) in $changedPixels) { -->
<!--                 clearCell(cellX, cellY); -->
<!--                 delete $changedPixels[String([cellX, cellY])]; -->
<!--             } -->
<!--         } else { -->
<!--             console.log($initialImage[cellY][cellX]); -->
<!--             if ($initialImage[cellY][cellX] == 999999999) { -->
<!--                 fillCell(cellX, cellY, colorInput.value); -->
<!--                 $changedPixels[String([cellX, cellY])] = hex2int(colorInput.value); -->
<!--             } -->
<!--         } -->
<!--         console.log(int2hex($initialImage[cellY][cellX])); -->
<!--         console.log(Object.keys($changedPixels).length); -->
<!--         $ready = Object.keys($changedPixels).length > 0; -->
<!--     } -->

<!--     function fillCell(cellX: number, cellY: number, color: string) { -->
<!--         const startX = cellX * $cellPixelLength; -->
<!--         const startY = cellY * $cellPixelLength; -->

<!--         $drawingContext.fillStyle = color; -->
<!--         $drawingContext.fillRect( -->
<!--             startX, -->
<!--             startY, -->
<!--             $cellPixelLength, -->
<!--             $cellPixelLength -->
<!--         ); -->
<!--     } -->

<!--     function initImage() { -->
<!--         $drawingContext = $canvas.getContext('2d') as CanvasRenderingContext2D; -->

<!--         const CELLS_X: number = $initialImage[0].length; -->
<!--         const CELLS_Y: number = $initialImage.length; -->

<!--         $cellPixelLength = Math.floor(500 / CELLS_X); -->
<!--         $canvasWidth = $cellPixelLength * CELLS_X; -->
<!--         $canvasHeight = $cellPixelLength * CELLS_Y; -->

<!--         $canvas.width = $canvasWidth; -->
<!--         $canvas.height = $canvasHeight; -->

<!--         // background -->
<!--         $drawingContext.fillStyle = emptyColor; -->
<!--         $drawingContext.fillRect(0, 0, $canvasWidth, $canvasHeight); -->
<!--         drawInitialImage(); -->

<!--         { -->
<!--             $guide.style.width = `${canvasWidth}px`; -->
<!--             $guide.style.height = `${canvasHeight}px`; -->
<!--             $guide.style.gridTemplateColumns = `repeat(${CELLS_X}, 1fr)`; -->
<!--             $guide.style.gridTemplateRows = `repeat(${CELLS_Y}, 1fr)`; -->

<!--             [...Array(CELLS_X * CELLS_Y)].forEach(() => -->
<!--                 $guide.insertAdjacentHTML('beforeend', '<div></div>') -->
<!--             ); -->
<!--         } -->

<!--         $canvas.addEventListener('mousedown', handleCanvasMousedown); -->
<!--         toggleGuide.addEventListener('change', handleToggleGuideChange); -->
<!--     } -->

<!--     function handleToggleGuideChange() { -->
<!--         $guide.style.display = toggleGuide.checked ? '' : 'none'; -->
<!--     } -->

<!--     async function setAddressFromLinkOrDefault() { -->
<!--         let url_ending = window.location.href.split('/').pop() as string; -->
<!--         return isAddress(url_ending) -->
<!--             ? url_ending -->
<!--             : '0x570BA4F0A9e272a7C8999eE061B789C1f001CaFf'; -->
<!--     } -->

<!--     async function getFanImage() { -->
<!--         let _web3 = new Web3(window.ethereum); -->
<!--         web3.set(_web3); -->
<!--         imageAddress.set(await setAddressFromLinkOrDefault()); -->
<!--         fanImageContractInstance.set( -->
<!--             new _web3.eth.Contract(fanImageContractABI, $imageAddress) -->
<!--         ); -->

<!--         $fanImageContractInstance.methods -->
<!--             .getPricePerPixel() -->
<!--             .call({ from: $userAccount }) -->
<!--             .then((ppp: number) => { -->
<!--                 $pricePerPixel = ppp; -->
<!--             }); -->
<!--         $fanImageContractInstance.methods -->
<!--             .getImage() -->
<!--             .call({ from: $userAccount }) -->
<!--             .then((img: number[][]) => { -->
<!--                 $initialImage = img; -->
<!--                 initImage(); -->
<!--             }); -->

<!--         $loaded = true; -->
<!--     } -->
<!-- </script> -->

<!-- <section> -->
<!--     <h1>Send</h1> -->
<!--     <span class="welcome"> -->
<!--         <div class="center"> -->
<!--             <div> -->
<!--                 <div> -->
<!--                     <div id="guide" bind:this={$guide} /> -->
<!--                     <canvas -->
<!--                         width="0" -->
<!--                         height="0" -->
<!--                         bind:this={$canvas} -->
<!--                         id="canvas" -->
<!--                     /> -->
<!--                 </div> -->

<!--                 <StandardForm> -->
<!--                     <div> -->
<!--                         <label for="colorInput">Set Color: </label> -->
<!--                         <input -->
<!--                             type="color" -->
<!--                             bind:this={colorInput} -->
<!--                             id="colorInput" -->
<!--                         /> -->
<!--                     </div> -->
<!--                     <div> -->
<!--                         <label for="toggleGuide">Show Guide: </label> -->
<!--                         <input -->
<!--                             type="checkbox" -->
<!--                             bind:this={toggleGuide} -->
<!--                             checked -->
<!--                             id="toggleGuide" -->
<!--                         /> -->
<!--                     </div> -->
<!--                     <div> -->
<!--                         <label for="toggleRemover">Remove Pixel: </label> -->
<!--                         <input -->
<!--                             type="checkbox" -->
<!--                             bind:this={remover} -->
<!--                             id="toggleRemover" -->
<!--                         /> -->
<!--                     </div> -->

<!--                     {#if $userAccount && !$loaded} -->
<!--                         <div class="center"> -->
<!--                             <input -->
<!--                                 type="text" -->
<!--                                 bind:value={$imageAddress} -->
<!--                                 placeholder={$imageAddress} -->
<!--                             /> -->
<!--                             <button class="button-22" on:click={getFanImage}> -->
<!--                                 Open Fan Image. -->
<!--                             </button> -->
<!--                         </div> -->
<!--                     {/if} -->

<!--                     {#if loaded && ready} -->
<!--                         <div class="center"> -->
<!--                             <button class="button-22" on:click={paintPixels}> -->
<!--                                 Paint pixels (for {Object.keys($changedPixels) -->
<!--                                     .length * $pricePerPixel} WEI.). -->
<!--                             </button> -->
<!--                         </div> -->
<!--                     {/if} -->
<!--                 </StandardForm> -->
<!--             </div> -->
<!--         </div> -->
<!--     </span> -->
<!-- </section> -->

<!-- <!-- <ConnectionStatusLine title="Send"> --> -->
<!-- <!--     {#if $userAccount !== ''} --> -->
<!-- <!--         {#if $toggleGuide} --> -->
<!-- <!--             <div id="guide" style="dispay: none" bind:this={$guide} /> --> -->
<!-- <!--         {:else} --> -->
<!-- <!--             <div id="guide" bind:this={$guide} /> --> -->
<!-- <!--         {/if} --> -->
<!-- <!--         <canvas width="0" height="0" bind:this={$canvas} id="canvas" /> --> -->
<!-- <!--         <StandardForm> --> -->
<!-- <!--             <input --> -->
<!-- <!--                 type="color" --> -->
<!-- <!--                 bind:value={$colorInput} --> -->
<!-- <!--                 id="colorInput" --> -->
<!-- <!--             /> --> -->

<!-- <!--                 label="Set Color:" --> -->

<!-- <!--             <StandardInput --> -->
<!-- <!--                 type="checkbox" --> -->
<!-- <!--                 bind:value={$toggleGuide} --> -->
<!-- <!--                 id="toggleGuide" --> -->
<!-- <!--                 label="Show Guide:" --> -->
<!-- <!--             /> --> -->
<!-- <!--             <input --> -->
<!-- <!--                 type="checkbox" --> -->
<!-- <!--                 bind:value={$toggleGuide} --> -->
<!-- <!--                 checked --> -->
<!-- <!--                 id="toggleGuide" --> -->
<!-- <!--             /> --> -->

<!-- <!--             <input type="checkbox" bind:value={$remover} id="toggleRemover" /> --> -->
<!-- <!--             <StandardInput --> -->
<!-- <!--                 type="checkbox" --> -->
<!-- <!--                 bind:value={$remover} --> -->
<!-- <!--                 id="toggleRemover" --> -->
<!-- <!--                 label="Remove Pixel:" --> -->
<!-- <!--             /> --> -->
<!-- <!--             {#if !$loaded} --> -->
<!-- <!--                 <StandardInput --> -->
<!-- <!--                     bind:value={$imageAddress} --> -->
<!-- <!--                     id="imageAddress" --> -->
<!-- <!--                     label="Image address:" --> -->
<!-- <!--                 /> --> -->
<!-- <!--                 <StandardButton --> -->
<!-- <!--                     toggleHandle="getFanImage" --> -->
<!-- <!--                     label="Open Fan Image." --> -->
<!-- <!--                 /> --> -->
<!-- <!--             {/if} --> -->
<!-- <!--             {#if $loaded && $ready} --> -->
<!-- <!--                 <StandardButton --> -->
<!-- <!--                     toggleHandle="paintPixels" --> -->
<!-- <!--                     label="Paint pixels for {Object.keys($changedPixels) --> -->
<!-- <!--                         .length * $pricePerPixel} WEI." --> -->
<!-- <!--                 /> --> -->
<!-- <!--             {/if} --> -->
<!-- <!--         </StandardForm> --> -->
<!-- <!--     {/if} --> -->

<!-- <!-- </ConnectionStatusLine> --> -->
<!-- <style> -->
<!--     input[type='text'] { -->
<!--         border: 2px solid orangered; -->
<!--         border-radius: 4px; -->
<!--         color: var(--color-bg-0); -->
<!--         text-decoration: none; -->
<!--     } -->

<!--     section { -->
<!--         display: flex; -->
<!--         flex-direction: column; -->
<!--         justify-content: center; -->
<!--         align-items: center; -->
<!--         flex: 0.6; -->
<!--     } -->

<!--     #canvas { -->
<!--         cursor: pointer; -->
<!--         margin-top: 20px; -->
<!--         margin-bottom: 20px; -->
<!--     } -->

<!--     #guide { -->
<!--         display: grid; -->
<!--         pointer-events: none; -->
<!--         position: absolute; -->

<!--         border: 1px solid rgba(0, 0, 0, 0.2); -->
<!--     } -->

<!--     #guide :global(div) { -->
<!--         border: 1px solid rgba(0, 0, 0, 0.2); -->
<!--     } -->
<!-- </style> -->


