import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const logIn = async () => {
    try {
      const auth = getAuth(); // Initialize Firebase auth
      await signInWithEmailAndPassword(auth, email, password);
      // Retrieve the user's ID token after successful login
      const user = auth.currentUser;
      if (user) {
        const authToken = await user.getIdToken();

        // Send the authToken in the request headers
        const response = await axios.get("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.status === 200) {
          // Successfully sent the token to the server
          navigate("/articles");
        } else {
          // Handle server response errors
          setError("Failed to send token to the server");
        }
      } else {
        // Handle user not found
        setError("User not found");
      }
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <>
      <h1>Log In</h1>
      {error && <p className="error">{error}</p>}
      <input
        placeholder="Your email address"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        placeholder="Your password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button onClick={logIn}>Log In</button>
      <Link to="/create-account">Don't have an account? Create one here</Link>
    </>
  );
};

export default LoginPage;
