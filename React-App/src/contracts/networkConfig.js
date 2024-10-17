export const networkConfig = {
  11155111: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia',
    rpcUrls: ['https://rpc2.sepolia.org'],
    contractAddress: '0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    send_eid: 40267,
  },
  80002: {
    chainId: '0x13882',
    chainName: 'Amoy',
    rpcUrls: ['https://polygon-amoy-bor-rpc.publicnode.com'],
    contractAddress: '0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    send_eid: 40161,
  },
};

export const getNetworkConfig = (networkId) => networkConfig[networkId];