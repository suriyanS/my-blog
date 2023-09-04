import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";

const CreateAccountPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassowrd, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const creatAccount = async () => {
    try {
      if (password !== confirmPassowrd) {
        setError("Password and confirm password do not match");
        return;
      }
      await createUserWithEmailAndPassword(getAuth(), email, password);
      navigate("/articles");
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <>
      <h1>Create Account</h1>
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
      <input
        placeholder="Re-enter Your password"
        type="password"
        value={confirmPassowrd}
        onChange={(e) => setConfirmPassword(e.target.value)}
      ></input>
      <button onClick={creatAccount}>Create Account</button>
      <Link to="/login">Already have an account? Log in here</Link>
    </>
  );
};

export default CreateAccountPage;
