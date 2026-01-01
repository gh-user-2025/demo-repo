import React, { useEffect, useState } from 'react';
import { analyticsAPI, userAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [dashboardRes, workloadRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getWorkload()
      ]);
      
      setDashboardData(dashboardRes.data);
      setWorkloadData(workloadRes.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  const taskPriorityData = dashboardData?.tasksByPriority ? [
    { name: 'High', value: dashboardData.tasksByPriority.high, fill: '#dc3545' },
    { name: 'Medium', value: dashboardData.tasksByPriority.medium, fill: '#ffc107' },
    { name: 'Low', value: dashboardData.tasksByPriority.low, fill: '#28a745' }
  ] : [];

  const projectStatusData = dashboardData?.projectsByStatus ? [
    { name: 'Active', value: dashboardData.projectsByStatus.active, fill: '#007bff' },
    { name: 'Completed', value: dashboardData.projectsByStatus.completed, fill: '#28a745' },
    { name: 'On Hold', value: dashboardData.projectsByStatus.onHold, fill: '#6c757d' }
  ] : [];

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Analytics & Reports</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Task Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskPriorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>Team Workload</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={workloadData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="userName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="activeTasks" fill="#007bff" name="Active Tasks" />
            <Bar dataKey="totalEstimatedHours" fill="#28a745" name="Estimated Hours" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Detailed Workload Breakdown</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dee2e6', background: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Team Member</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Active Tasks</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Estimated Hours</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Workload Status</th>
              </tr>
            </thead>
            <tbody>
              {workloadData.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No workload data available
                  </td>
                </tr>
              ) : (
                workloadData.map(member => {
                  const workloadLevel = member.totalEstimatedHours > 40 ? 'Overloaded' : 
                                       member.totalEstimatedHours > 20 ? 'Balanced' : 'Light';
                  const workloadColor = workloadLevel === 'Overloaded' ? '#dc3545' : 
                                       workloadLevel === 'Balanced' ? '#28a745' : '#007bff';
                  
                  return (
                    <tr key={member.userId} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '12px' }}>{member.userName}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{member.activeTasks}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{member.totalEstimatedHours}h</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'white',
                          background: workloadColor
                        }}>
                          {workloadLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
        <div className="card">
          <h4 style={{ marginBottom: '15px', color: '#333' }}>Completion Rate</h4>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
            {dashboardData?.stats.totalTasks > 0 
              ? Math.round((dashboardData.stats.completedTasks / dashboardData.stats.totalTasks) * 100)
              : 0}%
          </div>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            {dashboardData?.stats.completedTasks} of {dashboardData?.stats.totalTasks} tasks completed
          </p>
        </div>

        <div className="card">
          <h4 style={{ marginBottom: '15px', color: '#333' }}>Active Projects</h4>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
            {dashboardData?.stats.activeProjects || 0}
          </div>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Currently in progress
          </p>
        </div>

        <div className="card">
          <h4 style={{ marginBottom: '15px', color: '#333' }}>Overdue Tasks</h4>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
            {dashboardData?.stats.overdueTasks || 0}
          </div>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Need immediate attention
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
