import React, { useState } from "react";
import { Table, Spinner, Form, Button, Alert } from "react-bootstrap";
import { ENDPOINT, postRequest } from "../../links/links"; // adapte le chemin selon ton projet

const AIQuery = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(
        ENDPOINT("ai-query"), // génère automatiquement
        postRequest(JSON.stringify({ question }))
      );

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "❌ Erreur de connexion au serveur" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 border rounded bg-light">
      <h4 className="mb-3">🤖 Interroger l'IA</h4>

      <Form onSubmit={handleAsk} className="d-flex mb-3">
        <Form.Control
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Pose ta question... (ex: Combien d'élèves sur la ligne 1 ?)"
          className="mr-2"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Envoyer"}
        </Button>
      </Form>

      {response && (
        <div>
          {response.error && (
            <Alert variant="danger" className="mb-3">
              {response.error}
            </Alert>
          )}

          {response.sql && (
            <div className="mb-3">
              <strong>📝 SQL généré :</strong>
              <pre className="bg-dark text-white p-2 rounded mt-2">
                {response.sql}
              </pre>
            </div>
          )}

          {response.results && response.results.length > 0 && (
            <div>
              <strong>📊 Résultats :</strong>
              <Table striped bordered hover size="sm" className="mt-2">
                <thead>
                  <tr>
                    {Object.keys(response.results[0]).map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {response.results.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td key={i}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {response.results && response.results.length === 0 && (
            <Alert variant="info">Aucun résultat trouvé.</Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default AIQuery;
