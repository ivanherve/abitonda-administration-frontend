import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { ENDPOINT, getAuthRequest } from "../../links/links";
import ReactExport from "react-data-export";
import ExcelFile from "react-data-export/dist/ExcelPlugin/components/ExcelFile";
import ExcelSheet from "react-data-export/dist/ExcelPlugin/elements/ExcelSheet";

let arr = [];
export default function DocsToPrint(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const COL_SIZE = 3;
  const [type, setType] = useState("");
  const [classe, setClasse] = useState("");
  const [description, setDescription] = useState("");
  const [copies, setCopies] = useState("");
  const [pages, setPages] = useState(0);
  const [copiesPages, setCopiesPages] = useState(0);
  const [color, setColor] = useState(false);
  const [frontBack, setFrontBack] = useState(false);
  const [classes, setClasses] = useState([]);
  const [totalColor, setTotalColor] = useState(0);
  const [totalBW, setTotalBW] = useState(0);
  const [priceBW, setPriceBW] = useState(0);
  const [priceColor, setPriceColor] = useState(0);
  const [docsToExport, setDocsToExport] = useState([]);
  const [docs, setDocs] = useState([
    {
      date: "",
      type: "",
      classe: "",
      description: "",
      copies: 0,
      pages: 0,
      copiesPages: copies * pages,
      color: false,
      frontBack: false,
    },
  ]);

  const BORDER_STYLE = "thin";
  const COLOR_SPEC = "black";

  const HEADER_CELLS = {
    style: {
      font: {
        bold: true,
      },
      border: {
        top: { style: BORDER_STYLE, color: COLOR_SPEC },
        bottom: { style: BORDER_STYLE, color: COLOR_SPEC },
        left: { style: BORDER_STYLE, color: COLOR_SPEC },
        right: { style: BORDER_STYLE, color: COLOR_SPEC },
      },
    },
  };

  const BODY_CELLS = {
    style: {
      border: {
        top: { style: BORDER_STYLE, color: COLOR_SPEC },
        bottom: { style: BORDER_STYLE, color: COLOR_SPEC },
        left: { style: BORDER_STYLE, color: COLOR_SPEC },
        right: { style: BORDER_STYLE, color: COLOR_SPEC },
      },
    },
  };

  const getClasses = () => {
    fetch(ENDPOINT("classes"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setClasses([{ Name: "" }, ...r.response]);
      });
  };

  useEffect(() => {
    getClasses();
  }, []);

  useEffect(() => {
    setCopiesPages(copies * pages);
  }, [copies, pages]);

  useEffect(() => {
    setDocsToExport([
      {
        columns: [
          {
            title: "Date",
            width: { wpx: 40 },
            ...HEADER_CELLS,
          },
          {
            title: "Type",
            width: { wpx: 150 },
            ...HEADER_CELLS,
          },
          {
            title: "Classe",
            width: { wpx: 150 },
            ...HEADER_CELLS,
          },
          {
            title: "Description",
            width: { wpx: 125 },
            ...HEADER_CELLS,
          },
          {
            title: "Copies",
            width: { wpx: 125 },
            ...HEADER_CELLS,
          },
          {
            title: "Pages",
            width: { wpx: 125 },
            ...HEADER_CELLS,
          },
          {
            title: "Pages imprimé",
            width: { wpx: 125 },
            ...HEADER_CELLS,
          },
          {
            title: "Couleur",
            width: { wpx: 125 },
            ...HEADER_CELLS,
          },
          {
            title: "Recto/verso",
            width: { wpx: 125 },
            ...HEADER_CELLS,
          },
        ],
        data: docs.map((d) => [
          {
            value: d.date,
            ...BODY_CELLS,
          },
          {
            value: d.type,
            ...BODY_CELLS,
          },
          {
            value: d.classe,
            ...BODY_CELLS,
          },
          {
            value: d.description,
            ...BODY_CELLS,
          },
          {
            value: d.copies,
            ...BODY_CELLS,
          },
          {
            value: d.pages,
            ...BODY_CELLS,
          },
          {
            value: d.copiesPages,
            ...BODY_CELLS,
          },
          {
            value: d.color,
            ...BODY_CELLS,
          },
          {
            value: d.frontBack,
            ...BODY_CELLS,
          },
        ]),
      },
    ]);
  }, [docs]);

  const addDoc = () => {
    arr.push({
      date: moment().format("MM-DD"),
      type,
      classe,
      description,
      copies,
      pages,
      copiesPages,
      color: color ? "Oui" : "Non",
      frontBack: frontBack ? "Recto/Verso" : "Recto",
    });
    setDocs([...arr]);
    if (color) setTotalColor(totalColor + copies * pages);
    else setTotalBW(totalBW + copies * pages);

    setPriceBW(totalBW * 30.09);
    setPriceColor(totalColor * 94);
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Générer une liste de document à imprimer</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col xs={COL_SIZE}>
            <Form>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setType(e.target.value)}
                >
                  <option></option>
                  <option>Affiches</option>
                  <option>Devoir</option>
                  <option>Evaluation</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Classe</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setClasse(e.target.value)}
                >
                  {classes.map((c) => (
                    <option key={classes.indexOf(c)}>{c.Name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Copies</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  onChange={(e) => setCopies(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Pages</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  onChange={(e) => setPages(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Pages imprimé</Form.Label>
                <Form.Control
                  type="number"
                  disabled
                  placeholder={copiesPages}
                  min="0"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Couleur</Form.Label>
                <Form.Check
                  type="checkbox"
                  onChange={(e) => setColor(e.target.checked)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Recto / Verso</Form.Label>
                <Form.Check
                  type="checkbox"
                  onChange={(e) => setFrontBack(e.target.checked)}
                />
              </Form.Group>
              <Button onClick={() => addDoc()}>Enregistrer</Button>
            </Form>
          </Col>
          <Col xs={12 - COL_SIZE}>
            <Table>
              <thead>
                <tr>
                  <th style={styles.td}>Date</th>
                  <th style={styles.td}>Type</th>
                  <th style={styles.td}>Classe</th>
                  <th style={styles.td}>Description</th>
                  <th style={styles.td}>Copies</th>
                  <th style={styles.td}>Pages</th>
                  <th style={styles.td}>Pages imprimé</th>
                  <th style={styles.td}>Couleur</th>
                  <th style={styles.td}>Recto/Verso</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={docs.indexOf(d)}>
                    <td style={styles.td}>{d.date}</td>
                    <td style={styles.td}>{d.type}</td>
                    <td style={styles.td}>{d.classe}</td>
                    <td style={styles.td}>{d.description}</td>
                    <td style={styles.td}>{d.copies}</td>
                    <td style={styles.td}>{d.pages}</td>
                    <td style={styles.td}>{d.copiesPages}</td>
                    <td style={styles.td}>{d.color}</td>
                    <td style={styles.td}>{d.frontBack}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr />
            <Table>
              <tbody>
                <tr>
                  <th>Total B/W</th>
                  <td>{totalBW}</td>
                  <td>{priceBW} RWF</td>
                </tr>
                <tr>
                  <th>Total Couleur</th>
                  <td>{totalColor}</td>
                  <td>{priceColor} RWF</td>
                </tr>
                <tr>
                  <th>TOTAL</th>
                  <td>{totalColor + totalBW}</td>
                  <td>{priceBW + priceColor} RWF</td>
                </tr>
              </tbody>
            </Table>
            <ExcelFile
              element={<Button variant="outline-success">Exporter</Button>}
            >
              <ExcelSheet dataSet={docsToExport} />
            </ExcelFile>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

const styles = {
  td: {
    fontSize: "0.8em",
  },
};
