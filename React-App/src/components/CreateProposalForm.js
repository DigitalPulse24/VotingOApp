import React, { useState } from 'react';
import { createProposal } from '../contracts/writeContract';
import { Button, Container, Form } from 'react-bootstrap';
import { useGlobalState } from '../context/GlobalStateContext';

const CreateProposalForm = () => {
    const { contractAddress, signer, owner, sendEid } = useGlobalState();
    const [description, setDescription] = useState('');

    if (signer === null || owner !== signer.address) return '';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (description.trim()) {
            createProposal(contractAddress, signer, sendEid, description);
        }
    };

    return (
        <Container>
            <h2 className='mt-4 text-center'>Add Proposal</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Propsal description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter propsal description"
                        onChange={(desc) => setDescription(desc.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Create Proposal</Button>
            </Form>
        </Container>
    );
};

export default CreateProposalForm;