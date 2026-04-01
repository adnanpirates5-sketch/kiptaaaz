import React from "react";
import { useTranslation } from "../theme/TranslationContext";

const Profile = () => {
  const { t } = useTranslation();
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="profile-section">
      <h3>{t('profile')}</h3>
      <div className="profile-details">
        <div className="profile-item">
          <label>{t('name')}:</label>
          <span>{user.name || 'N/A'}</span>
        </div>
        <div className="profile-item">
          <label>{t('email')}:</label>
          <span>{user.email || 'N/A'}</span>
        </div>
        <div className="profile-item">
          <label>{t('joined')}:</label>
          <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;