import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { MdCheckCircleOutline, MdCheckCircle, MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';


export default function TodoList({ todos = [], setTodos }) {

  const [show, setShow] = useState(false);
  const [record, setRecord] = useState(null);

  const handleClose = () => {
    setShow(false);
  }

  const handleDelete = (id) => {
    axios.delete(`/api/tasks/${id}/`)
      .then(() => {
        const newTodos = todos.filter(t => {
          return t.id !== id
        });
        setTodos(newTodos);
      }).catch(() => {
        alert("Something went wrong");
      })
  }


  const handleUpdate = async (id, value) => {
    return axios.patch(`/api/tasks/${id}/`, value)
        .then((res) => {
            const { data } = res;
            const newTodos = todos.map(t => {
                if (t.id === id) {
                    return data;
                }
                return t;
            })
            setTodos(newTodos);
        }).catch(() => {
            alert("Something went wrong");
        })
}

  const renderListGroupItem = (t) => {
    return <ListGroup.Item key={t.id} className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <span style={{ marginRight: "12px", cursor: "pointer" }} onClick={() => {
          handleUpdate(t.id, {
            completed: !t.completed
          })
        }}>
          {t.completed === true ? <MdCheckCircle /> : <MdCheckCircleOutline />}
        </span>
        <span>
          {t.title}
        </span>
      </div>
      <div>
        <MdEdit style={{
          cursor: "pointer",
          marginRight: "12px"
        }}
          onClick={() => {
            setRecord(t);
            setShow(true);
          }}
        />
        <MdDelete style={{
          cursor: "pointer",
        }} onClick={() => {
          handleDelete(t.id);
      }} />
      </div>

    </ListGroup.Item>
  }

  const handleChange = (e) => {
    setRecord({
      ...record,
      title: e.target.value,
    })
  }

  const handleChange2 = (e) => {
    setRecord({
      ...record,
      description: e.target.value
    })
  }


  const handleSaveChanges = async () => {
    await handleUpdate(record.id, { title: record.title });
    await handleUpdate(record.id, { description: record.description });
    handleClose();
}

  const completedTodos = todos.filter(t => t.completed === true);
  const incompleteTodos = todos.filter(t => t.completed === false);

  return <div>
    <div className="mb-2 mt-4">
            Incomplete Todos ({incompleteTodos.length})
        </div>
        <ListGroup>
            {incompleteTodos.map(renderListGroupItem)}
        </ListGroup>
        <div className="mb-2 mt-4">
            Completed Todos ({completedTodos.length})
        </div>
        <ListGroup>
            {completedTodos.map(renderListGroupItem)}
        </ListGroup>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Todo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl className="mb-3" value={record ? record.title : ""} onChange={handleChange} />
        <FormControl as="textarea" value={record ? record.description : ""} onChange={handleChange2} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
}