import DashBoardLayout from "@/layout/DashBoardLayout";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import clientServer, { BASE_URL } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, updateUserData, updateUserProfile } from "@/config/redux/action/authAction";

const Profile = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);
  const [profileData, setProfileData] = useState([]);
  const [userPosts, setUserPosts] = useState();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    education: [],
    bio: "",
    pastWork: [],
    currentPostion: "",
    password: ""
  });

  useEffect(() => {
    dispatch(getAboutUser()).then(() => setLoading(false));

    if (postState.posts && postState.posts.length) {
      const post = postState.posts.filter(
        (post) =>
          post.userId.username === authState.user?.data?.userId?.username
      );
      setUserPosts(post);
    }
  }, [postState.posts]);

  useEffect(() => {
    setProfileData(authState.user);
    if (authState.user) {
      setUpdatedData({
        ...updatedData,
        username: authState.user.data.userId.username,
        email: authState.user.data.userId.email,
        name: authState.user.data.userId.name,
        bio: authState.user.data.bio,
        pastWork: [...authState.user.data.pastWork],
        education: [...authState.user.data.education],
        currentPostion: authState.user.data.currentPostion,
      });
    }
  }, [authState.user]);

  const uploadProfile = async (file) => {
    const formData = new FormData();
    formData.append("picture", file);
    formData.append("token", localStorage.getItem("token"));

    await clientServer.post("/update/profile_pic", formData, {
      headers: {
        "Content-Type": "multipart/from-data",
      },
    });
    dispatch(getAboutUser());
  };

  const handleUpdateSubmit = async(e) => {
    e.preventDefault();
    if(authState.user.data.userId.username)
    await dispatch(updateUserProfile(updatedData));
    await dispatch(updateUserData(updatedData));
    
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashBoardLayout>
      {authState?.user?.data && profileData?.data && (
        <div className={styles.container}>
          {isEditing && (
            <div className={styles.editContainer}>
              <div className={styles.editBoxContainer}>
                <div
                  className={styles.cancel__btn}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <svg
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
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <h4>Update Profile</h4>
                <p
                  style={{
                    color: authState.isError ? "red" : "green",
                    textAlign: "center",
                  }}
                > 
                  {authState.message !== "" && authState.message}
                </p>

                <div className={styles.userInfo}>
                  <div className={styles.userName__container}>
                    <input
                      type="text"
                      name="username"
                      value={updatedData.username}
                      onChange={(e) => {
                        setUpdatedData({
                          ...updatedData,
                          username: e.target.value,
                        });
                      }}
                    />
                    <input
                      type="text"
                      name="name"
                      value={updatedData.name}
                      onChange={(e) =>
                        setUpdatedData({ ...updatedData, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className={styles.userInfo}>
                  <textarea
                    className={styles.textarea}
                    name="bio"
                    value={updatedData.bio}
                    onChange={(e) =>
                      setUpdatedData({ ...updatedData, bio: e.target.value })
                    }
                  ></textarea>
                </div>

                <div className={styles.userInfo}>
                  <input
                    type="text"
                    name="email"
                    value={updatedData.email}
                    onChange={(e) => {
                      setUpdatedData({
                        ...updatedData,
                        email: e.target.value,
                      });
                    }}
                  />
                </div>

                <div className={styles.userInfo}>
                  <input
                    type="text"
                    name="currentposition"
                    value={updatedData.currentPostion}
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        currentPostion: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.userInfo}>
                  <h5 style={{ textAlign: "left" }}>Past Work</h5>
                  {updatedData.pastWork.length !== 0 &&
                    updatedData.pastWork.map((work, index) => (
                      <div className={styles.work__container} key={index}>
                        <input
                          type="text"
                          name="company"
                          placeholder="Company"
                          value={work.company}
                          onChange={(e) => {
                            const newWork = [...updatedData.pastWork];
                            const updatedWork = { ...newWork[index] };
                            updatedWork.company = e.target.value;
                            newWork[index] = updatedWork;
                            setUpdatedData({
                              ...updatedData,
                              pastWork: newWork,
                            });
                          }}
                        />
                        <input
                          type="text"
                          name="position"
                          placeholder="Position"
                          value={work.position}
                          onChange={(e) => {
                            const newWork = [...updatedData.pastWork];
                            const updatedWork = { ...newWork[index] };
                            updatedWork.position = e.target.value;
                            newWork[index] = updatedWork;
                            setUpdatedData({
                              ...updatedData,
                              pastWork: newWork,
                            });
                          }}
                        />
                        <input
                          type="number"
                          name="years"
                          placeholder="Years"
                          value={work.years}
                          onChange={(e) => {
                            const newWork = [...updatedData.pastWork];
                            const updatedWork = { ...newWork[index] };
                            updatedWork.years = parseInt(e.target.value);
                            newWork[index] = updatedWork;
                            setUpdatedData({
                              ...updatedData,
                              pastWork: newWork,
                            });
                          }}
                        />
                      </div>
                    ))}
                </div>

                <div className={styles.userInfo}>
                  <h5 style={{ textAlign: "left" }}>Education</h5>
                  {updatedData.education.length !== 0 &&
                    updatedData.education.map((education, index) => (
                      <div className={styles.work__container} key={index}>
                        <input
                          type="text"
                          name="school"
                          placeholder="School"
                          value={education.school}
                          onChange={(e) => {
                            const newEducation = [...updatedData.education];
                            const updatedEducation = { ...newEducation[index] };
                            updatedEducation.school = e.target.value;
                            newEducation[index] = updatedEducation;
                            setUpdatedData({
                              ...updatedData,
                              education: newEducation,
                            });
                          }}
                        />
                        <input
                          type="text"
                          name="degree"
                          placeholder="Degree"
                          value={education.degree}
                          onChange={(e) => {
                            const newEducation = [...updatedData.education];
                            const updatedEducation = { ...newEducation[index] };
                            updatedEducation.degree = e.target.value;
                            newEducation[index] = updatedEducation;
                            setUpdatedData({
                              ...updatedData,
                              education: newEducation,
                            });
                          }}
                        />
                        <input
                          type="text"
                          name="fieldOfStudy"
                          placeholder="Field of Study"
                          value={education.fieldOfStudy}
                          onChange={(e) => {
                            const newEducation = [...updatedData.education];
                            const updatedEducation = { ...newEducation[index] };
                            updatedEducation.fieldOfStudy = e.target.value;
                            newEducation[index] = updatedEducation;
                            setUpdatedData({
                              ...updatedData,
                              education: newEducation,
                            });
                          }}
                        />
                      </div>
                    ))}
                </div>
                <div className={styles.userInfo}>
                  <label style={{ display: "inline-block" }}>
                    Enter the password
                    <input
                      type="text"
                      name="email"
                      value={updatedData.password}
                      onChange={(e) => {
                        setUpdatedData({
                          ...updatedData,
                          password: e.target.value,
                        });
                      }}
                    />
                  </label>
                </div>
                <button
                  className={styles.submitBtn}
                  onClick={handleUpdateSubmit}
                >
                  Update
                </button>
              </div>
            </div>
          )}

          <div className={styles.backDropContainer}>
            <label htmlFor="profileUpload" className={styles.backDrop__overlay}>
              <p>Edit</p>
            </label>
            <input
              onChange={(e) => {
                uploadProfile(e.target.files[0]);
              }}
              type="file"
              hidden
              id="profileUpload"
            />
            <img
              src={`${BASE_URL}${profileData.data.userId.profilePicture}`}
              alt=""
            />

            <div className={styles.editBtn}>
              <button onClick={() => setIsEditing(!isEditing)}>
                Edit Profile
              </button>
            </div>
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
                  <h2>{profileData.data.userId.name}</h2>
                  <p style={{ color: "gray" }}>
                    {profileData.data.userId.username}
                  </p>
                </div>

                <div>
                  <p>{profileData.data.bio}</p>
                </div>
                <div style={{ paddingBlock: "1rem" }}>
                  <p style={{ fontSize: "0.8em", fontWeight: "bold" }}>
                    Current Position: {profileData.data.currentPostion}
                  </p>
                </div>
              </div>

              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPosts &&
                  userPosts.map((post) => {
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
                          <p
                            style={{ paddingBlock: "1rem", fontWeight: "bold" }}
                          >
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
              {profileData.data.pastWork.length === 0 ? (
                <p>Fresher</p>
              ) : (
                profileData.data.pastWork.map((work, index) => {
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
          <div className={styles.workHistory}>
            <h3>Education</h3>
            <div className={styles.workHistory__Container}>
              {profileData.data.education.length === 0 ? (
                <p>Fresher</p>
              ) : (
                profileData.data.education.map((education, index) => {
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
                        {education.school} - {education.degree}
                      </p>
                      <p>{education.fieldOfStudy}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </DashBoardLayout>
  );
};

export default Profile;
