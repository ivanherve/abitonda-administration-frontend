import { useEffect, useState } from "react";
import { Card, ListGroup, ProgressBar } from "react-bootstrap";
import { Bar, Doughnut } from "react-chartjs-2";
import { ENDPOINT, getAuthRequest } from "../../links/links";
export default function Statistics(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const [numbStudents, setNumbStudents] = useState([]);
  const [numbStudentsPerSector, setNumbStudentsPerSector] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [color, setColor] = useState([]);
  const [border, setBorder] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch(ENDPOINT("numbstudentperneighborhoods"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        let sect = [];
        let numb = [];
        let color = [];
        let bord = [];
        if (r.status) {
          r.response.map((res) => {
            //if (numbStudents.length < 1) setNumbStudents([res.NbStudents]);
            //else setNumbStudents([...numbStudents, res.NbStudents]);
            sect.push(res.Sector);
            numb.push(res.NbStudents);
            color.push(
              res.District === "Gasabo"
                ? "rgba(255, 99, 132, 0.2)"
                : res.District === "Kicukiro"
                ? "rgba(255, 206, 86, 0.2)"
                : res.District === "Nyarugenge"
                ? "rgba(75, 192, 132, 0.2)"
                : "rgba(0,0,0, 0.2)"
            );
            bord.push(
              res.District === "Gasabo"
                ? "rgba(255, 99, 132, 1)"
                : res.District === "Kicukiro"
                ? "rgba(255, 206, 86, 1)"
                : res.District === "Nyarugenge"
                ? "rgba(75, 192, 132, 1)"
                : "rgba(0, 0, 0, 1)"
            );
          });
          setSectors(sect);
          setNumbStudents(numb);
          setColor(color);
          setBorder(bord);
        }
      });
    fetch(ENDPOINT("numbstudentpersector"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setNumbStudentsPerSector(r.response);
      });
  }, []);
  var dataBar = {
    labels: sectors,
    datasets: [
      {
        label: "Gasabo",
        data: numbStudents,
        backgroundColor: color,
        borderColor: border,
        borderWidth: 1,
      },
      {
        label: "Nyarugenge",
        backgroundColor: "rgba(75, 192, 132, 0.2)",
        borderColor: "rgba(75, 192, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Kicukiro",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  setTimeout(() => {
    setLoading(true);
  }, 3000);

  if (!loading) return <div>Chargement ...</div>;
  return (
    <div>
      <Card>
        <Card.Header>
          <Card.Title>Nombre d'élèves par quartier</Card.Title>
        </Card.Header>
        <Card.Body>
          <Bar data={dataBar} options={options} />
          <ProgressBar>
            {numbStudentsPerSector.length > 1 &&
              numbStudentsPerSector.map((n) => (
                <ProgressBar
                  key={numbStudentsPerSector.indexOf(n)}
                  animated
                  striped
                  variant={
                    n.District === "Nyarugenge"
                      ? "success"
                      : n.District === "Kicukiro"
                      ? "warning"
                      : n.District === "Gasabo"
                      ? "danger"
                      : "secondary"
                  }
                  now={n.NbStudents}
                  label={`${n.District} - ${n.NbStudents} élèves`}
                />
              ))}
          </ProgressBar>
          <ListGroup variant="flush">
            <ListGroup.Item></ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
