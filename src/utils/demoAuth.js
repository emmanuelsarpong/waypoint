// Emergency demo authentication for CEO presentation
export const demoLogin = () => {
  const demoToken = btoa(JSON.stringify({
    id: 'demo-user-123',
    email: 'demo@waypoint.com',
    firstName: 'Demo',
    lastName: 'User',
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
  }));
  
  localStorage.setItem('authToken', demoToken);
  return demoToken;
};

export const isDemoMode = () => {
  return import.meta.env.MODE === 'development' || window.location.search.includes('demo=true');
};
