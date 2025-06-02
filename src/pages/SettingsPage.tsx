// import React, { useState, useEffect } from 'react';
// import './SettingsPage.css';

// interface SettingsPageProps {
//   theme: 'light' | 'dark';
// }

// const SettingsPage: React.FC<SettingsPageProps> = ({ theme }) => {
//   // Theme state and toggle are now managed by App component
//   const [units, setUnits] = useState<'metric' | 'imperial'>(() =>
//     (localStorage.getItem('units') as 'metric' | 'imperial' | null) || 'metric'
//   );
//   const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() =>
//     localStorage.getItem('notificationsEnabled') === 'true'
//   );

//   useEffect(() => {
//     localStorage.setItem('units', units);
//   }, [units]);

//   useEffect(() => {
//     localStorage.setItem('notificationsEnabled', String(notificationsEnabled));
//   }, [notificationsEnabled]);

//   const handleUnitsToggle = () => {
//     setUnits(prevUnits => {
//       const newUnits = prevUnits === 'metric' ? 'imperial' : 'metric';
//       alert(`Units switched to ${newUnits}. This is a mock-up; data display will not change yet.`);
//       return newUnits;
//     });
//   };

//   const handleNotificationsToggle = () => {
//     setNotificationsEnabled(prev => {
//       alert(`Notifications ${!prev ? 'enabled' : 'disabled'}.`);
//       return !prev;
//     });
//   };

//   const handleExportData = () => {
//     alert('Exporting your data... (Mock functionality)');
//   };

//   const handleImportData = () => {
//     alert('Importing data... (Mock functionality - this would typically open a file dialog)');
//   };

//   return (
//     <div className="settings-view-container">
//       <h2 id="settings-heading" className="section-title">Settings</h2>

//       <section className={`settings-section card-style ${theme === 'dark' ? 'dark-theme' : ''}`} aria-labelledby="user-prefs-heading">
//         <h3 id="user-prefs-heading" className="settings-section-title">User Preferences</h3>


//         <div className="setting-item">
//           <span className="setting-item-label" id="units-label">Measurement Units</span>
//           <div className="toggle-switch-container" role="group" aria-labelledby="units-label">
//             <button
//               role="switch"
//               aria-checked={units === 'imperial'}
//               onClick={handleUnitsToggle}
//               className="toggle-switch"
//               aria-label={`Switch to ${units === 'metric' ? 'Imperial' : 'Metric'} units`}
//             >
//               <span className="toggle-switch-label">{units === 'metric' ? 'Metric (km, kg)' : 'Imperial (miles, lbs)'}</span>
//               <span className="toggle-switch-handle" />
//             </button>
//           </div>
//         </div>

//         <div className="setting-item">
//           <span className="setting-item-label" id="notifications-label">Email Notifications</span>
//           <div className="toggle-switch-container" role="group" aria-labelledby="notifications-label">
//             <button
//               role="switch"
//               aria-checked={notificationsEnabled}
//               onClick={handleNotificationsToggle}
//               className="toggle-switch"
//               aria-label={`Switch to ${notificationsEnabled ? 'Disable' : 'Enable'} email notifications`}
//             >
//               <span className="toggle-switch-label">{notificationsEnabled ? 'Enabled' : 'Disabled'}</span>
//               <span className="toggle-switch-handle" />
//             </button>
//           </div>
//         </div>
//       </section>

//       <section className={`settings-section card-style ${theme === 'dark' ? 'dark-theme' : ''}`} aria-labelledby="data-management-heading">
//         <h3 id="data-management-heading" className="settings-section-title">Data Management</h3>
//         <div className="setting-item">
//           <button onClick={handleExportData} className="settings-button">Export Data</button>
//         </div>
//         <div className="setting-item">
//           <button onClick={handleImportData} className="settings-button">Import Data</button>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default SettingsPage;
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import './SettingsPage.css';

interface SettingsPageProps {
  theme: 'light' | 'dark';
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme }) => {
  const [units, setUnits] = useState<'metric' | 'imperial'>(() =>
    (localStorage.getItem('units') as 'metric' | 'imperial' | null) || 'metric'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() =>
    localStorage.getItem('notificationsEnabled') === 'true'
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string>('');
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('units', units);
  }, [units]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', String(notificationsEnabled));
  }, [notificationsEnabled]);

  const handleUnitsToggle = () => {
    setUnits(prevUnits => {
      const newUnits = prevUnits === 'metric' ? 'imperial' : 'metric';
      alert(`Units switched to ${newUnits}. This is a mock-up; data display will not change yet.`);
      return newUnits;
    });
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(prev => {
      alert(`Notifications ${!prev ? 'enabled' : 'disabled'}.`);
      return !prev;
    });
  };

  const handleExportData = () => {
    alert('Exporting your data... (Mock functionality)');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadSuccessMessage('');
      setUploadErrorMessage('');
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadErrorMessage('Please select a file first.');
      return;
    }

    setIsLoadingUpload(true);
    setUploadSuccessMessage('');
    setUploadErrorMessage('');

    const formData = new FormData();
    formData.append('fitfile', selectedFile); // 'activityFile' is the field name your API expects

    try {
      const response = await fetch('http://localhost:8080/activities/upload', { // Ensure this matches your API endpoint
        method: 'POST',
        body: formData,
        // Headers might be needed depending on your API (e.g., for auth, if not using simple POST)
        // headers: {
        //   // 'Authorization': 'Bearer YOUR_TOKEN_IF_NEEDED', 
        //   // 'Content-Type': 'multipart/form-data' is usually set automatically by fetch with FormData
        // },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Assuming the API returns JSON with a success message
      const result = await response.json();
      setUploadSuccessMessage(result.message || 'File uploaded successfully!');
      setSelectedFile(null); // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input visually
      }

    } catch (error) {
      if (error instanceof Error) {
        setUploadErrorMessage(`Error uploading file: ${error.message}`);
      } else {
        setUploadErrorMessage('An unexpected error occurred during upload.');
      }
      console.error("Upload error:", error);
    } finally {
      setIsLoadingUpload(false);
    }
  };

  return (
    <div className="settings-view-container">
      <h2 id="settings-heading" className="section-title">Settings</h2>

      <section className={`settings-section card-style ${theme === 'dark' ? 'dark-theme' : ''}`} aria-labelledby="user-prefs-heading">
        <h3 id="user-prefs-heading" className="settings-section-title">User Preferences</h3>

        <div className="setting-item">
          <span className="setting-item-label" id="units-label">Measurement Units</span>
          <div className="toggle-switch-container" role="group" aria-labelledby="units-label">
            <button
              role="switch"
              aria-checked={units === 'imperial'}
              onClick={handleUnitsToggle}
              className="toggle-switch"
              aria-label={`Switch to ${units === 'metric' ? 'Imperial' : 'Metric'} units`}
            >
              <span className="toggle-switch-label">{units === 'metric' ? 'Metric (km, kg)' : 'Imperial (miles, lbs)'}</span>
              <span className="toggle-switch-handle" />
            </button>
          </div>
        </div>

        <div className="setting-item">
          <span className="setting-item-label" id="notifications-label">Email Notifications</span>
          <div className="toggle-switch-container" role="group" aria-labelledby="notifications-label">
            <button
              role="switch"
              aria-checked={notificationsEnabled}
              onClick={handleNotificationsToggle}
              className="toggle-switch"
              aria-label={`Switch to ${notificationsEnabled ? 'Disable' : 'Enable'} email notifications`}
            >
              <span className="toggle-switch-label">{notificationsEnabled ? 'Enabled' : 'Disabled'}</span>
              <span className="toggle-switch-handle" />
            </button>
          </div>
        </div>
      </section>

      <section className={`settings-section card-style ${theme === 'dark' ? 'dark-theme' : ''}`} aria-labelledby="data-management-heading">
        <h3 id="data-management-heading" className="settings-section-title">Data Management</h3>
        <div className="setting-item">
          <button onClick={handleExportData} className="settings-button">Export Data</button>
        </div>
        {/* <div className="setting-item">
          <button onClick={handleImportData} className="settings-button">Import Data (Old)</button>
        </div> */}
        <div className="upload-activity-section">
          <h4>Upload Activity File</h4>
          <div className="file-upload-control">
            <label htmlFor="activity-file-upload" className="file-upload-label settings-button">
              {selectedFile ? selectedFile.name : 'Choose File (.gpx, .fit, .tcx)'}
            </label>
            <input
              type="file"
              id="activity-file-upload"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".gpx,.fit,.tcx"
              aria-describedby="file-upload-feedback"
              className="file-upload-input"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={isLoadingUpload || !selectedFile}
            className="upload-button settings-button"
            aria-live="polite"
          >
            {isLoadingUpload ? 'Uploading...' : 'Upload File'}
          </button>
          <div id="file-upload-feedback" className="upload-feedback" aria-live="assertive">
            {isLoadingUpload && <p className="upload-message loading">Uploading, please wait...</p>}
            {uploadSuccessMessage && <p className="upload-message success">{uploadSuccessMessage}</p>}
            {uploadErrorMessage && <p className="upload-message error">{uploadErrorMessage}</p>}
          </div>
        </div>
      </section>

      <section className={`settings-section card-style ${theme === 'dark' ? 'dark-theme' : ''}`} aria-labelledby="about-heading">
        <h3 id="about-heading" className="settings-section-title">About</h3>
        <div className="setting-item">
          <span>App Version:</span>
          <span>1.0.0</span>
        </div>
        <div className="setting-item">
          <button onClick={() => alert('Navigating to Help & FAQ... (Mock functionality)')} className="settings-button">
            Help & FAQ
          </button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;