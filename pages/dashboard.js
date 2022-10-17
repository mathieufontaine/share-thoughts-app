import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Message from "../components/Message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

const Dashboard = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  // get posts
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  // delete post
  const deletePost = async (id) => {
    console.log(id);
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1 className="text-2xl text-center my-2">My Posts</h1>
      <div>
        {posts.length === 0 ? (
          <div className="italic">No post yet..</div>
        ) : (
          posts.map((post) => {
            return (
              <Message key={post.id} post={post}>
                <div className="flex gap-4 mt-4">
                  <Link href={{ pathname: "/post", query: post }}>
                    <button className="text-cyan-600 flex items-center gap-2">
                      <AiFillEdit className="text-xl" /> Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-red-600 flex items-center gap-2"
                  >
                    <BsTrash2Fill className="text-xl" /> Delete
                  </button>
                </div>
              </Message>
            );
          })
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          {/* <button
            className="bg-cyan-600 text-white p-2 text-center text-lg rounded-sm my-2"
            onClick={() => route.push("/post")}
          >
            Share Your Thoughts Now
          </button>
          <button
            className="bg-black text-white p-2 text-center text-lg mx-2 rounded-sm my-2"
            onClick={() => route.push("/")}
          >
            Posts
          </button> */}
        </div>
        <button
          className="bg-red-500 text-white p-2 text-center text-lg rounded-sm my-2"
          onClick={() => auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
