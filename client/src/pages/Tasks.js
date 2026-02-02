import React, { useEffect, useState } from 'react';
import { taskAPI, projectAPI, userAPI } from '../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        taskAPI.getAll(),
        projectAPI.getAll(),
        userAPI.getAll()
      ]);
      
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.update(taskId, { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'active') return task.status !== 'completed';
    return true;
  });

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>My Tasks</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="card">
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No tasks found. {filter !== 'all' && 'Try changing the filter.'}
            </p>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="task-item">
                <input 
                  type="checkbox" 
                  className="task-checkbox"
                  checked={task.status === 'completed'}
                  onChange={(e) => handleStatusChange(task.id, e.target.checked ? 'completed' : 'todo')}
                />
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    {task.description}
                  </div>
                  <div className="task-meta">
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                    <span>Project: {getProjectName(task.projectId)}</span>
                    <span>Status: {task.status}</span>
                    {task.assignedTo && (
                      <span>Assigned: {getUserName(task.assignedTo)}</span>
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

      <div style={{ marginTop: '30px' }}>
        <div className="stats-grid">
          <div className="card">
            <h4 style={{ marginBottom: '15px' }}>Task Statistics</h4>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <p style={{ marginBottom: '10px' }}>
                <strong>Total Tasks:</strong> {tasks.length}
              </p>
              <p style={{ marginBottom: '10px' }}>
                <strong>Completed:</strong> {tasks.filter(t => t.status === 'completed').length}
              </p>
              <p style={{ marginBottom: '10px' }}>
                <strong>In Progress:</strong> {tasks.filter(t => t.status === 'in-progress').length}
              </p>
              <p>
                <strong>To Do:</strong> {tasks.filter(t => t.status === 'todo').length}
              </p>
            </div>
          </div>

          <div className="card">
            <h4 style={{ marginBottom: '15px' }}>Priority Distribution</h4>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <p style={{ marginBottom: '10px' }}>
                <strong>High Priority:</strong> {tasks.filter(t => t.priority === 'high').length}
              </p>
              <p style={{ marginBottom: '10px' }}>
                <strong>Medium Priority:</strong> {tasks.filter(t => t.priority === 'medium').length}
              </p>
              <p>
                <strong>Low Priority:</strong> {tasks.filter(t => t.priority === 'low').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
