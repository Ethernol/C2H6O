<script lang="ts">
    import ConnectionStatusLine from '$lib/components/ConnectionStatusLine.svelte';
    import StandardInput from '$lib/components/StandardInput.svelte';
    import StandardButton from '$lib/components/StandardButton.svelte';

    import { appStateController } from '$lib/script/app_state_controller';
    const { userAccount } = appStateController;

    import { creationStateController } from '$lib/script/creation_state_controller';
    const { shortName, link, pricePerPixel, width, height } =
        creationStateController;
</script>

<ConnectionStatusLine title="Create Your Image">
    <div class="w-full max-w-md m-3">
        <form
            class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            autocomplete="off"
        >
            <StandardInput
                bind:value={$userAccount}
                placeholder={$userAccount}
                id="userAccount"
                label="User Account:"
                readonly
            />

            <StandardInput
                placeholder={$shortName}
                id="userAccount"
                label="Enter Shortname:"
            />

            <StandardInput
                type="number"
                value={$width}
                id="width"
                label="Image width:"
            />

            <StandardInput
                type="number"
                value={$height}
                id="height"
                label="Image height:"
            />

            <StandardInput
                type="number"
                value={$pricePerPixel}
                id="ppp"
                label="Price per Pixel:"
            />
            {#if $link === ''}
                <StandardButton toggleHandle="createLink" label="Create Link" />
            {:else}
                <StandardInput
                    id={$link}
                    placeholder={$link}
                    label="Link:"
                    readonly
                />
                <StandardButton label="Copy!" content={$link} />
            {/if}
        </form>
    </div>
</ConnectionStatusLine>
