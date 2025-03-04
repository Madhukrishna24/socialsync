import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

const NavBar = () => {
  const router = useRouter();
  const authState = useSelector(state => state.auth);

  // if(authState.isLoading) {
  //   return <div>Loading...</div>
  // }
  const dispath = useDispatch();
  return (
    <div className={styles.container}>
      <div
        className={styles.navBar}
        onClick={() => {
          router.push("/");
        }}
      >
        <h1>SocialSync</h1>
        <div className={styles.navOptionsContainer}>
          {authState.profileFetched && (
            <div className={styles.nameContainer}>
              <p>Hey, {authState.user.data.userId.name}</p>
            </div>
          )}
          {authState.profileFetched && (
            <div
              className={styles.buttonJoin}
              onClick={() => {
                router.push("/profile");
              }}
            >
              <p>Profile</p>
            </div>
          )}
          {authState.profileFetched && (
            <div
              className={styles.buttonJoin}
              onClick={() => {
                localStorage.removeItem("token");
                dispath(reset());
                router.push("/login");
              }}
            >
              <p>Logout</p>
            </div>
          )}
          {!authState.profileFetched && (
            <div
              className={styles.buttonJoin}
              onClick={() => {
                router.push("/login");
              }}
            >
              <p>Be a part</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
