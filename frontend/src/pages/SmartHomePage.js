import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

const SmartHomePage = () => {
  const { USER_ID } = useApp();
  const [devices, setDevices] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [tab, setTab] = useState('devices');
  const [newDevice, setNewDevice] = useState({ name: '', device_type: 'light', room: '' });

  useEffect(() => {
    if (tab === 'devices') loadDevices();
    else if (tab === 'scenes') loadScenes();
  }, [tab]);

  const loadDevices = async () => {
    try { setDevices(await api(`/api/smarthome/devices?user_id=${USER_ID}`)); }
    catch (e) { setDevices([]); }
  };

  const loadScenes = async () => {
    try { setScenes(await api(`/api/smarthome/scenes?user_id=${USER_ID}`)); }
    catch (e) { setScenes([]); }
  };

  const handleToggle = async (deviceId) => {
    try {
      await api(`/api/smarthome/devices/${deviceId}/command`, {
        method: 'POST',
        body: JSON.stringify({ device_id: deviceId, command: 'toggle' }),
      });
      loadDevices();
    } catch (e) { console.error(e); }
  };

  const handleAddDevice = async () => {
    if (!newDevice.name.trim()) return;
    try {
      await api('/api/smarthome/devices', {
        method: 'POST',
        body: JSON.stringify(newDevice),
      });
      setNewDevice({ name: '', device_type: 'light', room: '' });
      loadDevices();
    } catch (e) { console.error(e); }
  };

  const handleActivateScene = async (sceneId) => {
    try {
      await api(`/api/smarthome/scenes/${sceneId}/activate`, { method: 'POST' });
      loadDevices();
    } catch (e) { console.error(e); }
  };

  const deviceIcons = { light: '💡', ac: '❄️', fan: '🌀', tv: '📺', speaker: '🔊', lock: '🔒', camera: '📹', sensor: '📡' };

  return (
    <div className="page page-3d">
      <div className="page-header">
        <h1 className="page-title text-3d-strong">Smart <span>Home</span></h1>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'devices' ? 'active' : ''}`} onClick={() => setTab('devices')}>📱 Devices</button>
        <button className={`tab ${tab === 'scenes' ? 'active' : ''}`} onClick={() => setTab('scenes')}>🎯 Scenes</button>
      </div>

      {tab === 'devices' && (
        <div>
          <div className="card card-3d" style={{ padding: '16px', marginBottom: '16px' }}>
            <h3>Add Device</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input className="input" placeholder="Device name" value={newDevice.name}
                onChange={e => setNewDevice({ ...newDevice, name: e.target.value })} style={{ flex: 1 }} />
              <select className="input" value={newDevice.device_type}
                onChange={e => setNewDevice({ ...newDevice, device_type: e.target.value })}>
                {Object.entries(deviceIcons).map(([k, v]) => <option key={k} value={k}>{v} {k}</option>)}
              </select>
              <input className="input" placeholder="Room" value={newDevice.room}
                onChange={e => setNewDevice({ ...newDevice, room: e.target.value })} />
              <button className="btn btn-primary" onClick={handleAddDevice}>Add</button>
            </div>
          </div>

          <div className="grid-3">
            {devices.map(d => (
              <div key={d.id} className="card card-3d" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '24px' }}>{deviceIcons[d.device_type] || '📱'}</span>
                    <h3>{d.name}</h3>
                    <p style={{ fontSize: '12px' }}>{d.room || 'No room'}</p>
                    <p style={{ fontSize: '12px' }}>Power: {d.state?.power || 'off'}</p>
                  </div>
                  <button className={`btn ${d.state?.power === 'on' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleToggle(d.id)}>
                    {d.state?.power === 'on' ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {devices.length === 0 && <p className="loading">No devices — add one above!</p>}
        </div>
      )}

      {tab === 'scenes' && (
        <div>
          <div className="grid-3">
            {scenes.map(s => (
              <div key={s.id} className="card card-3d" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px' }}>{s.icon}</div>
                <h3>{s.name}</h3>
                <p style={{ fontSize: '12px' }}>{s.actions?.length || 0} actions</p>
                <button className="btn btn-primary" style={{ marginTop: '8px' }}
                  onClick={() => handleActivateScene(s.id)}>Activate</button>
              </div>
            ))}
          </div>
          {scenes.length === 0 && <p className="loading">No scenes created yet</p>}
        </div>
      )}
    </div>
  );
};

export default SmartHomePage;
