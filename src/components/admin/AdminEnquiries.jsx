// src/components/admin/AdminEnquiries.jsx
import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const AdminEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const res = await API.get('/admin/enquiries');
            setEnquiries(res.data);
        } catch (error) {
            toast.error('Failed to fetch enquiries');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/admin/enquiries/${id}`, { status });
            toast.success(`Enquiry marked as ${status}`);
            fetchEnquiries();
        } catch (error) {
            toast.error('Failed to update enquiry');
        }
    };

    const deleteEnquiry = async (id) => {
        if (!window.confirm('Delete this enquiry?')) return;
        try {
            await API.delete(`/admin/enquiries/${id}`);
            toast.success('Enquiry deleted');
            fetchEnquiries();
        } catch (error) {
            toast.error('Failed to delete enquiry');
        }
    };

    const handleCall = (phone) => {
        if (phone) {
            window.location.href = `tel:${phone}`;
        } else {
            toast.error('No phone number available');
        }
    };

    const filteredEnquiries = enquiries.filter(e =>
        e.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loading">Loading enquiries...</div>;
    }

    return (
        <div className="admin-enquiries">
            <h2>📩 Enquiry Management</h2>
            <div className="admin-toolbar">
                <input
                    type="text"
                    placeholder="Search enquiries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="total-enquiries">Total: {filteredEnquiries.length}</span>
            </div>

            {filteredEnquiries.length === 0 ? (
                <div className="admin-empty">No enquiries found</div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnquiries.map(e => (
                                <tr key={e.id}>
                                    <td>
                                        <strong>{e.user_name}</strong>
                                        <br />
                                        <span className="sub-text">{e.user_email}</span>
                                    </td>
                                    <td>
                                        {e.phone ? (
                                            <div className="phone-cell">
                                                <span className="phone-number">{e.phone}</span>
                                                <button
                                                    className="btn-call"
                                                    onClick={() => handleCall(e.phone)}
                                                    title="Call now"
                                                >
                                                    📞
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="no-phone">N/A</span>
                                        )}
                                    </td>
                                    <td>{e.city}</td>
                                    <td className="message-cell">{e.message}</td>
                                    <td>
                                        <span className={`status-badge ${e.status}`}>
                                            {e.status}
                                        </span>
                                    </td>
                                    <td>{new Date(e.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-edit"
                                                onClick={() => updateStatus(e.id, 'contacted')}
                                            >
                                                Reply
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => deleteEnquiry(e.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminEnquiries;