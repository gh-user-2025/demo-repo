import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import { 
  FaHome, 
  FaTasks, 
  FaProjectDiagram, 
  FaUsers, 
  FaChartBar, 
  FaBell, 
  FaSignOutAlt 
} from 'react-icons/fa';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>PM System</h2>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>Project Management</p>
        </div>
        <nav>
          <ul className="sidebar-nav">
            <li>
              <NavLink to="/" end>
                <FaHome /> <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects">
                <FaProjectDiagram /> <span>Projects</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/tasks">
                <FaTasks /> <span>Tasks</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/teams">
                <FaUsers /> <span>Teams</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/analytics">
                <FaChartBar /> <span>Analytics</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="header">
          <h1 className="header-title">Welcome, {user?.name}</h1>
          <div className="header-actions">
            <div className="notification-icon">
              <FaBell />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>
            <div className="user-menu">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span>{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
