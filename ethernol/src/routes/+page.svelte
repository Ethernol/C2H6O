<svelte:head>
    <title>Home</title>
    <meta name="description" content="Home" />
</svelte:head>

<section>
    <h1>Home</h1>
    <span class="welcome">
        <div class="center">
            {#if !connected}
                <div class="center">
                    <button class="button-22" on:click={onMetaMaskButton}>
                        {metaMaskButtonString}
                    </button>
                </div>
            {/if}
            {#if connected}
                <h3>You are connected</h3>
            {/if}
        </div>
    </span>
</section>
