export const ethernolContractABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'image_address',
                type: 'address'
            }
        ],
        name: 'GiveImageAddress',
        type: 'event'
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: 'width',
                type: 'uint16'
            },
            {
                internalType: 'uint16',
                name: 'height',
                type: 'uint16'
            },
            {
                internalType: 'uint64',
                name: 'price_per_pixel',
                type: 'uint64'
            }
        ],
        name: 'createFanImage',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [],
        stateMutability: 'payable',
        type: 'constructor'
    },
    {
        stateMutability: 'payable',
        type: 'fallback'
    },
    {
        stateMutability: 'payable',
        type: 'receive'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address'
            }
        ],
        name: 'getImages',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
