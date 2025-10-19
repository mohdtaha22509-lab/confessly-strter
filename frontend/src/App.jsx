import React, {useState, useEffect} from 'react';

export default function App(){
  const [message,setMessage]=useState('');
  const [status,setStatus]=useState(null);
  const [token,setToken]=useState(null);
  const [adminMode,setAdminMode]=useState(false);

  useEffect(()=>{ const p=new URLSearchParams(window.location.search); setToken(p.get('uid_token')); if(p.get('admin')) setAdminMode(true); },[]);

  const submit=async e=>{ e.preventDefault(); if(!message.trim()) return setStatus('Write something'); const ok = window.confirm('Publicly anonymous; owner will be able to see who submitted. Continue?'); if(!ok) return; setStatus('Sending...'); try{ await fetch((import.meta.env.VITE_API_BASE || '') + '/api/confess', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message, uid_token: token})}); setStatus('Submitted'); setMessage(''); }catch(err){ setStatus('Error'); } };

  return (<div style={{maxWidth:700, margin:'40px auto', fontFamily:'system-ui,Arial'}}>
    <h1>Confessly</h1>
    <p>Your confession will be public without your name. The owner can identify submissions from personal links.</p>
    <form onSubmit={submit}>
      <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={6} style={{width:'100%'}} />
      <div style={{display:'flex', justifyContent:'space-between', marginTop:8}}>
        <small>{token ? 'Personal link detected' : 'No personal link'}</small>
        <button type='submit'>Submit</button>
      </div>
    </form>
    <div style={{marginTop:20}}>{status}</div>
    {adminMode && <div style={{marginTop:20}}><a href="/admin">Open Admin Panel</a></div>}
  </div>);
}
