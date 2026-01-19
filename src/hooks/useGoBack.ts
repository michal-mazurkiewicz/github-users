import { useNavigate } from 'react-router';

export const useGoBack = (fallbackPath = '/') => {
  const navigate = useNavigate();

  // Expose a custom back function for your in-app buttons
  const goBack = () => {
    const historyIndex = typeof window !== 'undefined' && typeof window.history.state?.idx === 'number' ? window.history.state.idx : 0;

    if (historyIndex > 0) {
      navigate(-1); // Go back one step in internal history
    } else {
      navigate(fallbackPath, { replace: true }); // Go to landing page and replace current entry
    }
  };

  return goBack;
};
