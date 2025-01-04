// src/components/tasks/TaskModal.js (continued)
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const taskSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  dueDate: Yup.date().required('Required'),
  priority: Yup.string().oneOf(['low', 'medium', 'high']).required('Required'),
});

const TaskModal = ({ show, onHide, task, onTaskSaved }) => {
  const { user } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = task
        ? `http://localhost:3000/tasks/${task.id}`
        : 'http://localhost:3000/tasks';
      const method = task ? 'put' : 'post';

      await axios[method](url, values, {
        headers: { Authorization: `Bearer ${user}` }
      });

      toast.success(`Task ${task ? 'updated' : 'created'} successfully`);
      onTaskSaved();
      onHide();
    } catch (error) {
      toast.error(`Failed to ${task ? 'update' : 'create'} task`);
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = task
    ? { ...task, dueDate: task.dueDate.split('T')[0] }
    : {
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
      };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{task ? 'Edit Task' : 'Create Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={taskSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <Field
                  type="text"
                  name="title"
                  className={`form-control ${errors.title && touched.title ? 'is-invalid' : ''}`}
                />
                {errors.title && touched.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                />
                {errors.description && touched.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="dueDate" className="form-label">Due Date</label>
                <Field
                  type="date"
                  name="dueDate"
                  className={`form-control ${errors.dueDate && touched.dueDate ? 'is-invalid' : ''}`}
                />
                {errors.dueDate && touched.dueDate && (
                  <div className="invalid-feedback">{errors.dueDate}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="priority" className="form-label">Priority</label>
                <Field
                  as="select"
                  name="priority"
                  className={`form-control ${errors.priority && touched.priority ? 'is-invalid' : ''}`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Field>
                {errors.priority && touched.priority && (
                  <div className="invalid-feedback">{errors.priority}</div>
                )}
              </div>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={onHide} className="me-2">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default TaskModal;