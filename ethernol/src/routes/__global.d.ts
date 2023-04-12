// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import { MetaMaskInpageProvider} from "@metamask/providers";

declare global {
	interface Window {
		ethereum: MetaMaskInpageProvider;
	}
}
