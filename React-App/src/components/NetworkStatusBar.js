import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { handleNetworkSwitch } from '../contracts/networkHelpers';
import { useGlobalState } from '../context/GlobalStateContext';

const formatAccount = (address) => {
  if (!address) return '';
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
};

const NetworkStatusBar = () => {
  const { account, provider, network, setContractAddress, setSendEid } = useGlobalState();

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Voting OApp</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Dropdown onSelect={(networkId) => handleNetworkSwitch(networkId, provider, setContractAddress, setSendEid)}>
          {network ? network : ''}
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {account ? formatAccount(account) : 'Connect'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="11155111">Sepolia</Dropdown.Item>
              <Dropdown.Item eventKey="80002">Amoy</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NetworkStatusBar;