<script lang="ts">
    import { copy } from 'svelte-copy';

    import { creationStateController } from '$lib/script/creation_state_controller';
    const { shortName, link, pricePerPixel } = creationStateController;

    import { appStateController } from '$lib/script/app_state_controller';
    const { userAccount } = appStateController;

    import { canvasStateController } from '$lib/script/canvas_state_controller';
    const {
        fanImageContractInstance,
        changedPixels
    } = canvasStateController;

    export let label = '';
    export let content = '';
    export let toggleHandle = '';

    async function createLink() {
        let base_link = window.location.href;
        base_link = base_link.replace('receive', 'send') + '?target=';
        $link =
            $shortName === ''
                ? base_link + $userAccount
                : base_link + $shortName;
    }

    async function paintPixels() {
        let amount = Object.keys(changedPixels).length;
        let xs = Object.keys(changedPixels).map((key) => key.split(',')[0]);
        let ys = Object.keys(changedPixels).map((key) => key.split(',')[1]);
        let colors = Object.keys(changedPixels).map(
            (key: string) => $changedPixels[key]
        );
        $fanImageContractInstance.methods
            .paintPixels(amount, xs, ys, colors)
            .send({ from: userAccount, value: amount * $pricePerPixel });
    }

    let handleClick: { (): Promise<void>; (): Promise<void>; (): void };
    if (toggleHandle === 'paintPixels') handleClick = paintPixels;
    else if (toggleHandle === 'createLink') handleClick = createLink;
</script>

{#if content !== ''}
    <button
        class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-3 rounded mt-4"
        use:copy={content}
        >{label}
    </button>
{:else}
    <button
        class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-3 rounded mt-4"
        on:click={handleClick}
        >{label}
    </button>
{/if}
