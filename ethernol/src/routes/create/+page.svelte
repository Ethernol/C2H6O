
<svelte:head>
    <title>Create</title>
    <meta name="description" content="Create" />
</svelte:head>

<section>
    <h1>Create your Image</h1>
    <span class="welcome">
        <div class="center">
            {#if !connected}
                <div class="center">
                    <button class="button-22" on:click={onMetaMaskButton}>
                        {metaMaskButtonString}
                    </button>
                </div>
            {:else}
                <h3>Your Wallet:</h3>
                <input
                    type="text"
                    bind:value={account}
                    placeholder={account}
                    readonly
                />
                <h3>Enter Shortname:</h3>
                <input type="text" bind:value={shortname} />
                <h3>Image width:</h3>
                <input type="text" bind:value={width} />
                <h3>Image heigth:</h3>
                <input type="text" bind:value={heigth} />
                <h3>Price per pixel:</h3>
                <input type="text" bind:value={ppp} />

                {#if !link_created}
                    <button class="button-22" on:click={createLink}>
                        Create Link
                    </button>
                {:else}
                    <h3>Link:</h3>
                    <h2>{link}</h2>
                    <button class="button-22" use:copy={link}> Copy! </button>
                {/if}
            {/if}
        </div>
    </span>
</section>
<div id="clipboard" />
