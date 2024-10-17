// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OApp, MessagingFee, Origin } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { MessagingReceipt } from "@layerzerolabs/oapp-evm/contracts/oapp/OAppSender.sol";
import { OptionsBuilder } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";

import "./libs/MsgCodec.sol";

contract VotingOApp is OApp {
    constructor(address _endpoint, address _delegate) OApp(_endpoint, _delegate) Ownable(_delegate) {}

    struct Proposal {
        bytes32 description;
        uint256 yesVotes;
        uint256 noVotes;
        bool active;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalAdded(uint256 id, bytes32 description);
    event ProposalClosed(uint256 id);
    event Voted(uint256 proposalId, address voter, bool vote);

    function addProposal(uint32 _eid, bytes32 description, bytes calldata _options) external payable onlyOwner {
        proposalCount++;
        proposals[proposalCount] = Proposal(description, 0, 0, true);

        bytes memory payload = MsgCodec.encodeProposalAdded(description);
        _lzSend(_eid, payload, _options, MessagingFee(msg.value, 0), payable(msg.sender));

        emit ProposalAdded(proposalCount, description);
    }

    function closeProposal(uint32 _eid, uint256 proposalId, bytes calldata _options) external payable onlyOwner {
        require(proposals[proposalId].active, "Proposal does not exist or is already closed");

        proposals[proposalId].active = false;

        bytes memory payload = MsgCodec.encodeProposalClosed(proposalId);
        _lzSend(_eid, payload, _options, MessagingFee(msg.value, 0), payable(msg.sender));

        emit ProposalClosed(proposalId);
    }

    function voteProposal(uint32 _eid, uint256 proposalId, bool vote, bytes calldata _options) external payable {
        require(proposals[proposalId].active, "Proposal does not exist or voting for this proposal has ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        hasVoted[proposalId][msg.sender] = true;

        if (vote) {
            proposals[proposalId].yesVotes++;
        }
        else {
            proposals[proposalId].noVotes++;
        }

        bytes memory payload = MsgCodec.encodeVoted(msg.sender, proposalId, vote);
        _lzSend(_eid, payload, _options, MessagingFee(msg.value, 0), payable(msg.sender));

        emit Voted(proposalId, msg.sender, vote);
    }

    function generateOptions(
        uint128 gas,
        uint128 value
    ) public view returns (bytes memory) {
        bytes memory options = OptionsBuilder.newOptions();
        options = OptionsBuilder.addExecutorLzReceiveOption(options, gas, value);

        return options;
    }

    function quote(
        uint32 _eid,
        uint8 messageType,
        bytes calldata data,
        bytes calldata _options
    ) public view returns (uint256 nativeFee, uint256 lzTokenFee) {
        bytes memory payload = abi.encode(messageType, data);

        MessagingFee memory fee = _quote(_eid, payload, _options, false);
        return (fee.nativeFee, fee.lzTokenFee);
    }

    function _lzReceive(
        Origin calldata /*_origin*/,
        bytes32 /*_guid*/,
        bytes calldata payload,
        address /*_executor*/,
        bytes calldata /*_extraData*/
    ) internal override {
        (uint8 messageType) = MsgCodec.decodeMessageType(payload);

        if (messageType == uint8(MsgCodec.PROPOSAL_ADDED_TYPE)) {
            handleProposalAdded(payload);
        } else if (messageType == uint8(MsgCodec.PROPOSAL_CLOSED_TYPE)) {
            handleProposalClosed(payload);
        } else if (messageType == uint8(MsgCodec.VOTED_TYPE)) {
            handleVote(payload);
        } else {
            revert("Unknown message type");
        }
    }

    function handleProposalAdded(bytes calldata payload) internal {
        (bytes32 description) = MsgCodec.decodeProposalAdded(payload);
        proposalCount++;
        proposals[proposalCount] = Proposal(description, 0, 0, true);

        emit ProposalAdded(proposalCount, description);
    }

    function handleProposalClosed(bytes calldata payload) internal {
        uint256 proposalId = MsgCodec.decodeProposalClosed(payload);
        require(proposals[proposalId].active, "Proposal does not exist or is already closed");

        proposals[proposalId].active = false;

        emit ProposalClosed(proposalId);
    }

    function handleVote(bytes calldata payload) internal {
        (address sender, uint256 proposalId, bool vote) = MsgCodec.decodeVoted(payload);
        require(!hasVoted[proposalId][sender], "Already voted on another chain");
        require(proposals[proposalId].active, "Voting for this proposal has ended");

        hasVoted[proposalId][sender] = true;

        if (vote) {
            proposals[proposalId].yesVotes++;
        } else {
            proposals[proposalId].noVotes++;
        }

        emit Voted(proposalId, sender, vote);
    }
}