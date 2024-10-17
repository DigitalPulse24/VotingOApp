import { ethers } from 'ethers';
import VotingOApp from '../artifacts/VotingOApp.json';

export const getContractOwner = async (provider, contractAddress) => {
    try {
        const contract = new ethers.Contract(contractAddress, VotingOApp.abi, provider);
        const owner = await contract.owner();

        return owner;
    } catch (error) {
        console.error(error);
    }
}

export const quote = async (contract, eid, messageType, data, options) => {
    try {
        const quote = await contract.quote(eid, messageType, data, options);
        const ether = ethers.formatEther(quote[0]);

        return ether;
    } catch (error) {
        console.error(error);
    }
}

export const fetchProposals = async (provider, contractAddress, setProposals, setLoading) => {
    setLoading(true);
    try {
        const contract = new ethers.Contract(contractAddress, VotingOApp.abi, provider);
        const proposalCount = await contract.proposalCount();
        const fetchedProposals = [];

        for (let i = 1; i <= proposalCount; i++) {
            const proposal = await contract.proposals(i);
            fetchedProposals.push({
                id: i,
                description: ethers.decodeBytes32String(proposal.description),
                yesVotes: proposal.yesVotes.toString(),
                noVotes: proposal.noVotes.toString(),
                active: proposal.active,
            });
        }

        setProposals(fetchedProposals);
        setLoading(false);
    } catch (error) {
        console.error(error);
    }
};