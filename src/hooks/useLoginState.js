import { useSelector } from 'react-redux';

const useLoginState = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated;
};

export default useLoginState;