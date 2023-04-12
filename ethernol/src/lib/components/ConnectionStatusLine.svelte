<script lang="ts">
    import { onMount } from 'svelte';
    import { appStateController } from '$lib/script/app_state_controller';
    import { ethernolDBService } from '$lib/script/services/ethernol_db_service';
    const { userAccount } = appStateController;

    async function onMountConfig() {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            if (accounts.length > 0) {
                // Set user address in store
                if ($userAccount !== accounts[0]) {
                    $userAccount = accounts[0];
                    ethernolDBService.createNewUser($userAccount);
                }
            } else {
                console.log('No accounts found.');
            }
        } else {
            console.log('Metamask not detected.');
        }
    }

    onMount(onMountConfig);
    export let title = 'Home';
</script>

<section>
    <span class="w-full max-w-md m-3 font-bold mt-2 mb-2">
        {#if title !== ''}
            <h1 class="my-4">{title}</h1>
        {/if}
        <h3 class="text-left">
            {$userAccount === ''
                ? 'No MetaMask detected.'
                : 'You are connected with address:'} <br />
            <p class="text-orange-500">{$userAccount}</p>
        </h3>
    </span>
    <slot />
</section>
