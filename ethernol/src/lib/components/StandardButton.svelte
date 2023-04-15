<script lang="ts">
    import { copy } from 'svelte-copy';

    import { ethernolDBService } from '$lib/script/services/ethernol_db_service';

    import { creationStateController } from '$lib/script/creation_state_controller';
    const { imageAddress, link, pricePerPixel, width, height } =
        creationStateController;

    import { appStateController } from '$lib/script/app_state_controller';
    const { userAccount, ethernolContractInstance } = appStateController;

    import { ethernolContractABI } from '$lib/constants/ethernol_abi.js';

    const contractAddress = '0xF639ba57fBC29a7C2D629eEbF8a001f4FB2eC5EB';

    import Web3 from 'web3';

    import type { AbiItem } from 'web3-utils';

    let web3: Web3;

    // import { canvasStateController } from '$lib/script/canvas_state_controller';
    // const { fanImageContractInstance, changedPixels } = canvasStateController;

    export let label = '';
    export let content = '';
    export let toggleHandle = '';

    async function getEthernol() {
        web3 = new Web3(window.ethereum);
        $ethernolContractInstance = new web3.eth.Contract(
            ethernolContractABI as unknown as AbiItem[],
            contractAddress
        );

        const result = await $ethernolContractInstance.methods
            .createFanImage($width, $height, $pricePerPixel)
            .send({ from: $userAccount, value: 5000000000000000 });

        $imageAddress = result.events.GiveImageAddress.returnValues.image_address;
    }

    async function createLink() {
        let base_link = window.location.href;
        base_link = base_link.replace('create', 'contribute') + '?target=';
        await getEthernol();
        $link = base_link + $imageAddress;
        // $shortName === ''
        //     ? base_link + $imageAddress
        //     : base_link + $shortName;
        ethernolDBService.createNewImage(
            $imageAddress,
            $imageAddress,
            $userAccount
        );
    }

    // async function paintPixels() {
    //     let amount = Object.keys(changedPixels).length;
    //     let xs = Object.keys(changedPixels).map((key) => key.split(',')[0]);
    //     let ys = Object.keys(changedPixels).map((key) => key.split(',')[1]);
    //     let colors = Object.keys(changedPixels).map(
    //         (key: string) => $changedPixels[key]
    //     );
    //     $fanImageContractInstance.methods
    //         .paintPixels(amount, xs, ys, colors)
    //         .send({ from: userAccount, value: amount * $pricePerPixel });
    // }

    let handleClick: { (): Promise<void>; (): Promise<void>; (): void };
    if (toggleHandle === 'createLink') handleClick = createLink;
    // else if (toggleHandle === 'paintPixels') handleClick = paintPixels;
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
