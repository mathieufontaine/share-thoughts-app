import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-4">
      <Link href="/">
        <button className="text-lg font-medium ">Share Thoughts</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"}>
            <a className="py-2 px-4 text-sm">Join Now</a>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="p-2 rounded-sm font-medium text-white bg-cyan-600 text-sm">
                Post
              </button>
            </Link>
            <Link href="/dashboard">
              <img
                className="w-12 rounded-full cursor-pointer"
                src={user.photoURL}
                alt={user.displayName}
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
