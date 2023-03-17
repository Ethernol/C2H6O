export const fanImageContractABI = 
[
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "width",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "height",
				"type": "uint16"
			},
			{
				"internalType": "uint64",
				"name": "goal_value_wei",
				"type": "uint64"
			}
		],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "new_owner",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getImage",
		"outputs": [
			{
				"internalType": "uint256[][]",
				"name": "",
				"type": "uint256[][]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPricePerPixel",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "amount",
				"type": "uint32"
			},
			{
				"internalType": "uint16[]",
				"name": "x",
				"type": "uint16[]"
			},
			{
				"internalType": "uint16[]",
				"name": "y",
				"type": "uint16[]"
			},
			{
				"internalType": "uint256[]",
				"name": "color",
				"type": "uint256[]"
			}
		],
		"name": "paintPixels",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]