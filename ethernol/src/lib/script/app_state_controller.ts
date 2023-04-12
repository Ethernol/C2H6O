import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

class AppStateController {
    constructor(public userAccount: Writable<string> = writable('')) {}
}

export const appStateController = new AppStateController();
