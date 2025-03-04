import { BASE_URL } from "@/config";
import {
  acceptConnection,
  getAllProfiles,
  getConnectionRequests,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";
import DashBoardLayout from "@/layout/DashBoardLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

const MyConnections = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(getMyConnectionRequests());
  }, [authState.connectionrequests]);

 

  useEffect(() => {
    dispatch(getConnectionRequests());
  }, [authState.connectionRequests]);

  return (
    <DashBoardLayout>
      <div>
        <h1>My Connection Requests</h1>
        {authState.connectionRequests &&
          authState.connectionRequests.length > 0 && (
            <div className={styles.mainContainer}>
              {authState.connectionRequests
                .filter((connection) => connection.status_accepted === null)
                .map((connection) => {
                  return (
                    <div
                      className={styles.userCard}
                      key={connection._id}
                      onClick={(e) => {
                        router.push(
                          `/view_profile/${connection.userId.username}`
                        );
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1.2rem",
                        }}
                      >
                        <div className={styles.profilePicture}>
                          <img
                            src={`${BASE_URL}${connection.userId.profilePicture}`}
                            alt="Profile picture"
                          />
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{connection.connectionId.name}</h3>
                          <p style={{ color: "gray" }}>
                            {connection.userId.username}
                          </p>
                        </div>
                      </div>
                      <div>
                        <button
                          className={styles.connectBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              sendConnectionRequest(connection.userId._id)
                            );
                            dispatch(
                              acceptConnection({
                                connectionId: connection._id,
                                action: "accept",
                              })
                            );
                            dispatch(getConnectionRequests());
                          }}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
      </div>
      <div>
        <h1>My Network</h1>
        <div className={styles.mainContainer}>
          {authState.connections &&
            authState.connections
              .filter((connection) => connection.status_accepted !== null)
              .map((connection) => {
                return (
                  <div
                    className={styles.userCard}
                    key={connection._id}
                    onClick={(e) => {
                      router.push(
                        `/view_profile/${connection.connectionId.username}`
                      );
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                      }}
                    >
                      <div className={styles.profilePicture}>
                        <img
                          src={`${BASE_URL}${connection.connectionId.profilePicture}`}
                          alt="Profile picture"
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{connection.connectionId.name}</h3>
                        <p style={{ color: "gray" }}>
                          {connection.connectionId.username}
                        </p>
                      </div>
                    </div>
                    <div></div>
                  </div>
                );
              })}
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default MyConnections;
