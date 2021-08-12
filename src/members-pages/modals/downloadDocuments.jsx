import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faDownload,
  faFileExcel,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { Button, Col, ListGroup, Modal, Row } from "react-bootstrap";
import { ENDPOINT, getAuthRequest } from "../../links/links";
import ReactExport from "react-data-export";
import { useEffect, useState } from "react";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

library.add(faFileWord, faFileExcel, faDownload);

export default function DownloadDocuments(props) {
  const [sorasDataSet, setSorasDataSet] = useState([]);
  const [canteenDataSet, setCanteenDataSet] = useState([]);
  const [transportDataSet, setTransportDataSet] = useState([]);
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

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

  const BODY_CELLS_NEW_STUDENTS = {
    style: {
      border: {
        top: { style: BORDER_STYLE, color: COLOR_SPEC },
        bottom: { style: BORDER_STYLE, color: COLOR_SPEC },
        left: { style: BORDER_STYLE, color: COLOR_SPEC },
        right: { style: BORDER_STYLE, color: COLOR_SPEC },
      },
      fill: {
        fgColor: { rgb: "fff700" },
      },
    },
  };

  const exportSoras = () => {
    fetch(ENDPOINT("soras"), getAuthRequest(token))
      .then((r) => r.json())
      .then((res) => {
        setSorasDataSet([
          {
            columns: [
              {
                title: "No",
                width: { wpx: 40 },
                ...HEADER_CELLS,
              },
              {
                title: "PRÉNOMS",
                width: { wpx: 150 },
                ...HEADER_CELLS,
              },
              {
                title: "NOMS",
                width: { wpx: 150 },
                ...HEADER_CELLS,
              },
              {
                title: "DATE DE NAISSANCE",
                width: { wpx: 125 },
                ...HEADER_CELLS,
              },
              {
                title: "CLASSE",
                width: { wpx: 50 },
                ...HEADER_CELLS,
              },
            ],
            data: res.response.map((r) => {
              if (r.NewStudent)
                return [
                  {
                    value: res.response.indexOf(r) + 1,
                    ...BODY_CELLS_NEW_STUDENTS,
                  },
                  {
                    value: r.Firstname,
                    ...BODY_CELLS_NEW_STUDENTS,
                  },
                  {
                    value: r.Lastname,
                    ...BODY_CELLS_NEW_STUDENTS,
                  },
                  {
                    value: moment(r.Birthdate).format("DD/MM/YYYY"),
                    ...BODY_CELLS_NEW_STUDENTS,
                  },
                  {
                    value: r.Classe,
                    ...BODY_CELLS_NEW_STUDENTS,
                  },
                ];
              else
                return [
                  {
                    value: res.response.indexOf(r) + 1,
                    ...BODY_CELLS,
                  },
                  {
                    value: r.Firstname,
                    ...BODY_CELLS,
                  },
                  {
                    value: r.Lastname,
                    ...BODY_CELLS,
                  },
                  {
                    value: moment(r.Birthdate).format("DD/MM/YYYY"),
                    ...BODY_CELLS,
                  },
                  {
                    value: r.Classe,
                    ...BODY_CELLS,
                  },
                ];
            }),
          },
        ]);
      });
  };

  var dt = new Date();
  var month = dt.getMonth();
  var year = dt.getFullYear();
  var daysInMonth = new Date(year, month, 0).getDate();
  var days = [];
  var isPresent = [];
  for (let i = 0; i < daysInMonth; i++) {
    days.push({
      title: `${i + 1}`,
      width: { wpx: 20 },
      ...HEADER_CELLS,
    });
  }
  for (let i = 0; i < daysInMonth; i++) {
    isPresent.push({
      value: "",
      ...BODY_CELLS,
    });
  }

  const exportCanteen = () => {
    fetch(ENDPOINT("soras"), getAuthRequest(token))
      .then((r) => r.json())
      .then((res) => {
        setCanteenDataSet([
          {
            columns: [
              {
                title: "No",
                width: { wpx: 40 },
                ...HEADER_CELLS,
              },
              {
                title: "PRÉNOMS",
                width: { wpx: 150 },
                ...HEADER_CELLS,
              },
              {
                title: "NOMS",
                width: { wpx: 150 },
                ...HEADER_CELLS,
              },
              {
                title: "DATE DE NAISSANCE",
                width: { wpx: 125 },
                ...HEADER_CELLS,
              },
              ...days,
            ],
            data: res.response.map((r) => [
              {
                value: res.response.indexOf(r) + 1,
                ...BODY_CELLS,
              },
              {
                value: r.Firstname,
                ...BODY_CELLS,
              },
              {
                value: r.Lastname,
                ...BODY_CELLS,
              },
              {
                value: moment(r.Birthdate).format("DD/MM/YYYY"),
                ...BODY_CELLS,
              },
              ...isPresent,
            ]),
          },
        ]);
      });
  };

  const exportTransport = () => {
    fetch(ENDPOINT("transport"), getAuthRequest(token))
      .then((r) => r.json())
      .then((res) => {
        setTransportDataSet([
          {
            columns: [
              {
                title: "No",
                width: { wpx: 40 },
                ...HEADER_CELLS,
              },
              {
                title: "PRÉNOMS",
                width: { wpx: 150 },
                ...HEADER_CELLS,
              },
              {
                title: "NOMS",
                width: { wpx: 150 },
                ...HEADER_CELLS,
              },
              {
                title: "DATE DE NAISSANCE",
                width: { wpx: 125 },
                ...HEADER_CELLS,
              },
              ...days,
            ],
            data: res.response.map((r) => [
              {
                value: res.response.indexOf(r) + 1,
                ...BODY_CELLS,
              },
              {
                value: r.Firstname,
                ...BODY_CELLS,
              },
              {
                value: r.Lastname,
                ...BODY_CELLS,
              },
              {
                value: moment(r.Birthdate).format("DD/MM/YYYY"),
                ...BODY_CELLS,
              },
              ...isPresent,
            ]),
          },
        ]);
      });
  };

  useEffect(() => {
    exportTransport();
    exportCanteen();
    exportSoras();
  }, []);

  return (
    <Modal centered show={props.show} onHide={props.hide}>
      <Modal.Header closeButton>
        <Modal.Title>Documents à télécharger</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Row>
              <Col xs="9">Liste SORAS</Col>
              <Col xs="3">
                <ExcelFile
                  filename="Liste de SORAS"
                  element={
                    <Button variant="light">
                      <FontAwesomeIcon icon={["fas", "download"]} />
                    </Button>
                  }
                >
                  <ExcelSheet
                    dataSet={sorasDataSet}
                    name="Liste de SORAS 2021"
                  />
                </ExcelFile>
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col xs="9">Liste de Cantine</Col>
              <Col xs="3">
                <ExcelFile
                  filename="Liste de Cantine"
                  element={
                    <Button variant="light">
                      <FontAwesomeIcon icon={["fas", "download"]} />
                    </Button>
                  }
                >
                  <ExcelSheet
                    dataSet={canteenDataSet}
                    name="Liste de Cantine 2021"
                  />
                </ExcelFile>
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col xs="9">Liste de Transport</Col>
              <Col xs="3">
                <ExcelFile
                  filename="Liste de Transport"
                  element={
                    <Button variant="light">
                      <FontAwesomeIcon icon={["fas", "download"]} />
                    </Button>
                  }
                >
                  <ExcelSheet
                    dataSet={transportDataSet}
                    name="Liste de Transport 2021"
                  />
                </ExcelFile>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
}
