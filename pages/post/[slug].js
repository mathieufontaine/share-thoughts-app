import { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import Router, { useRouter } from "next/router";
import Message from "../../components/Message";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export default function Details() {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const [user, loading] = useAuthState(auth);

  const route = useRouter();
  const routeData = route.query;

  useEffect(() => {
    if (!route.isReady) return;
    getComments();
  }, [routeData]);

  // submit comment
  const submitComment = async () => {
    // check message
    if (!auth.currentUser) return route.push("/auth/login");
    if (!message) {
      toast.error("Text is empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    // send comment
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message: message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    setMessage("");
  };

  // get comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };

  return (
    <div>
      <Message post={routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="add a comment"
            className="bg-gray-800 p-3 w-full text-white text-sm"
          />
          <button
            onClick={submitComment}
            className="bg-cyan-600 text-white p-3"
          >
            Send
          </button>
        </div>
        {allMessages?.length > 0 && (
          <div className="py-6">
            <h2 className="font-bold mb-4">Comments</h2>
            {allMessages?.map((message) => (
              <div className="bg-gray-100 my-2 p-2">
                <div className="flex items-center gap-2">
                  <img src={message.avatar} className="w-8 rounded-full" />
                  <p>{message.username}</p>
                </div>
                <p className="mt-2 text-sm">{message.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
