import clientServer, { BASE_URL } from "@/config";
import DashBoardLayout from "@/layout/DashBoardLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { connect, useDispatch, useSelector } from "react-redux";
import { getAllposts } from "@/config/redux/action/postAction";
import {
  getConnectionRequests,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";

const ViewProfile = ({ profileData }) => {
  const router = useRouter();
  const postState = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [userPosts, setUserPosts] = useState([]);
  const [isConnectionNull, setIsConnectionNull] = useState(false);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);

  const getUsersInfo = async () => {
    await dispatch(getAllposts());
    await dispatch(getConnectionRequests());
    await dispatch(getMyConnectionRequests())
  };
  

  useEffect(() => {
    getUsersInfo();
  }, []);

  useEffect(() => {
    if (postState.posts && postState.posts.length) {
      const post = postState.posts.filter(
        (post) => post.userId.username === router.query.username
      );
      setUserPosts(post);
    }
  }, [postState.posts, router.query.username]);

  useEffect(() => {
    if (
      profileData &&
      authState.connections &&
      authState.connections.length
    ) {
      const connection = authState.connections.find(
        (user) => user.connectionId._id === profileData.userId._id
      );

      if (connection) {
        setIsCurrentUserInConnection(true);
        

        if (connection.status_accepted === null) {
          setIsConnectionNull(true);
        }

        if (connection.status_accepted === true) {
            setIsCurrentUserInConnection(true);
        }
        
      }
    }
   
  }, [authState.connections, authState.connectionRequests]);
  

  return (
    <DashBoardLayout>
      <div className={styles.container}>
        <div className={styles.backDropContainer}>
          <img src={`${BASE_URL}${profileData.userId.profilePicture}`} alt="" />
        </div>

        <div className={styles.profileContainer__details}>
          <div style={{ display: "flex", gap: "0.7rem" }}>
            <div style={{ flex: "0.8" }}>
              <div
                style={{
                  display: "flex",
                  width: "fit-content",
                  alignItems: "center",
                  gap: "1.5rem",
                }}
              >
                <h2>{profileData.userId.name}</h2>
                <p style={{ color: "gray" }}>{profileData.userId.username}</p>
              </div>
              <div style={{ display: "flex", gap: "2rem" , alignItems: "center"}}>
                {isCurrentUserInConnection ? (
                  <button className={styles.connectedButton}>
                    {isConnectionNull ? "Pending" : "Connected"}
                  </button>
                ) : (
                  <button
                    className={styles.connectBtn}
                    onClick={() => {
                      dispatch(sendConnectionRequest(profileData.userId._id));
                    }}
                  >
                    Connect
                  </button>
                )}
                <div onClick={async() => {
                    const response = await clientServer.get("/download/profile",{
                      params : {
                        id: profileData.userId._id
                      }
                    });
                    window.open(`${BASE_URL}${response.data.message}`, "_blank")

                }}>
                  <svg style={{width: "1.2em", cursor: "pointer"}}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p>{profileData.bio}</p>
              </div>
            </div>

            <div style={{ flex: "0.2" }}>
              <h3>Recent Activity</h3>
              {userPosts.map((post) => {
                return (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div className={styles.card__profileContainer}>
                        {post.media !== "" ? (
                          <img
                            src={`${BASE_URL}posts/${post.media}`}
                            alt="User post"
                          />
                        ) : (
                          <div
                            style={{ width: "3.4rem", height: "3.4rem" }}
                          ></div>
                        )}
                      </div>
                      <p style={{ paddingBlock: "1rem", fontWeight: "bold" }}>
                        {post.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.workHistory}>
          <h3>Work History</h3>
          <div className={styles.workHistory__Container}>
            {profileData.pastWork.length === 0 ? (
              <p>Fresher</p>
            ) : (
              profileData.pastWork.map((work, index) => {
                return (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export async function getServerSideProps(context) {
  try {
    const response = await clientServer.get("/user/get_profile", {
      params: {
        username: context.query.username,
      },
    });
    

    return {
      props: {
        profileData: response.data.profile,
      },
    };
  } catch (error) {
    console.error("Error fetching profile data", error);
    return {
      props: {
        profileData: null,
      },
    };
  }
}

export default ViewProfile;
