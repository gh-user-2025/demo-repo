import React, { useEffect, useState } from 'react';
import { teamAPI, userAPI } from '../services/api';
import { FaPlus, FaUsers } from 'react-icons/fa';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teamsRes, usersRes] = await Promise.all([
        teamAPI.getAll(),
        userAPI.getAll()
      ]);
      
      setTeams(teamsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await teamAPI.create(formData);
      setShowModal(false);
      setFormData({ name: '', description: '', members: [] });
      loadData();
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Teams</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus style={{ marginRight: '5px' }} /> New Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <FaUsers style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }} />
          <p style={{ color: '#666', marginBottom: '20px' }}>No teams yet. Create your first team!</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Create Team
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {teams.map(team => (
            <div key={team.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '10px', 
                  background: '#007bff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  <FaUsers />
                </div>
                <div>
                  <h3 style={{ marginBottom: '5px' }}>{team.name}</h3>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    {team.members.length} members
                  </p>
                </div>
              </div>

              {team.description && (
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                  {team.description}
                </p>
              )}

              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#333' }}>Members:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {team.members.length === 0 ? (
                    <span style={{ fontSize: '12px', color: '#999' }}>No members yet</span>
                  ) : (
                    team.members.map(memberId => (
                      <span 
                        key={memberId}
                        style={{
                          padding: '5px 12px',
                          background: '#e9ecef',
                          borderRadius: '20px',
                          fontSize: '12px',
                          color: '#333'
                        }}
                      >
                        {getUserName(memberId)}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Team</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Team Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Team Members</label>
                <div style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '5px', 
                  padding: '10px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {users.map(user => (
                    <div key={user.id} style={{ marginBottom: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.members.includes(user.id)}
                          onChange={() => handleMemberToggle(user.id)}
                          style={{ marginRight: '8px' }}
                        />
                        <span>{user.name} ({user.role})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
