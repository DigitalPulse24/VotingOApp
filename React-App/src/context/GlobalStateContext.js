import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeProvider } from '../contracts/networkHelpers';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [sendEid, setSendEid] = useState(null);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    initializeProvider(setProvider, setSigner, setAccount, setNetwork, setContractAddress, setSendEid, setOwner);
  }, []);

  return (
    <GlobalStateContext.Provider value={{
      provider, setProvider,
      signer, setSigner,
      account, setAccount,
      network, setNetwork,
      contractAddress, setContractAddress,
      sendEid, setSendEid,
      owner, setOwner
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);