import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { voteProposal, closeProposal } from '../contracts/writeContract';
import { useGlobalState } from '../context/GlobalStateContext';

const Proposal = ({ proposal }) => {
    const { contractAddress, signer, owner, sendEid } = useGlobalState();

    return (
        <Card className="mt-3">
            <Card.Header as="h5" className='text-center'>{proposal.description}</Card.Header>
            <Card.Body className='d-grid gap-2'>
                <Card.Text>Yes Votes: {proposal.yesVotes}</Card.Text>
                <Card.Text>No Votes: {proposal.noVotes}</Card.Text>
                <Button
                    variant="success"
                    disabled={!proposal.active}
                    onClick={() => voteProposal(contractAddress, signer, sendEid, proposal.id, true)}>
                    Yes
                </Button>
                <Button
                    variant="danger"
                    disabled={!proposal.active}
                    onClick={() => voteProposal(contractAddress, signer, sendEid, proposal.id, false)}>
                    No
                </Button>
                {(signer !== null && (signer.address === owner)) && (
                    <Button
                        variant="primary"
                        disabled={!proposal.active}
                        onClick={() => closeProposal(contractAddress, signer, sendEid, proposal.id)}>
                        Close
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
};

export default Proposal;