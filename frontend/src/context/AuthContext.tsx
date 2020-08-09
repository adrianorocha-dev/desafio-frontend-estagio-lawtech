import React, { useContext } from 'react';

import usePersistedState from '../hooks/usePersistedState';

export interface User {
  email: string;
  token: string;
}

const AuthContext = React.createContext<{
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}>({ user: undefined, setUser: () => {} });

export const useAuth = () => useContext(AuthContext);

const AuthContextWrapper: React.FC = ({ children }) => {
  const [user, setUser] = usePersistedState<User>('session');

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextWrapper;
