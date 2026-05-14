import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

const EventsPage = () => {
  const { USER_ID } = useApp();
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [tab, setTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (tab === 'events') loadEvents();
    else if (tab === 'venues') loadVenues();
  }, [tab]);

  const loadEvents = async () => {
    try { setEvents(await api('/api/events?status=upcoming')); }
    catch (e) { setEvents([]); }
  };

  const loadVenues = async () => {
    try { setVenues(await api('/api/events/venues')); }
    catch (e) { setVenues([]); }
  };

  const handleBook = async (eventId) => {
    try {
      await api(`/api/events/${eventId}/book`, {
        method: 'POST',
        body: JSON.stringify({ event_id: eventId, ticket_type: 'general', quantity: 1 }),
      });
      alert('Tickets booked!');
    } catch (e) { alert('Booking failed: ' + e.message); }
  };

  return (
    <div className="page page-3d">
      <div className="page-header">
        <h1 className="page-title text-3d-strong">Events & <span>Tickets</span></h1>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'events' ? 'active' : ''}`} onClick={() => setTab('events')}>🎪 Events</button>
        <button className={`tab ${tab === 'venues' ? 'active' : ''}`} onClick={() => setTab('venues')}>🏟️ Venues</button>
      </div>

      {tab === 'events' && (
        <div>
          {events.length === 0 && <p className="loading">No upcoming events</p>}
          {events.map(e => (
            <div key={e.id} className="card card-3d" style={{ padding: '16px', marginBottom: '12px' }}
              onClick={() => setSelectedEvent(selectedEvent?.id === e.id ? null : e)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>{e.title}</h3>
                  <p>{e.event_type} · {new Date(e.start_date).toLocaleDateString()}</p>
                  {e.venue && <p style={{ fontSize: '12px' }}>📍 {e.venue.name}, {e.venue.city}</p>}
                </div>
                <button className="btn btn-primary" onClick={(ev) => { ev.stopPropagation(); handleBook(e.id); }}>
                  Book Now
                </button>
              </div>
              {selectedEvent?.id === e.id && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <p>{e.description || 'No description'}</p>
                  <p>Status: {e.status} · Views: {e.view_count}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'venues' && (
        <div className="grid-3">
          {venues.map(v => (
            <div key={v.id} className="card card-3d" style={{ padding: '16px' }}>
              <h3>{v.name}</h3>
              <p>📍 {v.city}, {v.country}</p>
              <p>Capacity: {v.capacity}</p>
              {v.amenities?.length > 0 && (
                <p style={{ fontSize: '12px' }}>Amenities: {v.amenities.join(', ')}</p>
              )}
            </div>
          ))}
          {venues.length === 0 && <p className="loading">No venues</p>}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
