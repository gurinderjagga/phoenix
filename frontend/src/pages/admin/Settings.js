import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import apiService from '../../utils/api';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';

const Settings = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', zipCode: '', country: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', isError: false });

  useBodyScrollLock(alertModal.isOpen);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProfile();
      if (data) {
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || { street: '', city: '', state: '', zipCode: '', country: '' }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await apiService.updateProfile(profile);
      setAlertModal({ isOpen: true, message: 'Settings updated successfully', isError: false });
    } catch (error) {
      console.error('Error updating settings:', error);
      setAlertModal({ isOpen: true, message: 'Failed to update settings', isError: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-widest">
            Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your dealership profile and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-4 sm:p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 uppercase">Profile Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 px-3 min-h-[48px] focus:ring-black focus:border-black text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal text-xs">(read only)</span></label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="block w-full border border-gray-200 bg-gray-50 px-3 min-h-[48px] text-gray-500 cursor-not-allowed text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 px-3 min-h-[48px] focus:ring-black focus:border-black text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 uppercase">Dealership Address</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                name="address.street"
                value={profile.address?.street}
                onChange={handleChange}
                className="block w-full border border-gray-300 px-3 min-h-[48px] focus:ring-black focus:border-black text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" name="address.city" value={profile.address?.city} onChange={handleChange}
                  className="block w-full border border-gray-300 px-3 min-h-[48px] focus:ring-black focus:border-black text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                <input type="text" name="address.state" value={profile.address?.state} onChange={handleChange}
                  className="block w-full border border-gray-300 px-3 min-h-[48px] focus:ring-black focus:border-black text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip / Postal Code</label>
                <input type="text" name="address.zipCode" value={profile.address?.zipCode} onChange={handleChange}
                  className="block w-full border border-gray-300 px-3 min-h-[48px] focus:ring-black focus:border-black text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" name="address.country" value={profile.address?.country} onChange={handleChange}
                  className="block w-full border border-gray-300 px-3 min-h-[48px] focus:ring-black focus:border-black text-sm" />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 min-h-[48px] bg-black text-white uppercase tracking-widest text-sm font-bold disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-sm p-8 shadow-2xl relative text-center border-t-4 border-black">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center border-2 ${alertModal.isError ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
              {alertModal.isError ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
              )}
            </div>
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 mb-2">
              {alertModal.isError ? 'Action Failed' : 'Success'}
            </h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              {alertModal.message}
            </p>
            <button
              className="w-full bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em]"
              onClick={() => setAlertModal({ isOpen: false, message: '', isError: false })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default Settings;
