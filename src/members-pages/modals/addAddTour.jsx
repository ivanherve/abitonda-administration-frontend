import React, { useState } from "react";
import {Modal} from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const AddTourModal = ({ isOpen, onClose, students }) => {
    console.log(students); // Log the students prop to check if the component receives the data

    const [availableStudents, setAvailableStudents] = useState(
        students.map((student) => ({
            id: student.id.toString(),
            name: `${student.name} (${student.classe})`,
        })) || []
    );
    const [busTourStudents, setBusTourStudents] = useState([]);

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        let updatedAvailableStudents = [...availableStudents];
        let updatedBusTourStudents = [...busTourStudents];

        // Moving between lists
        if (source.droppableId === "availableStudents" && destination.droppableId === "busTourStudents") {
            const [movedStudent] = updatedAvailableStudents.splice(source.index, 1);
            updatedBusTourStudents.splice(destination.index, 0, movedStudent);
        } else if (source.droppableId === "busTourStudents" && destination.droppableId === "availableStudents") {
            const [movedStudent] = updatedBusTourStudents.splice(source.index, 1);
            updatedAvailableStudents.splice(destination.index, 0, movedStudent);
        }

        setAvailableStudents(updatedAvailableStudents);
        setBusTourStudents(updatedBusTourStudents);
    };
    
    return (
        <Modal show={isOpen} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="add-bus-tour-modal">Ajouter un tour de ligne de bus</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {/* Liste des élèves disponibles */}
                        <Droppable droppableId="availableStudents">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        padding: "10px",
                                        width: "45%",
                                        minHeight: "200px",
                                    }}
                                >
                                    <h3>Élèves disponibles</h3>
                                    {availableStudents.map((student, index) => (
                                        <Draggable key={student.id} draggableId={student.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        padding: "8px",
                                                        margin: "4px 0",
                                                        backgroundColor: "#f9f9f9",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "4px",
                                                        ...provided.draggableProps.style,
                                                    }}
                                                >
                                                    {student.name}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        {/* Liste des élèves du tour */}
                        <Droppable droppableId="busTourStudents">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        padding: "10px",
                                        width: "45%",
                                        minHeight: "200px",
                                    }}
                                >
                                    <h3>Élèves du tour</h3>
                                    {busTourStudents.map((student, index) => (
                                        <Draggable key={student.id} draggableId={student.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        padding: "8px",
                                                        margin: "4px 0",
                                                        backgroundColor: "#f9f9f9",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "4px",
                                                        ...provided.draggableProps.style,
                                                    }}
                                                >
                                                    {student.name}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={onClose} style={{ marginRight: "10px" }} className="btn btn-secondary">
                    Annuler
                </button>
                <button onClick={() => console.log(busTourStudents)} className="btn btn-primary">
                    Valider
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddTourModal;