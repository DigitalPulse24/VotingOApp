import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Proposal from './Proposal';
import { useGlobalState } from '../context/GlobalStateContext';
import { Col, Row } from 'react-bootstrap';
import { fetchProposals } from '../contracts/readContract';

const ProposalList = () => {
  const { provider, contractAddress } = useGlobalState();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProposals = async () => {
      await fetchProposals(provider, contractAddress, setProposals, setLoading);
    };

    if (provider && contractAddress) {
      loadProposals();
    }
  }, [provider, contractAddress]);

  if (loading) return <p>Loading proposals...</p>;

  return (
    <Container>
      <h2 className='mt-3 text-center'>Proposal List</h2>
      <Row>
        {proposals.map(proposal => (
          <Col key={proposal.id} md={6}>
            <Proposal key={proposal.id} proposal={proposal} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProposalList;