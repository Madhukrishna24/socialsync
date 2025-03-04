import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

const Login = () => {
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedin] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("token")) router.push("/dashboard");
  });

  useEffect(() => {
    dispatch(emptyMessage());
  }, [isLoggedIn]);

  const handleSignUp = (e) => {
    dispatch(
      registerUser({
        name,
        email,
        password,
        username,
      })
    );
  };

  const handleSignIn = (e) => {
    dispatch(
      loginUser({
        email,
        password,
      })
    );
  };
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardleft__heading}>
              {isLoggedIn ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: auth.isError ? "red" : "green" }}>
              {auth.message.message}
            </p>
            <div className={styles.inputContainer}>
              {!isLoggedIn && (
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Username"
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="name"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <input
                type="email"
                className={styles.inputField}
                placeholder="Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className={styles.inputField}
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <div
                className={styles.buttonContainer}
                onClick={() => {
                  if (isLoggedIn) handleSignIn();
                  else handleSignUp();
                }}
              >
                <p>{isLoggedIn ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>
          <div className={styles.cardContainer__right}>
            <div>
              {!isLoggedIn ? (
                <p>Already Have an Account?</p>
              ) : (
                <p>Don't Have an Account?</p>
              )}

              <div
                className={styles.buttonContainer}
                onClick={() => {
                  setIsLoggedin(!isLoggedIn);
                }}
              >
                <p style={{ textAlign: "center" }}>
                  {isLoggedIn ? "Sign Up" : "Sign In"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Login;
