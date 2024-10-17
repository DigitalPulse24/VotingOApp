import { ethers } from 'ethers';
import VotingOApp from '../artifacts/VotingOApp.json';
import { quote } from './readContract';

export const createProposal = async (contractAddress, signer, eid, description) => {
  const contract = new ethers.Contract(contractAddress, VotingOApp.abi, signer);
  const data = ethers.encodeBytes32String(description);
  const options = await contract.generateOptions(200000, 0);

  const payableAmount = await quote(contract, eid, 1, data, options);

  console.log(payableAmount);

  if (!payableAmount) throw new Error('Invalid payable amount.');

  const tx = await contract.addProposal(
    eid,
    ethers.encodeBytes32String(description),
    options,
    { value: ethers.parseEther(payableAmount) }
  );

  await tx.wait();

  window.location.reload();
};

export const voteProposal = async (contractAddress, signer, eid, proposalId, vote) => {
  const contract = new ethers.Contract(contractAddress, VotingOApp.abi, signer);
  const coder = ethers.AbiCoder.defaultAbiCoder();
  const data = coder.encode(['uint', 'bool'], [proposalId, vote]);
  const options = await contract.generateOptions(200000, 0);

  const payableAmount = await quote(contract, eid, 2, data, options);

  if (!payableAmount) throw new Error('Invalid payable amount.');

  const tx = await contract.voteProposal(
    eid,
    proposalId,
    vote,
    options,
    { value: ethers.parseEther(payableAmount) }
  );

  await tx.wait();

  window.location.reload();
};

export const closeProposal = async (contractAddress, signer, eid, proposalId) => {
  const contract = new ethers.Contract(contractAddress, VotingOApp.abi, signer);
  const coder = ethers.AbiCoder.defaultAbiCoder();
  const data = coder.encode(['uint'], [proposalId]);
  const options = await contract.generateOptions(200000, 0);

  const payableAmount = await quote(contract, eid, 3, data, options);

  if (!payableAmount) throw new Error('Invalid payable amount.');

  const tx = await contract.closeProposal(
    eid,
    proposalId,
    options,
    { value: ethers.parseEther(payableAmount) }
  );

  await tx.wait();

  window.location.reload();
};