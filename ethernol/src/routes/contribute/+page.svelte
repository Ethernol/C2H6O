<script lang="ts">
    import ConnectionStatusLine from '$lib/components/ConnectionStatusLine.svelte';
    import StandardButton from '$lib/components/StandardButton.svelte';

    import { appStateController } from '$lib/script/app_state_controller';
    const { userAccount } = appStateController;

    import { canvasStateController } from '$lib/script/canvas_state_controller';
    const {
        imageAddress,
        ready,
        loaded,

        canvas,
        guide,
        colorInput,
        toggleGuide,
        remover
    } = canvasStateController;
</script>

<ConnectionStatusLine title="Send">
    <div id="guide" bind:this={$guide} />

    <canvas width="0" height="0" bind:this={$canvas} id="canvas" />

    <label for="colorInput">Set Color: </label>
    <input type="color" bind:this={$colorInput} id="colorInput" />
    <label for="toggleGuide">Show Guide: </label>
    <input type="checkbox" bind:this={$toggleGuide} checked id="toggleGuide" />
    <label for="toggleRemover">Remove Pixel: </label>
    <input type="checkbox" bind:this={$remover} id="toggleRemover" />

    {#if $userAccount !== '' && !$loaded}
        <div class="center">
            <input
                type="text"
                bind:value={$imageAddress}
                placeholder={$imageAddress}
            />
            <StandardButton
                toggleHandle="getFanImage"
                label="Open Fan Image."
            />
        </div>
    {/if}

    {#if $loaded && $ready}
        <div class="center">
            <StandardButton toggleHandle="paintPixels" />
            <!-- label="Paint pixels (for {Object.keys($changedPixels).length *$pricePerPixel} + WEI.)."/> -->
        </div>
    {/if}
</ConnectionStatusLine>

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

    /* Make border color of fields in grid */
    #guide :global(div) {
        border: 1px solid rgba(0, 0, 0, 0.2);
    }
</style>
