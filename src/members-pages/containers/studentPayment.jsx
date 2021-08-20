import { useState } from "react";
import {
  Button,
  Col,
  Nav,
  OverlayTrigger,
  ProgressBar,
  Row,
  Tab,
  Table,
  Tooltip,
} from "react-bootstrap";

export default function Payment(props) {
  return (
    <div>
      <Tab.Container id="left-tabs-example" defaultActiveKey="minerval">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="minerval">Minervale</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="material">Matériel scolaire</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="uniform">Uniforme</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="minerval">
                <Minerval />
              </Tab.Pane>
              <Tab.Pane eventKey="material">
                <Material />
              </Tab.Pane>
              <Tab.Pane eventKey="uniform">
                <Material />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

function Minerval(props) {
  const [filtred, setFiltred] = useState(false);
  let element = [
    { trimestre: "1er Trimestre 2020-2021", paid: 250000 },
    { trimestre: "2nd Trimestre 2020-2021", paid: 200000 },
    { trimestre: "3ème Trimestre 2020-2021", paid: 50000 },
    { trimestre: "1er Trimestre 2019-2020", paid: 300000 },
    { trimestre: "2nd Trimestre 2019-2020", paid: 300000 },
    { trimestre: "3ème Trimestre 2019-2020", paid: 300000 },
    { trimestre: "3ème Trimestre 2018-2019", paid: 290000 },
  ];
  const [elList, setElList] = useState(element);
  const paidMax = 300000;
  const toFilter = () => {
    setFiltred(true);
    setElList(
      elList.filter((el) => {
        return el.paid !== paidMax;
      })
    );
  };
  const toDisplay = () => {
    setFiltred(false);
    setElList(element);
  };
  return (
    <div>
      {filtred ? (
        <Button variant="outline-secondary" onClick={() => toDisplay()}>
          Tout afficher
        </Button>
      ) : (
        <Button variant="outline-info" onClick={() => toFilter()}>
          Filtrer les trimestres payé
        </Button>
      )}
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Trimestre</th>
            <th>Miverval (300.000 RWF)</th>
          </tr>
        </thead>
        <tbody>
          {elList.map((el) => (
            <tr key={elList.indexOf(el)}>
              <td>{el.trimestre}</td>
              <td>
                {formatRWF(el.paid)}
                <br />
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip>
                      Il reste {formatRWF(paidMax - el.paid)} à payer
                    </Tooltip>
                  }
                >
                  <ProgressBar
                    now={Math.round(pourcentage(el.paid, paidMax))}
                    animated
                    variant={variant(el.paid, paidMax)}
                    label={`${Math.round(pourcentage(el.paid, paidMax))}%`}
                  />
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function Material(props) {
  const paidMax = 300000;
  const element = [
    { academicYear: "2020-2021", paid: 250000 },
    { academicYear: "2019-2020", paid: 300000 },
  ];
  const [elList, setElList] = useState(element);
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Année académique</th>
          <th>Prix (30.000 RWF)</th>
        </tr>
      </thead>
      <tbody>
        {elList.map((el) => (
          <tr key={elList.indexOf(el)}>
            <td>{el.academicYear}</td>
            <td>
              {formatRWF(el.paid)}
              <br />
              <ProgressBar
                now={Math.round(pourcentage(el.paid, paidMax))}
                animated
                variant={variant(el.paid, paidMax)}
                label={`${Math.round(pourcentage(el.paid, paidMax))}%`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

const formatRWF = (num) => {
  return num.toLocaleString("da-DK", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
  });
};

const pourcentage = (amount, paidMax) => {
  return (amount / paidMax) * 100;
};

const variant = (element, paidMax) => {
  if (element < paidMax / 2) return "danger";
  else if (element >= paidMax / 2 && element < paidMax) return "warning";
  else return "success";
};
