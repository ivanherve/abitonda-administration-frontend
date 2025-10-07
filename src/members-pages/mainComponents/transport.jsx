import { Container, Tab, Tabs } from "react-bootstrap";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import BusLine from './buslines';
import Vehicule from './vehicules';

const Transport = () => {
    return (
        <Container>
            <Tabs defaultActiveKey="buslines" id="uncontrolled-tab-example" className="mb-3" fill variant="pills">
                <Tab eventKey="buslines" title="Lignes de bus">
                    <BusLine />
                </Tab>
                <Tab eventKey="bus" title="Véhicules">
                    <Vehicule />
                </Tab>
            </Tabs>
        </Container>
    );
}

export default Transport;