<script lang="ts">
    import ConnectionStatusLine from '$lib/components/ConnectionStatusLine.svelte';
    import StandardInput from '$lib/components/StandardInput.svelte';
    import StandardButton from '$lib/components/StandardButton.svelte';
    import StandardForm from '$lib/components/StandardForm.svelte';


    import { appStateController } from '$lib/script/app_state_controller';
    const { userAccount } = appStateController;

    import { creationStateController } from '$lib/script/creation_state_controller';
    const { imageAddress, shortName, link, pricePerPixel, width, height } =
        creationStateController;

        
</script>

<svelte:head>
    <meta name="description" content="CreateImage" />
</svelte:head>

<ConnectionStatusLine title="Create Your Image">
    <StandardForm>
        <StandardInput
            bind:value={$userAccount}
            placeholder={$userAccount}
            id="userAccount"
            label="User Account:"
            readonly
        />

        <!-- <StandardInput
            bind:value={$imageAddress}
            placeholder={$imageAddress}
            id="imageAccount"
            label="Image address:"
        /> -->

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
    </StandardForm>
</ConnectionStatusLine>
