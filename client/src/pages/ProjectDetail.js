import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, taskAPI, userAPI } from '../services/api';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    assignedTo: '',
    dueDate: '',
    estimatedHours: 0
  });

  useEffect(() => {
    loadProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProjectData = async () => {
    try {
      const [projectRes, tasksRes, usersRes] = await Promise.all([
        projectAPI.getById(id),
        projectAPI.getTasks(id),
        userAPI.getAll()
      ]);
      
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.create({
        ...taskFormData,
        projectId: id
      });
      setShowTaskModal(false);
      setTaskFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        assignedTo: '',
        dueDate: '',
        estimatedHours: 0
      });
      loadProjectData();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.update(taskId, { status: newStatus });
      loadProjectData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div>
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/projects')}
        style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}
      >
        <FaArrowLeft /> Back to Projects
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ marginBottom: '10px' }}>{project.name}</h2>
            <p style={{ color: '#666', marginBottom: '10px' }}>{project.description}</p>
            <span className={`project-status ${project.status}`}>
              {project.status}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
              Start: {new Date(project.startDate).toLocaleDateString()}
            </div>
            {project.endDate && (
              <div style={{ fontSize: '14px', color: '#666' }}>
                End: {new Date(project.endDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="project-progress">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar" style={{ height: '12px' }}>
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            {completedTasks} of {tasks.length} tasks completed
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0 20px' }}>
        <h3>Tasks</h3>
        <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
          <FaPlus style={{ marginRight: '5px' }} /> New Task
        </button>
      </div>

      <div className="card">
        <div className="task-list">
          {tasks.length === 0 ? (
            <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No tasks yet. Create your first task!</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="task-item">
                <input 
                  type="checkbox" 
                  className="task-checkbox"
                  checked={task.status === 'completed'}
                  onChange={(e) => handleStatusChange(task.id, e.target.checked ? 'completed' : 'todo')}
                />
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                    <span>Status: {task.status}</span>
                    {task.assignedTo && (
                      <span>Assigned: {users.find(u => u.id === task.assignedTo)?.name || 'Unknown'}</span>
                    )}
                    {task.dueDate && (
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Task</h3>
              <button className="modal-close" onClick={() => setShowTaskModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={taskFormData.title}
                  onChange={handleTaskChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={taskFormData.description}
                  onChange={handleTaskChange}
                  rows="3"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    name="priority"
                    className="form-control"
                    value={taskFormData.priority}
                    onChange={handleTaskChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={taskFormData.status}
                    onChange={handleTaskChange}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Assign To</label>
                <select
                  name="assignedTo"
                  className="form-control"
                  value={taskFormData.assignedTo}
                  onChange={handleTaskChange}
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    className="form-control"
                    value={taskFormData.dueDate}
                    onChange={handleTaskChange}
                  />
                </div>

                <div className="form-group">
                  <label>Estimated Hours</label>
                  <input
                    type="number"
                    name="estimatedHours"
                    className="form-control"
                    value={taskFormData.estimatedHours}
                    onChange={handleTaskChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
