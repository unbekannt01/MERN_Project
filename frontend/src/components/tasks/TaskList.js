import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import TaskModal from './TaskModal';
import { Pagination } from 'react-bootstrap';

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const tasksPerPage = 10;

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tasks?page=${currentPage}&limit=${tasksPerPage}`,
        {
          headers: { Authorization: `Bearer ${user}` },
        }
      );
      setTasks(response.data.tasks);
      setTotalTasks(response.data.total);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  }, [currentPage, user, tasksPerPage]); // Add dependencies here
  useEffect(() => {
    fetchTasks();
  }, [currentPage,fetchTasks, user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:3000/tasks/${id}`, {
          headers: { Authorization: `Bearer ${user}` }
        });
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:3000/tasks/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user}` } }
      );
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-danger';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return '';
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tasks</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedTask(null);
            setShowModal(true);
          }}
        >
          Create Task
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className={getPriorityColor(task.priority)}>
                  {task.priority.toUpperCase()}
                </td>
                <td>{task.status}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleEdit(task)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => handleDelete(task.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  {task.status === 'pending' && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleStatusUpdate(task.id, 'completed')}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination className="justify-content-center">
        {[...Array(Math.ceil(totalTasks / tasksPerPage))].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <TaskModal
        show={showModal}
        onHide={() => setShowModal(false)}
        task={selectedTask}
        onTaskSaved={fetchTasks}
      />
    </div>
  );
};

export default TaskList;