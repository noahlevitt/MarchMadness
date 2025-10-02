import { createContext, useState, useContext } from "react";
import { fetchBalance } from "../utils/api";               // ← 1) import

const UserSessionContext = createContext({
  isLoggedIn: false,
  userId: null,
  userEmail: null,
  balance: 0.00,
  login: () => {},
  logout: () => {},
  updateBalance: () => {},
  refreshBalance: () => {},                              // ← add to default
});

export const UserSessionProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const loggedInStatus = sessionStorage.getItem("isLoggedIn");
    const email = sessionStorage.getItem("userEmail");
    return loggedInStatus === "true" && !!email;
  });

  const [userEmail, setUserEmail] = useState(
    () => sessionStorage.getItem("userEmail") || null
  );

  const [userId, setUserId] = useState(
    () => sessionStorage.getItem("userId") || null
  );

  const [balance, setBalance] = useState(() => {
    const stored = sessionStorage.getItem("balance");
    return stored != null ? parseFloat(stored) : 0.00;
  });

  const login = (email, id, initialBalance = 0) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserId(id);
    setBalance(initialBalance);
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userId", id.toString());
    sessionStorage.setItem("balance", initialBalance.toString());
    refreshBalance();      
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserId(null);
    setBalance(0);
    sessionStorage.clear();
  };

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
    sessionStorage.setItem("balance", newBalance.toString());
  };

  // ← 2) refreshBalance pulls the live value from the backend:
  const refreshBalance = async () => {
    if (!userEmail) return;
    try {
      const live = await fetchBalance(userEmail);
      if (live != null) {
        setBalance(live);
        sessionStorage.setItem("balance", live.toString());
      }
    } catch (err) {
      console.error("Could not refresh balance:", err);
    }
  };
  

  return (
    <UserSessionContext.Provider
      value={{
        isLoggedIn,
        userId,
        userEmail,
        balance,
        login,
        logout,
        updateBalance,
        refreshBalance,                               // ← 3) expose it
      }}
    >
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => useContext(UserSessionContext);

export default UserSessionProvider;
