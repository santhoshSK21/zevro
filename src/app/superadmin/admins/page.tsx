'use client';

import React, { useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended';
  avatar: string;
  permissions: string[];
  lastLogin: string;
  createdAt: string;
}

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Store Manager');
  const [newPermissions, setNewPermissions] = useState<string[]>(['orders_manage', 'products_read_write']);
  const [toastMsg, setToastMsg] = useState('');

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/superadmin/admins');
      const data = await res.json();
      if (data.admins) {
        setAdmins(data.admins);
      }
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    try {
      const res = await fetch('/api/superadmin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          role: newRole,
          permissions: newPermissions
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setNewName('');
        setNewEmail('');
        fetchAdmins();
        showToast(`Administrator ${newName} created successfully.`);
      }
    } catch (err) {
      showToast('Failed to create administrator');
    }
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    const newStatus = admin.status === 'Active' ? 'Suspended' : 'Active';
    try {
      const res = await fetch('/api/superadmin/admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: admin.id, status: newStatus })
      });
      if (res.ok) {
        setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, status: newStatus } : a));
        showToast(`Admin ${admin.name} is now ${newStatus}.`);
      }
    } catch (err) {
      showToast('Failed to update admin status');
    }
  };

  const handleDeleteAdmin = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to revoke access for ${name}?`)) return;

    try {
      const res = await fetch(`/api/superadmin/admins?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAdmins(prev => prev.filter(a => a.id !== id));
        showToast(`Admin ${name} access has been revoked.`);
      }
    } catch (err) {
      showToast('Failed to delete admin');
    }
  };

  const filteredAdmins = admins.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || a.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#1E1E1B', color: '#FAF8F5', border: '1px solid #D4AF37', padding: '14px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', letterSpacing: '0.16em', color: '#D4AF37', textTransform: 'uppercase', fontWeight: 600 }}>
            ACCESS GOVERNANCE
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#FAF8F5', margin: '4px 0 0 0' }}>
            Administrators & Access Control
          </h1>
          <p style={{ fontSize: '13px', color: '#8E8880', margin: '4px 0 0 0' }}>
            Manage staff roles, permissions, security credentials, and active session status.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#D4AF37', color: '#000', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <span>+</span> Create New Administrator
        </button>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', backgroundColor: '#161614', padding: '16px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <input 
          type="text" 
          placeholder="Search administrators by name, email, or role..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '260px', padding: '10px 14px', backgroundColor: '#0D0D0C', border: '1px solid #2B2B28', borderRadius: '6px', color: '#FFF', fontSize: '13px', outline: 'none' }}
        />

        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ padding: '10px 16px', backgroundColor: '#0D0D0C', border: '1px solid #2B2B28', borderRadius: '6px', color: '#FAF8F5', fontSize: '13px', outline: 'none' }}
        >
          <option value="ALL">All Roles ({admins.length})</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Store Manager">Store Manager</option>
          <option value="Inventory Lead">Inventory Lead</option>
          <option value="Customer Support Lead">Customer Support Lead</option>
          <option value="Marketing Specialist">Marketing Specialist</option>
        </select>
      </div>

      {/* Admins Table */}
      <div style={{ backgroundColor: '#161614', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Loading Administrators...</div>
        ) : filteredAdmins.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#888' }}>No administrators found matching criteria.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#1E1E1B', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '16px 20px', fontSize: '11px', fontWeight: 600, color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Staff Member</th>
                <th style={{ padding: '16px 20px', fontSize: '11px', fontWeight: 600, color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Role & Privileges</th>
                <th style={{ padding: '16px 20px', fontSize: '11px', fontWeight: 600, color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                <th style={{ padding: '16px 20px', fontSize: '11px', fontWeight: 600, color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Last Activity</th>
                <th style={{ padding: '16px 20px', fontSize: '11px', fontWeight: 600, color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  
                  {/* Member Name & Avatar */}
                  <td style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: admin.role === 'Super Admin' ? '#D4AF37' : 'rgba(255,255,255,0.1)', color: admin.role === 'Super Admin' ? '#000' : '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                        {admin.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#FAF8F5' }}>{admin.name}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{admin.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role & Permissions */}
                  <td style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: admin.role === 'Super Admin' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.08)', color: admin.role === 'Super Admin' ? '#D4AF37' : '#FAF8F5', marginBottom: '6px' }}>
                      {admin.role}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {admin.permissions.map(p => (
                        <span key={p} style={{ fontSize: '10px', background: '#0D0D0C', color: '#8E8880', padding: '2px 6px', borderRadius: '3px', border: '1px solid #2B2B28' }}>
                          {p.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '18px 20px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      backgroundColor: admin.status === 'Active' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: admin.status === 'Active' ? '#81C784' : '#FCA5A5',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: admin.status === 'Active' ? '#81C784' : '#FCA5A5' }} />
                      {admin.status}
                    </span>
                  </td>

                  {/* Last Activity */}
                  <td style={{ padding: '18px 20px', fontSize: '12px', color: '#888' }}>
                    <div>{admin.lastLogin}</div>
                    <div style={{ fontSize: '10px', color: '#555' }}>Created: {admin.createdAt}</div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '18px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        onClick={() => handleToggleStatus(admin)}
                        style={{ background: 'transparent', border: '1px solid #333', color: admin.status === 'Active' ? '#FFB74D' : '#81C784', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        {admin.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                      {admin.role !== 'Super Admin' && (
                        <button
                          onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                          style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#EF5350', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Admin Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '100%', maxWidth: '520px', backgroundColor: '#161614', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '32px', boxShadow: '0 24px 48px rgba(0,0,0,0.8)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#FAF8F5', margin: 0 }}>
                Add New Administrator
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#A0988E', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Full Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="e.g. Radhika Sharma" 
                  required 
                  style={{ width: '100%', padding: '12px', background: '#0D0D0C', border: '1px solid #333', borderRadius: '6px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#A0988E', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Work Email</label>
                <input 
                  type="email" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                  placeholder="e.g. radhika.s@zevro.in" 
                  required 
                  style={{ width: '100%', padding: '12px', background: '#0D0D0C', border: '1px solid #333', borderRadius: '6px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#A0988E', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Governance Role</label>
                <select 
                  value={newRole} 
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#0D0D0C', border: '1px solid #333', borderRadius: '6px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                >
                  <option value="Store Manager">Store Manager (Catalog, Orders, Themes)</option>
                  <option value="Inventory Lead">Inventory Lead (Stock, Shipments)</option>
                  <option value="Customer Support Lead">Customer Support Lead (Orders, Returns)</option>
                  <option value="Marketing Specialist">Marketing Specialist (Coupons, Reports)</option>
                  <option value="Super Admin">Super Admin (Full Master Governance)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#A0988E', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>Granted Privileges</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: '#DDD' }}>
                  {[
                    { id: 'orders_manage', label: 'Manage Orders' },
                    { id: 'products_read_write', label: 'Edit Products' },
                    { id: 'reports_view', label: 'View Reports' },
                    { id: 'theme_edit', label: 'Theme Customizer' },
                    { id: 'inventory_manage', label: 'Inventory Control' },
                    { id: 'admin_management', label: 'Admin Security' }
                  ].map(perm => (
                    <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={newPermissions.includes(perm.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewPermissions([...newPermissions, perm.id]);
                          } else {
                            setNewPermissions(newPermissions.filter(p => p !== perm.id));
                          }
                        }}
                      />
                      <span>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 18px', background: 'transparent', border: '1px solid #333', color: '#FAF8F5', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 24px', background: '#D4AF37', border: 'none', color: '#000', fontWeight: 700, borderRadius: '6px', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Confirm & Provision
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
