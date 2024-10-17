import { ethers } from 'ethers';
import { getNetworkConfig } from './networkConfig';
import { getContractOwner } from './readContract';

export const initializeProvider = async (setProvider, setSigner, setAccount, setNetwork, setContractAddress, setSendEid, setOwner) => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);

      const newSigner = await newProvider.getSigner();
      setSigner(newSigner);

      const address = await newSigner.getAddress();
      setAccount(address);

      const network = await newProvider.getNetwork();
      setNetwork(network.name);

      const networkConfig = getNetworkConfig(network.chainId);
      if (networkConfig) {
        setContractAddress(networkConfig.contractAddress);
        setSendEid(networkConfig.send_eid);
      }

      const owner = await getContractOwner(newProvider, networkConfig.contractAddress);
      setOwner(owner);
    } catch (error) {
      console.error(error);
    }
  }
};

export const handleNetworkSwitch = (networkId, provider, setContractAddress, setSendEid) => {
  const networkConfig = getNetworkConfig(networkId);
  if (networkConfig) {
    setContractAddress(networkConfig.contractAddress);
    setSendEid(networkConfig.send_eid);
    switchNetwork(networkId, provider);
  }
};

export const switchNetwork = async (networkId, provider) => {
  const networkConfig = getNetworkConfig(networkId);

  if (provider && networkConfig) {
    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: networkConfig.chainId },
      ]);
      window.location.reload();
    } catch (error) {
      if (error.code === 4902) {
        try {
          await provider.send('wallet_addEthereumChain', networkConfig);
        } catch (error) {
          console.error('Failed to add new network:', error);
        }
      } else {
        console.error('Error switching networks:', error);
      }
    }
  }
};