import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: any;
  role: string | null;
  login: (accessToken: string, refreshToken: string, role: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [user, setUser] = useState<any>(null);

  const parseJwt = (token: string): any => {
    try {
      return jwtDecode(token);
    } catch (e) {
      console.log("Token invalide");
      return null;
    }
  };

  useEffect(() => {
    if (accessToken) {
      const decoded = parseJwt(accessToken);
      if (decoded) {
        setUser(decoded);
      } else {
        logout();
      }
    }
  }, [accessToken]);

  const login = (
    newAccessToken: string,
    newRefreshToken: string,
    userRole: string
  ) => {
    const decoded = parseJwt(newAccessToken);

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setRole(userRole);
    setUser(decoded);

    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("role", userRole);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
    setUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, user, role, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;