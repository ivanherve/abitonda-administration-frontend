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

const upFirstnameCase = (firstname) => {
  if (!firstname) return "";
  else if (firstname.lenght < 1) return "";
  else {
    var fname = firstname.split(" ");
    var fn = [];
    fname.forEach((e) => {
      if(e) fn.push(e[0] + e.substring(1).toLowerCase());
    });
    var res = fn.join(" ");
    return res;
  }
};

export default function DownloadDocuments(props) {
  const [sorasDataSet, setSorasDataSet] = useState([]);
  const [canteenDataSet, setCanteenDataSet] = useState([]);
  const [transportDataSet, setTransportDataSet] = useState([]);
  const [registrationIncomplete, setRegistrationIncomplete] = useState([]);
  const [newStudents, setNewStudents] = useState([]);
  const [schoolsite, setSchoolsite] = useState([]);
  const [kindergardensite, setKindergardensite] = useState([]);
  const [firstnamesKindergarden, setFirstnamesKindergarden] = useState([]);
  const [firstnamesSchool, setFirstnamesSchool] = useState([]);
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  const BORDER_STYLE = "thin";
  const COLOR_SPEC = "black";

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

  const HEADER_CELLS = {
    style: {
      font: {
        bold: true,
      },
      ...BODY_CELLS.style,
    },
  };

  const BODY_CELLS_BIG_CHARACTER = {
    style: {
      font: {
        sz: "75",
      },
    },
  };

  const BODY_CELLS_SCHOOL = {
    style: {
      font: {
        name: "Brush Script MT",
        sz: "75",
      },
    },
  };

  const BODY_CELLS_NEW_STUDENTS = {
    style: {
      ...BODY_CELLS.style,
      fill: {
        fgColor: { rgb: "fff700" },
      },
    },
  };

  var dt = new Date();
  var month = dt.getMonth();
  var year = dt.getFullYear();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var days = [];
  var isPresent = [];
  for (let i = 0; i < daysInMonth; i++) {
    var dat = new Date(year, month + 1, i - 1).getDay();
    //console.log([year, month + 1, i + 1, dat, dat < 6, dat > 0, dat < 6 && dat > 0]);
    if (dat !== 6 && dat !== 0) {
      days.push({
        title: `${i + 1}`,
        width: { wpx: 20 },
        ...HEADER_CELLS,
      });
    }
  }
  for (let i = 0; i < daysInMonth; i++) {
    var dat = new Date(year, month + 1, i - 1).getDay();
    //console.log([year, month + 1, i + 1, dat, dat < 6, dat > 0, dat < 6 && dat > 0]);
    if (dat !== 6 && dat !== 0) {
      isPresent.push({
        value: "",
        ...BODY_CELLS,
      });
    }
  }

  const exportFirstnamesKindergarden = () => {
    fetch(ENDPOINT("kindergardensite"), getAuthRequest(token))
      .then((r) => r.json())
      .then((res) => {
        setFirstnamesKindergarden([
          {
            columns: [
              {
                title: "PRÉNOMS",
                width: { wpx: 150 },
                ...HEADER_CELLS,
              },
            ],
            data: res.response.map((r) => [
              {
                value: r.Firstname,
                ...BODY_CELLS_BIG_CHARACTER,
              },
            ]),
          },
        ]);
      });
  };

  const exportFirstnamesSchool = () => {
    fetch(ENDPOINT("schoolsite"), getAuthRequest(token))
      .then((r) => r.json())
      .then((res) => {
        setFirstnamesSchool([
          {
            columns: [
              {
                title: "PRÉNOMS",
                width: { wpx: 150 },
                ...HEADER_CELLS,
              },
            ],
            data: res.response.map((r) => [
              {
                value: upFirstnameCase(r.Firstname),
                ...BODY_CELLS_SCHOOL,
              },
            ]),
          },
        ]);
      });
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
              /*
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
              */
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

  const exportSchoolsite = () => {
    fetch(ENDPOINT("schoolsite"), getAuthRequest(token))
      .then((r) => r.json())
      .then((res) => {
        setSchoolsite([
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
                width: { wpx: 126 },
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

  const exportKindergardensite = () => {
    fetch(ENDPOINT("kindergardensite"), getAuthRequest(token))
      .then((r) => r.json())
      .then((res) => {
        setKindergardensite([
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
                title: "Quartier",
                width: { wpx: 130 },
                ...HEADER_CELLS,
              },
              {
                title: "Rue",
                width: { wpx: 130 },
                ...HEADER_CELLS,
              },
              {
                title: "Contact",
                width: { wpx: 130 },
                ...HEADER_CELLS,
              },
              {
                title: "Numéro",
                width: { wpx: 125 },
                ...HEADER_CELLS,
              },
              {
                title: "Paiement",
                width: { wpx: 115 },
                ...HEADER_CELLS,
              } /**/,
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
                value: r.Neighborhood,
                ...BODY_CELLS,
              },
              {
                value: r.Address,
                ...BODY_CELLS,
              },
              {
                value: r.Contact,
                ...BODY_CELLS,
              },
              {
                value: r.PhoneNumb,
                ...BODY_CELLS,
              },
              {
                value: "",
                ...BODY_CELLS,
              },
              ...isPresent,
            ]),
          },
        ]);
      });
  };

  const exportRegistrationIncomplete = () => {
    fetch(ENDPOINT("studentsregistrationsincomplete"), getAuthRequest(token))
      .then((r) => r.json())
      .then((res) => {
        setRegistrationIncomplete([
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
                title: "CLASSE",
                width: { wpx: 125 },
                ...HEADER_CELLS,
              },
              {
                title: "ROI",
                width: { wpx: 125 },
                ...HEADER_CELLS,
              },
              {
                title: "FICHE D'INSCRIPTION",
                width: { wpx: 125 },
                ...HEADER_CELLS,
              },
              {
                title: "CARNET DE VACCINATION",
                width: { wpx: 125 },
                ...HEADER_CELLS,
              },
              {
                title: "PHOTO",
                width: { wpx: 125 },
                ...HEADER_CELLS,
              },
              {
                title: "PARENT / TUTEUR",
                width: { wpx: 125 },
                ...HEADER_CELLS,
              },
              {
                title: "NUMÉRO DE TÉLÉPHONE",
                width: { wpx: 125 },
                ...HEADER_CELLS,
              },
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
                value: r.Classe,
                ...BODY_CELLS,
              },
              {
                value: r.ROI,
                ...BODY_CELLS,
              },
              {
                value: r.Fiche,
                ...BODY_CELLS,
              },
              {
                value: r.Vaccin,
                ...BODY_CELLS,
              },
              {
                value: r.Photo,
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

  const exportNewStudents = () => {
    fetch(ENDPOINT("newstudents"), getAuthRequest(token))
      .then((r) => r.json())
      .then((res) => {
        setNewStudents([
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
                title: "CLASSE",
                width: { wpx: 125 },
                ...HEADER_CELLS,
              },
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
                value: r.Classe,
                ...BODY_CELLS,
              },
            ]),
          },
        ]);
      });
  };

  useEffect(() => {
    exportTransport();
    exportCanteen();
    exportSoras();
    exportRegistrationIncomplete();
    exportNewStudents();
    exportSchoolsite();
    exportKindergardensite();
    exportFirstnamesKindergarden();
    exportFirstnamesSchool();
  }, []);

  return (
    <Modal centered show={props.show} onHide={props.hide}>
      <Modal.Header closeButton>
        <Modal.Title>Documents à télécharger</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListsStudents title={`Liste SORAS`} data={sorasDataSet} />
          <ListsStudents
            title={`Liste de Présence`}
            subtitle={`Cantine`}
            data={canteenDataSet}
          />
          <ListsStudents
            title={`Liste de Présence`}
            subtitle={`SITE CRÈCHE`}
            data={kindergardensite}
          />
          <ListsStudents
            title={`Liste de Présence`}
            subtitle="SITE ÉCOLE"
            data={schoolsite}
          />
          <ListsStudents title={`Liste de Transport`} data={transportDataSet} />
          <ListsStudents
            title={`Liste des dossiers d'inscription incomplète`}
            data={registrationIncomplete}
          />
          <ListsStudents title={`Liste des nouveaux`} data={newStudents} />
          <ListsStudents
            title="Étiquette"
            subtitle="CRÈCHE"
            data={firstnamesKindergarden}
          />
          <ListsStudents
            title="Étiquette"
            subtitle="ÉCOLE"
            data={firstnamesSchool}
          />
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
}

const ListsStudents = (props) => {
  return (
    <ListGroup.Item>
      <Row>
        <Col xs="9">
          {props.title} <i>{props.subtitle ? "- " + props.subtitle : ""}</i>
        </Col>
        <Col xs="3">
          <ExcelFile
            filename={
              props.subtitle
                ? props.title + " - " + props.subtitle
                : props.title
            }
            element={
              <Button variant="light">
                <FontAwesomeIcon icon={["fas", "download"]} />
              </Button>
            }
          >
            <ExcelSheet
              dataSet={props.data}
              name={
                props.subtitle
                  ? props.title + " - " + props.subtitle
                  : props.title
              }
            />
          </ExcelFile>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};
