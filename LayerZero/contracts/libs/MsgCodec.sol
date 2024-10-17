// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

library MsgCodec {
    uint8 internal constant PROPOSAL_ADDED_TYPE = 1;
    uint8 internal constant PROPOSAL_CLOSED_TYPE = 2;
    uint8 internal constant VOTED_TYPE = 3;

    function encodeProposalAdded(bytes32 _description) internal pure returns (bytes memory) {
        return abi.encode(PROPOSAL_ADDED_TYPE, _description);
    }

    function encodeProposalClosed(uint256 _proposalId) internal pure returns (bytes memory) {
        return abi.encode(PROPOSAL_CLOSED_TYPE, _proposalId);
    }

    function encodeVoted(address _voter, uint256 _proposalId, bool _vote) internal pure returns (bytes memory) {
        return abi.encode(VOTED_TYPE, _voter, _proposalId, _vote);
    }

    function decodeMessageType(bytes calldata _message) internal pure returns (uint8) {
        return abi.decode(_message, (uint8));
    }

    function decodeProposalAdded(bytes calldata _message) internal pure returns (bytes32) {
        return abi.decode(_message[32:], (bytes32));
    }

    function decodeProposalClosed(bytes calldata _message) internal pure returns (uint256) {
        return abi.decode(_message[32:], (uint256));
    }

    function decodeVoted(bytes calldata _message) internal pure returns (address, uint256, bool) {
        return abi.decode(_message[32:], (address, uint256, bool));
    }
}