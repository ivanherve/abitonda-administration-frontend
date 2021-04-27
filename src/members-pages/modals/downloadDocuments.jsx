import { library } from "@fortawesome/fontawesome-svg-core";
import { faFileExcel, faFileWord } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { Button, Col, ListGroup, Modal, Row } from "react-bootstrap";
import { ENDPOINT, getAuthRequest } from "../../links/links";
import ReactExport from "react-data-export";
import { useEffect, useState } from "react";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

library.add(faFileWord, faFileExcel);

export default function DownloadDocuments(props) {
  const [dataSet, setDataSet] = useState([]);
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  const BORDER_STYLE = "thin";
  const COLOR_SPEC = "black";

  useEffect(() => {
    fetch(ENDPOINT("students"), getAuthRequest(token))
      .then((r) => r.json())
      .then((res) => {
        setDataSet([
          {
            columns: [
              {
                title: "No",
                width: { wpx: 40 },
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
              },
              {
                title: "PRÉNOMS",
                width: { wpx: 150 },
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
              },
              {
                title: "NOMS",
                width: { wpx: 150 },
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
              },
              {
                title: "DATE DE NAISSANCE",
                width: { wpx: 125 },
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
              },
              {
                title: "CLASSE",
                width: { wpx: 50 },
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
              },
            ],
            data: res.response.map((r) => [
              {
                value: res.response.indexOf(r) + 1,
                style: {
                  border: {
                    top: { style: BORDER_STYLE, color: COLOR_SPEC },
                    bottom: { style: BORDER_STYLE, color: COLOR_SPEC },
                    left: { style: BORDER_STYLE, color: COLOR_SPEC },
                    right: { style: BORDER_STYLE, color: COLOR_SPEC },
                  },
                },
              },
              {
                value: r.Firstname,
                style: {
                  border: {
                    top: { style: BORDER_STYLE, color: COLOR_SPEC },
                    bottom: { style: BORDER_STYLE, color: COLOR_SPEC },
                    left: { style: BORDER_STYLE, color: COLOR_SPEC },
                    right: { style: BORDER_STYLE, color: COLOR_SPEC },
                  },
                },
              },
              {
                value: r.Lastname,
                style: {
                  border: {
                    top: { style: BORDER_STYLE, color: COLOR_SPEC },
                    bottom: { style: BORDER_STYLE, color: COLOR_SPEC },
                    left: { style: BORDER_STYLE, color: COLOR_SPEC },
                    right: { style: BORDER_STYLE, color: COLOR_SPEC },
                  },
                },
              },
              {
                value: moment(r.Birthdate).format("DD/MM/YYYY"),
                style: {
                  border: {
                    top: { style: BORDER_STYLE, color: COLOR_SPEC },
                    bottom: { style: BORDER_STYLE, color: COLOR_SPEC },
                    left: { style: BORDER_STYLE, color: COLOR_SPEC },
                    right: { style: BORDER_STYLE, color: COLOR_SPEC },
                  },
                },
              },
              {
                value: r.Classe,
                style: {
                  border: {
                    top: { style: BORDER_STYLE, color: COLOR_SPEC },
                    bottom: { style: BORDER_STYLE, color: COLOR_SPEC },
                    left: { style: BORDER_STYLE, color: COLOR_SPEC },
                    right: { style: BORDER_STYLE, color: COLOR_SPEC },
                  },
                },
              },
            ]),
          },
        ]);
      });
  }, []);

  return (
    <Modal centered show={props.show} onHide={props.hide}>
      <Modal.Header closeButton>
        <Modal.Title>Documents à télécharger</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item variant="primary">
            <Row>
              <Col xs="9">
                <FontAwesomeIcon icon={["fas", "file-word"]} /> Liste SORAS
              </Col>
              <Col xs="3">
                <ExcelFile
                  filename="Liste de SORAS"
                  element={<Button>Exporter</Button>}
                >
                  <ExcelSheet dataSet={dataSet} name="Liste de SORAS 2021" />
                </ExcelFile>
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item variant="success" action>
            <FontAwesomeIcon icon={["fas", "file-excel"]} /> Liste des classes
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
}
