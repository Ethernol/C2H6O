export const ethernolContractABI = [
  {
    "inputs": [],
    "stateMutability": "payable",
    "type": "constructor",
  },
  {
    "stateMutability": "payable",
    "type": "fallback",
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "width",
        "type": "uint16",
      },
      {
        "internalType": "uint16",
        "name": "height",
        "type": "uint16",
      },
      {
        "internalType": "uint64",
        "name": "goal_value_wei",
        "type": "uint64",
      },
    ],
    "name": "createFanImage",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address",
      },
    ],
    "name": "getImages",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "supported",
        "type": "address",
      },
    ],
    "name": "sendDonation",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "stateMutability": "payable",
    "type": "receive",
  },
];
