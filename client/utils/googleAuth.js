// Helper functions for Google authentication

// Load the Google API script
export const loadGoogleScript = (callback) => {
  // Check if script is already loaded
  if (typeof window !== 'undefined' && window.gapi) {
    if (callback) callback();
    return;
  }
  
  // Create script element
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api:client.js';
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    if (callback) callback();
  };
  
  // Add script to document
  document.body.appendChild(script);
};

// Initialize Google Auth
export const initGoogleAuth = (clientId, callback) => {
  if (!window.gapi) {
    console.error('Google API not loaded');
    return;
  }
  
  window.gapi.load('auth2', () => {
    try {
      window.gapi.auth2.init({
        client_id: clientId,
        cookiepolicy: 'single_host_origin',
      }).then(() => {
        if (callback) callback(window.gapi.auth2.getAuthInstance());
      });
    } catch (error) {
      console.error('Error initializing Google Auth', error);
    }
  });
};

// Render Google Sign-In button
export const renderGoogleButton = (elementId, options = {}) => {
  if (!window.gapi || !window.gapi.signin2) {
    console.error('Google Sign-In API not loaded');
    return;
  }
  
  try {
    window.gapi.signin2.render(elementId, {
      scope: 'profile email',
      width: options.width || 240,
      height: options.height || 50,
      longtitle: options.longtitle || true,
      theme: options.theme || 'dark',
      onsuccess: options.onsuccess || null,
      onfailure: options.onfailure || null
    });
  } catch (error) {
    console.error('Error rendering Google button', error);
  }
};
