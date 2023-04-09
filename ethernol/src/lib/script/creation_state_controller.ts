import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

class CreationStateController {
    constructor(
        public shortName: Writable<string> = writable(''),
        public link: Writable<string> = writable(''),
        public pricePerPixel: Writable<number> = writable(100000000),
        public width: Writable<number> = writable(10),
        public height: Writable<number> = writable(10),
    ) {}
}

export const creationStateController = new CreationStateController();
