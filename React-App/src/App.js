import React from 'react';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import NetworkStatusBar from './components/NetworkStatusBar';
import ProposalList from './components/ProposalList';
import CreateProposalForm from './components/CreateProposalForm';
import { GlobalStateProvider } from './context/GlobalStateContext';

function App() {
  return (
    <GlobalStateProvider>
      <Container>
        <NetworkStatusBar />
        <ProposalList />
        <CreateProposalForm />
      </Container>
    </GlobalStateProvider>
  );
}

export default App;