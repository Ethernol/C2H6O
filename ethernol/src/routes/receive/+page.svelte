<script>
    import { onMount } from 'svelte';
    // import { smartContractABI } from "$lib/constants/abi.js";
    // import { page } from '$app/stores';
    import { copy } from 'svelte-copy';

    // import Web3 from 'web3';

    // let smartContractAddress = "0x472eCED37080fbCcb2332562f69B13e6d1c658cA";

    let metaMaskButtonString = '';
    let connected = false;

    let account = '';
    // let smartContractInstance;
    // let web3;
    let shortname = '';
    let base_link = window.location.href;
    base_link = base_link.replace('receive', 'send');
    base_link += '?target=';
    let link = '';
    let link_created = false;

    onMount(async () => {
        metaMaskButtonString = checkMetaMask();

        function checkMetaMask() {
            if (typeof window.ethereum == 'undefined') {
                console.log('MetaMask is not installed!');
                return 'MetaMask is not installed.\nClick here to install!';
            }
            return 'Click here to login via MetaMask.';
        }
    });

    async function onMetaMaskButton() {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        account = accounts[0];
        connected = true;
        // setSmartContractInstance();
    }

    function createLink() {
        link_created = true;
        if (shortname === '') {
            link = base_link + account;
        } else {
            link = base_link + shortname;
        }
    }
</script>

<svelte:head>
    <title>Recieve</title>
    <meta name="description" content="Recieve" />
</svelte:head>

<section>
    <h1>Recieve Ethernol</h1>
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
