
"use client";
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    // JWT tokens are in format: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getUserId = () => {
  const token = localStorage.getItem('usertoken');
  if (!token) return null;
  
  const decoded = decodeToken(token);

  
  return decoded?.sub || decoded?.userId || null;
};

export const isTokenValid = () => {
  const token = localStorage.getItem('usertoken');
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  // Check if token is expired
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
}; 