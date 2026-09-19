export const getAccess = () => localStorage.getItem('access');
export const getRefresh = () => localStorage.getItem('refresh');

export const setTokens = (access, refresh) => {
  localStorage.setItem('access', access);
  if (refresh) localStorage.setItem('refresh', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};