<script lang="ts">
    import ConnectionStatusLine from '$lib/components/ConnectionStatusLine.svelte';
    import StandardInput from '$lib/components/StandardInput.svelte';
    import StandardButton from '$lib/components/StandardButton.svelte';
    import StandardForm from '$lib/components/StandardForm.svelte';

    import { creationStateController } from '$lib/script/creation_state_controller';
    const { pricePerPixel } = creationStateController;

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
        remover,
        changedPixels
    } = canvasStateController;
</script>

<ConnectionStatusLine title="Send">
    <StandardForm>
        <StandardInput
            type="color"
            bind:this={$colorInput}
            placeholder={$colorInput}
            id="colorInput"
            label="Set Color:"
        />
        <StandardInput
            type="checkbox"
            bind:this={$toggleGuide}
            placeholder={$toggleGuide}
            id="toggleGuide"
            label="Show Guide:"
            checked
        />
        <StandardInput
            type="checkbox"
            bind:this={$remover}
            placeholder={$remover}
            id="toggleRemover"
            label="Remove Pixel:"
            checked
        />
        {#if $userAccount !== '' && !$loaded}
            <div class="center">
                <StandardButton
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
            <StandardButton
                toggleHandle="paintPixels"
                label="Paint pixels (for {Object.keys($changedPixels).length *
                    $pricePerPixel} + WEI.)."
            />
        {/if}
    </StandardForm>
    <div id="guide" bind:this={$guide} />
    <canvas width="0" height="0" bind:this={$canvas} id="canvas" />
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
