import { fanImageContractABI as ABI } from '$lib/constants/fan_image_abi.js';
import type { AbiItem } from 'web3-utils';
const smartContractAddress: string =
    '0x472eCED37080fbCcb2332562f69B13e6d1c658cA';
const emptyColor: string = '#FFFFFF55';
const fanImageContractABI = ABI as unknown as AbiItem[];
export { smartContractAddress, emptyColor, fanImageContractABI };
