import { createContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/api";
import { storageKeys } from "../data/mockData";
import { logError, logInfo } from "../utils/logger";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(storageKeys.authUser);
      const storedToken = localStorage.getItem(storageKeys.token);

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setRole(parsedUser?.role || null);
        setToken(storedToken);
      }
    } catch (error) {
      logError("Failed to restore auth state", error);
      localStorage.removeItem(storageKeys.authUser);
      localStorage.removeItem(storageKeys.token);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  function persistSession(authPayload) {
    const tokenValue = authPayload?.token;
    const userValue = authPayload?.user;

    if (tokenValue) {
      localStorage.setItem(storageKeys.token, tokenValue);
      setToken(tokenValue);
    }

    if (userValue) {
      localStorage.setItem(storageKeys.authUser, JSON.stringify(userValue));
      setCurrentUser(userValue);
      setRole(userValue?.role || null);
    }
  }

  async function login(credentials) {
    try {
      logInfo("Login started", credentials.email);

      const response = await loginUser(credentials);
      const authPayload = response?.data || response;

      persistSession(authPayload);

      return authPayload.user;
    } catch (error) {
      logError("Login failed", error);
      throw error;
    }
  }

  async function register(registrationData) {
    try {
      logInfo("Registration started", registrationData.email);

      const response = await registerUser(registrationData);
      const authPayload = response?.data || response;

      persistSession(authPayload);

      return authPayload.user;
    } catch (error) {
      logError("Registration failed", error);
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem(storageKeys.token);
    localStorage.removeItem(storageKeys.authUser);

    setCurrentUser(null);
    setRole(null);
    setToken(null);
  }

  const value = {
    currentUser,
    role,
    token,
    isAuthLoading,
    isAuthenticated: Boolean(currentUser && token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}