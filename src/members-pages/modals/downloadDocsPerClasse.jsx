import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faDownload,
  faFileExcel,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Col, ListGroup, Modal, Row } from "react-bootstrap";
import ReactExport from "react-data-export";
import { ENDPOINT, getAuthRequest } from "../../links/links";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

library.add(faFileWord, faFileExcel, faDownload);

export default function DownloadDocsPerClasse(props) {
  const [bdayDataSet, setBdayDataSet] = useState([]);
  const [presenceDataSet, setPresenceDataSet] = useState([]);
  const [contactListDataSet, setContactListDataSet] = useState([]);
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

  const getBirthdayList = () => {
    let header = [
      { title: "No", wpx: 40 },
      { title: "PRÉNOMS", wpx: 150 },
      { title: "NOMS", wpx: 150 },
      { title: "DATE DE NAISSANCE", wpx: 125 },
    ];
    let columnsHeader = [];
    header.forEach((h) => {
      columnsHeader.push({
        title: h.title,
        width: { wpx: h.wpx },
        ...HEADER_CELLS,
      });
    });
    fetch(
      ENDPOINT("birthdaylistperclasse?cI=" + props.classe),
      getAuthRequest(token)
    )
      .then((r) => r.json())
      .then((res) => {
        setBdayDataSet([
          {
            columns: columnsHeader,
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
            ]),
          },
        ]);
      });
  };

  const getPresenceList = () => {
    let header = [
      { title: "No", wpx: 40 },
      { title: "PRÉNOMS", wpx: 150 },
      { title: "NOMS", wpx: 150 },
      { title: "DATE DE NAISSANCE", wpx: 125 },
    ];
    let columnsHeader = [];
    header.forEach((h) => {
      columnsHeader.push({
        title: h.title,
        width: { wpx: h.wpx },
        ...HEADER_CELLS,
      });
    });
    fetch(
      ENDPOINT("presencelistperclasse?classe=" + props.classe),
      getAuthRequest(token)
    )
      .then((r) => r.json())
      .then((res) => {
        setPresenceDataSet([
          {
            columns: [...columnsHeader, ...days],
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

  const getContactList = () => {
    let header = [
      { title: "No", wpx: 40 },
      { title: "PRÉNOMS", wpx: 150 },
      { title: "NOMS", wpx: 150 },
      { title: "CLASSE", wpx: 100 },
      { title: "PARENT", wpx: 200 },
      { title: "NUMÉRO", wpx: 150 },
    ];
    let columnsHeader = [];
    header.map((h) => {
      columnsHeader.push({
        title: h.title,
        width: { wpx: h.wpx },
        ...HEADER_CELLS,
      });
    });
    fetch(
      ENDPOINT("getlistcontactperclasse?classe=" + props.classe),
      getAuthRequest(token)
    )
      .then((r) => r.json())
      .then((res) => {
        setContactListDataSet([
          {
            columns: columnsHeader,
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
                value: r.Classe,
                ...BODY_CELLS,
              },
              {
                value: r.Parent,
                ...BODY_CELLS,
              },
              {
                value: r.PhoneNumb,
                ...BODY_CELLS,
              },
            ]),
          },
        ]);
      });
  };

  useEffect(() => {
    getBirthdayList();
    getPresenceList();
    getContactList();
  }, [props.classe]);

  return (
    <Modal centered show={props.show} onHide={props.hide}>
      <Modal.Header closeButton>
        <Modal.Title>Documents à télécharger</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Row>
              <Col xs="9">Liste de Présence</Col>
              <Col xs="3">
                <ExcelFile
                  filename={"Liste de Présence de " + props.classe}
                  element={
                    <Button variant="light">
                      <FontAwesomeIcon icon={["fas", "download"]} />
                    </Button>
                  }
                >
                  <ExcelSheet
                    dataSet={presenceDataSet}
                    name={"Liste de Présence de " + props.classe}
                  />
                </ExcelFile>
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col xs="9">Liste des anniversaires</Col>
              <Col xs="3">
                <ExcelFile
                  filename={"Liste d'anniversaires de " + props.classe}
                  element={
                    <Button variant="light">
                      <FontAwesomeIcon icon={["fas", "download"]} />
                    </Button>
                  }
                >
                  <ExcelSheet
                    dataSet={bdayDataSet}
                    name={"Liste d'anniversaires de " + props.classe}
                  />
                </ExcelFile>
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col xs="9">Liste des contacts</Col>
              <Col xs="3">
                <ExcelFile
                  filename={"Liste de Contact de " + props.classe}
                  element={
                    <Button variant="light">
                      <FontAwesomeIcon icon={["fas", "download"]} />
                    </Button>
                  }
                >
                  <ExcelSheet
                    dataSet={contactListDataSet}
                    name={"Liste de Contact"}
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
