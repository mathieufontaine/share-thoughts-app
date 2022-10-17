import React from "react";

const Message = ({ post, children }) => {
  return (
    <div className="bg-white p-6 border-b-2">
      <div className="flex items-center gap-2">
        <img className="w-10 rounded-full" src={post.avatar} alt="" />
        <h2 className=" font-medium">{post.username}</h2>
        {/* <h3>{post.timestamp}</h3> */}
      </div>
      <div className="mt-4">
        <p>{post.description}</p>
      </div>
      {children}
    </div>
  );
};

export default Message;
