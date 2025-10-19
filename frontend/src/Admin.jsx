import React, {useEffect, useState} from 'react';
export default function Admin(){
  const [list,setList]=useState([]);
  useEffect(()=>{ fetch('/api/admin/confessions', {credentials:'include'}).then(r=>r.json()).then(d=>setList(d||[])).catch(()=>setList([])) },[]);
  return (<div style={{maxWidth:900, margin:40}}>
    <h2>Admin — Confessions</h2>
    <div>{list.map(c=> (<div key={c._id} style={{border:'1px solid #ddd', padding:10, marginBottom:8}}><div>{c.message}</div><div style={{fontSize:12,color:'#666'}}>{new Date(c.createdAt).toLocaleString()}</div><div style={{fontSize:12,color:'#333'}}>ownerId: {c.ownerId || '—'}</div></div>))}</div>
  </div>);
}
