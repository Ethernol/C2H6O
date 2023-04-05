
<svelte:head>
    <title>Receive</title>
    <meta name="description" content="Receive" />
</svelte:head>

<section>
    <h1>Receive Ethernol</h1>
    <h2>Create your link</h2>
    <span class="welcome">
        <div class="center">
            {#if !connected}
                <button class="button-22" on:click={onMetaMaskButton}>
                    {metaMaskButtonString}
                </button>
            {/if}
            {#if connected}
                <h3>Your Wallet:</h3>
                <input
                    type="text"
                    bind:value={account}
                    placeholder={account}
                    readonly
                />
                <h3>Enter Shortname:</h3>
                <input
                    type="text"
                    bind:value={shortname}
                    placeholder={shortname}
                />
                {#if !link_created}
                    <button class="button-22" on:click={createLink}>
                        Create Link
                    </button>
                {/if}
                {#if link_created}
                    <h3>Link:</h3>
                    <h2>{link}</h2>
                    <button class="button-22" use:copy={link}> Copy! </button>
                {/if}
            {/if}
        </div>
    </span>
</section>
<div id="clipboard" />

<style>
    input[type='text'] {
        border: 2px solid orangered;
        border-radius: 4px;
        width: 100%;
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

    h1 {
        width: 100%;
    }

    .welcome {
        display: block;
        position: relative;
        width: 100%;
        height: 0;
        padding: 0 0 calc(100% * 495 / 2048) 0;
        color: var(--color-theme-1);
    }

    .center {
        margin: 0;
        width: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
</style>
