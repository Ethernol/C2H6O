import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type Contract from 'web3-eth-contract';

class AppStateController {
    constructor(
        public userAccount: Writable<string> = writable(''),
        public fanImageContractInstance: Writable<Contract> = writable(
            null as unknown as Contract
        ),
        public ethernolContractInstance: Writable<Contract> = writable(
            null as unknown as Contract
        )

    ) {}
}

export const appStateController = new AppStateController();
