import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer__left}>
            <p>Connect with Friends without Exaggeration</p>
            <p>A True social media platfrom, with stories no blufs !</p>
            <div
              className={styles.buttonJoin}
              onClick={() => {
                router.push("/login");
              }}
            >
              <p>Join Now</p>
            </div>
          </div>

          <div className={styles.mainContainer__right}>
            <img src="images/logo.jpeg" alt="Logo" />
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
