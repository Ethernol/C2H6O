import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type Contract from 'web3-eth-contract';
import Web3 from 'web3';
class CanvasStateController {
    constructor(
        public web3: Writable<Web3> = writable(new Web3()),
        public imageAddress: Writable<string> = writable(''),
        public canvasWidth: Writable<number> = writable(0),
        public canvasHeight: Writable<number> = writable(0),
        public cellPixelLength: Writable<number> = writable(0),
        public initialImage: Writable<number[][]> = writable([]),
        public ready: Writable<boolean> = writable(false),
        public loaded: Writable<boolean> = writable(false),
        public colorInput: Writable<string> = writable('#000000'),
        public toggleGuide: Writable<boolean> = writable(false),
        public remover: Writable<boolean> = writable(false),

        public canvas: Writable<HTMLCanvasElement> = writable(
            null as unknown as HTMLCanvasElement
        ),
        public guide: Writable<HTMLElement> = writable(
            null as unknown as HTMLElement
        ),
        public drawingContext: Writable<CanvasRenderingContext2D> = writable(
            null as unknown as CanvasRenderingContext2D
        ),
        public fanImageContractInstance: Writable<Contract> = writable(
            null as unknown as Contract
        ),

        public changedPixels: Writable<{ [key: string]: any }> = writable({})
    ) {}
}
export const canvasStateController = new CanvasStateController();
