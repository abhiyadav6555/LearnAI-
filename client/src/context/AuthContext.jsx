
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  const [user, setUser] = useState(getStoredUser);

  const refreshAuth = useCallback(() => {
    setToken(localStorage.getItem("token"));
    setUser(getStoredUser());
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => refreshAuth();

    const handleStorageChange = (event) => {
      if (
        event.key === "token" ||
        event.key === "user" ||
        event.key === null
      ) {
        refreshAuth();
      }
    };

    window.addEventListener(
      "learnai-auth-change",
      handleAuthChange
    );

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "learnai-auth-change",
        handleAuthChange
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, [refreshAuth]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      logout,
      refreshAuth,
    }),
    [token, user, logout, refreshAuth]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
