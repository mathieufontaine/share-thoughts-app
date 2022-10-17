import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const post = () => {
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);

  const route = useRouter();
  const routeData = route.query;

  const submitPost = async (e) => {
    e.preventDefault();

    // check post
    if (!post.description) {
      toast.error("Text field is empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    if (post.description.length > 300) {
      toast.error("Text is too long", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    if (post.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
    } else {
      // create a new Post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        username: user.displayName,
        avatar: user.photoURL,
      });
      toast.success("A new thought has been shared!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
    }
    setPost({ description: "" });
    return route.push("/");
  };

  // check user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("auth?login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading, routeData]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold ">
          {post.hasOwnProperty("id")
            ? "Edit Your Thought"
            : "Share a new thought"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">
            What's on your mind today?
          </h3>
          <textarea
            className="bg-gray-600 h-48 w-full rounded-lg my-2 p-2 text-white"
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            cols="30"
            rows="10"
          ></textarea>
          <p className="font-medium text-sm">
            <span
              className={
                post.description.length > 300 ? "text-red-600" : "text-cyan-600"
              }
            >
              {post.description.length}
            </span>
            /300
          </p>
        </div>
        <button
          type="submit"
          className="w-full text-white bg-cyan-600 my-2 p-2 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default post;
