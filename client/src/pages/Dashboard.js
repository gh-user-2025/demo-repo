import React, { useEffect, useState } from 'react';
import { analyticsAPI, taskAPI, activityLogs } from '../services/api';
import { FaProjectDiagram, FaTasks, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [analyticsRes, tasksRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        taskAPI.getAll()
      ]);
      
      setStats(analyticsRes.data);
      setRecentTasks(tasksRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

  const taskStatusData = stats ? [
    { name: 'To Do', value: stats.stats.todoTasks },
    { name: 'In Progress', value: stats.stats.inProgressTasks },
    { name: 'Completed', value: stats.stats.completedTasks }
  ] : [];

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FaProjectDiagram />
          </div>
          <div className="stat-info">
            <h3>{stats?.stats.totalProjects || 0}</h3>
            <p>Total Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaTasks />
          </div>
          <div className="stat-info">
            <h3>{stats?.stats.totalTasks || 0}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{stats?.stats.completedTasks || 0}</h3>
            <p>Completed Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <FaExclamationTriangle />
          </div>
          <div className="stat-info">
            <h3>{stats?.stats.overdueTasks || 0}</h3>
            <p>Overdue Tasks</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Project Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[stats?.projectsByStatus]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="active" fill="#007bff" name="Active" />
              <Bar dataKey="completed" fill="#28a745" name="Completed" />
              <Bar dataKey="onHold" fill="#ffc107" name="On Hold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Recent Tasks</h3>
        <div className="task-list">
          {recentTasks.length === 0 ? (
            <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No tasks yet</p>
          ) : (
            recentTasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                    <span>Status: {task.status}</span>
                    {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
