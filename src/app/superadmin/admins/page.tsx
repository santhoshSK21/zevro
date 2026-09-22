'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  AlertTriangle, 
  ShieldCheck, 
  Users, 
  Lock, 
  CheckCircle2, 
  X,
  UserX
} from 'lucide-react';

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
  
  // Selection & Bulk Delete state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string[] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setTimeout(() => setToastMsg(''), 3500);
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

  const handleExecuteDelete = async () => {
    if (!confirmDelete || confirmDelete.length === 0) return;
    setIsDeleting(true);

    try {
      const res = await fetch('/api/superadmin/admins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: confirmDelete })
      });

      if (res.ok) {
        showToast(`Revoked access for ${confirmDelete.length} administrator(s).`);
        setSelectedIds(prev => prev.filter(id => !confirmDelete.includes(id)));
        setConfirmDelete(null);
        fetchAdmins();
      } else {
        throw new Error();
      }
    } catch (err) {
      showToast('Failed to revoke admin access');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAdmins = admins.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || a.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Root SuperAdmin (id: adm-001) is protected and cannot be deleted
  const deletableFiltered = filteredAdmins.filter(a => a.id !== 'adm-001');

  const handleSelectAll = () => {
    if (deletableFiltered.length > 0 && deletableFiltered.every(a => selectedIds.includes(a.id))) {
      setSelectedIds(prev => prev.filter(id => !deletableFiltered.some(a => a.id === id)));
    } else {
      const newIds = Array.from(new Set([...selectedIds, ...deletableFiltered.map(a => a.id)]));
      setSelectedIds(newIds);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (id === 'adm-001') return; // Protected
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isAllSelected = deletableFiltered.length > 0 && deletableFiltered.every(a => selectedIds.includes(a.id));

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: 'var(--font-body, sans-serif)' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#0F172A', color: '#FAF8F5', border: '1px solid #C5A880', padding: '14px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#C5A880" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', letterSpacing: '0.16em', color: '#C5A880', textTransform: 'uppercase', fontWeight: 600 }}>
            ACCESS GOVERNANCE
          </span>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '26px', color: '#FAF8F5', margin: '4px 0 0 0' }}>
            Administrators & Access Control
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
            Manage staff roles, security privileges, credentials, and batch access revocation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setConfirmDelete(selectedIds)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', backgroundColor: '#EF4444', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)' }}
            >
              <Trash2 size={14} />
              <span>Revoke Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', backgroundColor: '#C5A880', color: '#0F172A', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Plus size={15} /> Add Administrator
          </button>
        </div>
      </div>

      {/* Bulk Selection Notification Bar */}
      {selectedIds.length > 0 && (
        <div style={{ backgroundColor: '#1E293B', color: '#FAF8F5', border: '1px solid #334155', padding: '12px 20px', borderRadius: '6px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#C5A880', color: '#0F172A', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
              {selectedIds.length} SELECTED
            </span>
            <span>You have selected {selectedIds.length} staff administrator profile(s).</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={() => setSelectedIds([])}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear Selection
            </button>
            <button
              onClick={() => setConfirmDelete(selectedIds)}
              style={{ backgroundColor: '#EF4444', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <UserX size={13} /> Revoke Access for Selected
            </button>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center', backgroundColor: '#0F172A', padding: '14px 18px', borderRadius: '6px', border: '1px solid #1E293B' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input 
            type="text" 
            placeholder="Search by name, email, or role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '4px', color: '#FFF', fontSize: '13px', outline: 'none' }}
          />
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>

        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '4px', color: '#FAF8F5', fontSize: '13px', outline: 'none' }}
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
      <div style={{ backgroundColor: '#0F172A', borderRadius: '6px', border: '1px solid #1E293B', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>Loading Administrators...</div>
        ) : filteredAdmins.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>No administrators found matching criteria.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#1E293B', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '14px 16px', width: '48px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#C5A880' }}
                    title="Select all staff on this page"
                  />
                </th>
                <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Staff Member</th>
                <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role & Privileges</th>
                <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</th>
                <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Last Activity</th>
                <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => {
                const isSelected = selectedIds.includes(admin.id);
                const isRoot = admin.id === 'adm-001';

                return (
                  <tr 
                    key={admin.id} 
                    style={{ 
                      borderBottom: '1px solid #1E293B',
                      backgroundColor: isSelected ? 'rgba(197, 168, 128, 0.08)' : 'transparent',
                      transition: 'background-color 0.15s'
                    }}
                  >
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {isRoot ? (
                        <span title="Root SuperAdmin is protected from deletion" style={{ color: '#C5A880', fontSize: '11px' }}>🔒</span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(admin.id)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#C5A880' }}
                        />
                      )}
                    </td>

                    {/* Member Name & Avatar */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: isRoot ? '#C5A880' : '#1E293B', color: isRoot ? '#0F172A' : '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', border: '1px solid rgba(197, 168, 128, 0.3)' }}>
                          {admin.avatar}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FAF8F5' }}>{admin.name}</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>{admin.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Permissions */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '3px', background: isRoot ? 'rgba(197,168,128,0.2)' : 'rgba(255,255,255,0.06)', color: isRoot ? '#C5A880' : '#FAF8F5', marginBottom: '4px' }}>
                        {admin.role}
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {admin.permissions.slice(0, 3).map(p => (
                          <span key={p} style={{ fontSize: '9px', background: '#1E293B', color: '#94A3B8', padding: '2px 5px', borderRadius: '2px', border: '1px solid #334155' }}>
                            {p.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {admin.permissions.length > 3 && (
                          <span style={{ fontSize: '9px', color: '#64748B' }}>+{admin.permissions.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '16px 18px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: admin.status === 'Active' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: admin.status === 'Active' ? '#4ADE80' : '#FCA5A5',
                      }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: admin.status === 'Active' ? '#4ADE80' : '#FCA5A5' }} />
                        {admin.status}
                      </span>
                    </td>

                    {/* Last Activity */}
                    <td style={{ padding: '16px 18px', fontSize: '11px', color: '#94A3B8' }}>
                      <div>{admin.lastLogin}</div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Created: {admin.createdAt}</div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          style={{ background: '#1E293B', border: '1px solid #334155', color: admin.status === 'Active' ? '#FBBF24' : '#4ADE80', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          {admin.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                        {!isRoot && (
                          <button
                            onClick={() => setConfirmDelete([admin.id])}
                            title="Revoke Admin Access"
                            style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#EF4444', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(11, 17, 32, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#1E293B', border: '1px solid #334155', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 24px 48px rgba(0,0,0,0.5)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FAF8F5', marginBottom: '8px' }}>
              Revoke {confirmDelete.length} Administrator Access?
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.5, marginBottom: '24px' }}>
              This will permanently revoke console login credentials and permissions for the selected staff member(s).
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setConfirmDelete(null)} 
                disabled={isDeleting}
                style={{ flex: 1, padding: '12px', border: '1px solid #334155', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#94A3B8' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleExecuteDelete} 
                disabled={isDeleting}
                style={{ flex: 1, padding: '12px', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: isDeleting ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 700 }}
              >
                {isDeleting ? 'Revoking...' : `Confirm Revoke (${confirmDelete.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 17, 32, 0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '100%', maxWidth: '520px', backgroundColor: '#1E293B', border: '1px solid rgba(197, 168, 128, 0.3)', borderRadius: '8px', padding: '32px', boxShadow: '0 24px 48px rgba(0,0,0,0.8)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#FAF8F5', margin: 0 }}>
                Provision New Administrator
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', color: '#C5A880', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.08em' }}>Staff Full Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="e.g. Radhika Sharma" 
                  required 
                  style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '4px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', color: '#C5A880', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.08em' }}>Work Email Address</label>
                <input 
                  type="email" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                  placeholder="e.g. radhika.s@zevro.in" 
                  required 
                  style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '4px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', color: '#C5A880', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.08em' }}>Governance Role</label>
                <select 
                  value={newRole} 
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '4px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                >
                  <option value="Store Manager">Store Manager (Catalog, Orders, Themes)</option>
                  <option value="Inventory Lead">Inventory Lead (Stock, Shipments)</option>
                  <option value="Customer Support Lead">Customer Support Lead (Orders, Returns)</option>
                  <option value="Marketing Specialist">Marketing Specialist (Coupons, Reports)</option>
                  <option value="Super Admin">Super Admin (Full Master Governance)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', color: '#C5A880', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.08em' }}>Granted Privileges</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: '#CBD5E1' }}>
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
                        style={{ accentColor: '#C5A880' }}
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
                  style={{ padding: '10px 18px', background: 'transparent', border: '1px solid #334155', color: '#FAF8F5', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 24px', background: '#C5A880', border: 'none', color: '#0F172A', fontWeight: 700, borderRadius: '4px', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer' }}
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
