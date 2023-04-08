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
