import { BASE_URL } from "@/config";
import { getAllProfiles } from "@/config/redux/action/authAction";
import DashBoardLayout from "@/layout/DashBoardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css"
import { useRouter } from "next/router";

const Discover = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllProfiles());
    }
  }, []);
  return (
    <DashBoardLayout>
      <div>
        <h1>Discover</h1>
        <dic className={styles.allUserProfiles}>
          {authState.all_profiles_fetched &&
            authState.all_profiles.map((profile) => {
              return (
                <div onClick={() => {
                  router.push(`/view_profile/${profile.userId.username}`);
                }}   key={profile._id} className={styles.userCard}>
                  <img className={styles.userCard__image}
                    src={`${BASE_URL}${profile.userId.profilePicture}`}
                    alt="Image"
                  />
                  <div>
                    <h1>{profile.userId.name}</h1>
                    <p style={{color: "gray"}}>{profile.userId.username}</p>
                  </div>
                </div>
              );
            })}
        </dic>
      </div>
    </DashBoardLayout>
  );
};

export default Discover;
