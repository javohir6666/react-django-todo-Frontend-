import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

export default function TodoForm({ todos, setTodos }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleChange = e => {
    setTitle(e.target.value);
  };
  const handleChange2 = e => {
    setDescription(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!title) {
      alert("Please provide a valid value for todo");
      return;
    }

    axios.post("/api/tasks/", {
      title: title,
      description: description,
    }).then((res) => {
      setTitle("");
      setDescription("");
      const { data } = res;
      setTodos([
        ...todos,
        data
      ]).catch(() => {
        alert("Something went wrong");
      })
    })
  }


  return <Form onSubmit={handleSubmit}>
    <InputGroup className="mb-3" controlId="title">
      <FormControl type="text" placeholder="Title" onChange={handleChange} value={title} />
    </InputGroup>
    <InputGroup className="mb-3" controlId="description">
      <FormControl as="textarea" placeholder="Description" onChange={handleChange2} value={description} rows={3} />
    </InputGroup>
    <Button type="submit" className='mb-3'>Save</Button>
  </Form>
}