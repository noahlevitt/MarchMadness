import React, { useState } from "react";
import { useUserSession } from "../../contexts/UserSessionContext";
import { changeBalance } from "../../utils/api";
import "./Profile.css";

const Profile = () => {
  const [newBalance, setNewBalance] = useState("");
  const {isLoggedIn, userEmail, balance, login, logout, updateBalance} = useUserSession();

  const handleBalanceUpdate = async () => {
    try {
      console.log('📥 [Profile] before add, balance =', balance)
      let a = parseInt(balance) + parseInt(newBalance);
      updateBalance(a);
      console.log('📥 [Profile] after addBalance, balance =', a)
      await changeBalance(userEmail, (a));
      alert("Balance Updated");
    } catch (error) {
      console.error("Balance update failed", error);
      alert("Failed to update balance");
    }
  };

  const handleBalanceWithdraw = async () => {
    try {
      console.log('📤 [Profile] before withdraw, balance =', balance)
      let a = parseInt(balance) - parseInt(newBalance);
      updateBalance(a);
      console.log('📤 [Profile] after withdraw, balance =', a)
      await changeBalance(userEmail, (a));
      alert("Balance Updated");
    } catch (error) {
      console.error("Balance update failed", error);
      alert("Failed to update balance");
    }
  };
  
  const handleLogout = () => {
    logout();
    alert("Logged out successfully!");
  };

  if (!isLoggedIn) {
    return (
    <div>
      <h1>Login to see your profile</h1>
    </div>)
  }
  
  return (
    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', alignSelf:'center', position: 'relative'}}>
      <div 
        style={{
          position: 'absolute',
          width: '50vw',
          height: '50vh',
          backgroundColor: '#f0f0f0',
          zIndex: '-1',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '10px'
        }}
      ></div>
      <h1>Hi, {userEmail}!</h1>
      <h2>Your balance is: {balance}</h2>
      <form onSubmit={handleBalanceUpdate}>
        <input 
          placeholder="balance" 
          value={newBalance}
          onChange={(e) => setNewBalance(e.target.value)}
        />  
      </form>
      <button style={{borderRadius:4}}onClick={handleBalanceUpdate} type="button">Add Money</button>
      <button style={{borderRadius:4}}onClick={handleBalanceWithdraw} type="button">Withdraw Money</button>
      <button style={{ borderRadius:4, marginTop: '1rem', backgroundColor: 'red' }} onClick={handleLogout} type="button">Logout</button>
    </div>
  )
}
  
export default Profile;