import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

const SocialPage = () => {
  const { USER_ID } = useApp();
  const [feed, setFeed] = useState([]);
  const [stories, setStories] = useState([]);
  const [reels, setReels] = useState([]);
  const [convos, setConvos] = useState([]);
  const [tab, setTab] = useState('feed');
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    if (tab === 'feed') loadFeed();
    else if (tab === 'stories') loadStories();
    else if (tab === 'reels') loadReels();
    else if (tab === 'messenger') loadConvos();
  }, [tab]);

  const loadFeed = async () => {
    try { setFeed(await api(`/api/social/feed?page=1&page_size=20`)); }
    catch (e) { setFeed([]); }
  };

  const loadStories = async () => {
    try { setStories(await api('/api/social/stories')); }
    catch (e) { setStories([]); }
  };

  const loadReels = async () => {
    try { setReels(await api('/api/social/reels?page=1&page_size=20')); }
    catch (e) { setReels([]); }
  };

  const loadConvos = async () => {
    try { setConvos(await api(`/api/social/messenger/conversations?user_id=${USER_ID}`)); }
    catch (e) { setConvos([]); }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    try {
      await api('/api/social/posts', {
        method: 'POST',
        body: JSON.stringify({ content: newPost, user_id: USER_ID }),
      });
      setNewPost('');
      loadFeed();
    } catch (e) { console.error(e); }
  };

  const handleLike = async (postId) => {
    try { await api(`/api/social/posts/${postId}/like?user_id=${USER_ID}`, { method: 'POST' }); loadFeed(); }
    catch (e) { console.error(e); }
  };

  const tabs = [
    { k: 'feed', l: '📰 Feed' },
    { k: 'stories', l: '📸 Stories' },
    { k: 'reels', l: '🎬 Reels' },
    { k: 'messenger', l: '💬 Messenger' },
  ];

  return (
    <div className="page page-3d">
      <div className="page-header">
        <h1 className="page-title text-3d-strong">Social <span>Network</span></h1>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.k} className={`tab ${tab === t.k ? 'active' : ''}`} onClick={() => setTab(t.k)}>
            {t.l}
          </button>
        ))}
      </div>

      {tab === 'feed' && (
        <div>
          <div className="card card-3d" style={{ padding: '16px', marginBottom: '16px' }}>
            <textarea
              className="input"
              rows="3"
              placeholder="What's on your mind?"
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              style={{ width: '100%', marginBottom: '8px' }}
            />
            <button className="btn btn-primary" onClick={handlePost}>Post</button>
          </div>
          {feed.map(post => (
            <div key={post.id} className="card card-3d" style={{ padding: '16px', marginBottom: '12px' }}>
              <p><strong>User #{post.user_id}</strong> <small>{new Date(post.created_at).toLocaleString()}</small></p>
              <p>{post.content}</p>
              {post.media_urls?.map((url, i) => (
                <img key={i} src={url} alt="" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '8px' }} />
              ))}
              <div className="card-actions" style={{ marginTop: '12px', display: 'flex', gap: '16px' }}>
                <button className="btn btn-sm" onClick={() => handleLike(post.id)}>❤️ {post.like_count}</button>
                <span>💬 {post.comment_count}</span>
                <span>↗️ {post.share_count}</span>
              </div>
            </div>
          ))}
          {feed.length === 0 && <p className="loading">No posts yet</p>}
        </div>
      )}

      {tab === 'stories' && (
        <div>
          <p className="section-title">Stories (expire in 24h)</p>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '8px 0' }}>
            {stories.map(s => (
              <div key={s.id} className="card card-3d" style={{ minWidth: '150px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px' }}>📸</div>
                <p><strong>User #{s.user_id}</strong></p>
                <p style={{ fontSize: '12px' }}>{s.caption}</p>
              </div>
            ))}
          </div>
          {stories.length === 0 && <p className="loading">No active stories</p>}
        </div>
      )}

      {tab === 'reels' && (
        <div className="grid-3">
          {reels.map(r => (
            <div key={r.id} className="card card-3d" style={{ padding: '12px' }}>
              <div className="card-shine" style={{ height: '200px', background: '#1a1a2e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>🎬</div>
              <p style={{ marginTop: '8px' }}><strong>{r.caption || 'Untitled'}</strong></p>
              <p style={{ fontSize: '12px' }}>👁️ {r.view_count} ❤️ {r.like_count}</p>
            </div>
          ))}
          {reels.length === 0 && <p className="loading">No reels yet</p>}
        </div>
      )}

      {tab === 'messenger' && (
        <div>
          <p className="section-title">Conversations</p>
          {convos.map(c => (
            <div key={c.id} className="card card-3d" style={{ padding: '12px', marginBottom: '8px' }}>
              <p>Conversation #{c.id} — Participants: {c.participant_ids?.join(', ') || 'None'}</p>
            </div>
          ))}
          {convos.length === 0 && <p className="loading">No conversations</p>}
        </div>
      )}
    </div>
  );
};

export default SocialPage;
