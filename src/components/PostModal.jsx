import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import API from "../utils/axios";

const PostModal = ({ post, onClose, currentUser, onPostDeleted }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [liked, setLiked] = useState(post.likes?.includes(currentUser.id));
  const [commentText, setCommentText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const isOwner = currentUser?.id === post?.user?._id;

  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${post.user._id}/delete/${post._id}`);
      onPostDeleted?.();
      onClose();
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const refreshLikes = async () => {
    try {
      const response = await API.get(`/posts/user/${post.user._id}`);
      const updatedPost = response.data.find((p) => p._id === post._id);
      if (updatedPost) {
        setLikes(updatedPost.likes || []);
        setLiked(updatedPost.likes?.includes(currentUser.id));
      }
    } catch (err) {
      console.error("Failed to refresh likes", err);
    }
  };

  const handleLike = async () => {
    try {
      const alreadyLiked = likes.includes(currentUser.id);
      const updatedLikes = alreadyLiked
        ? likes.filter((id) => id !== currentUser.id)
        : [...likes, currentUser.id];

      setLikes(updatedLikes);
      setLiked(!alreadyLiked);

      await API.post(`/posts/${post._id}/like`, {
        userId: currentUser.id,
      });

      await refreshLikes();
    } catch (err) {
      console.error("Failed to update like", err);
    }
  };

  const handleAddComment = async () => {
    if (commentText.trim() === "") return;

    try {
      const response = await API.post(`/posts/${post._id}/comment`, {
        userId: currentUser.id,
        text: commentText,
      });

      const newComment = response.data.comment || {
        text: commentText,
        postedBy: { username: currentUser.username },
      };

      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const refreshComments = async () => {
    try {
      setLoadingComments(true);
      const response = await API.get(`/posts/user/${post.user._id}`);
      const updatedPost = response.data.find((p) => p._id === post._id);
      if (updatedPost) {
        setComments(updatedPost.comments || []);
      }
    } catch (err) {
      console.error("Failed to refresh comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const confirm = window.confirm("Delete this comment?");
      if (!confirm) return;

      await API.delete(`/posts/${post._id}/comment/${commentId}`, {
        data: { userId: currentUser.id },
      });

      const updated = comments.filter((c) => (c._id || "") !== commentId);
      setComments(updated);
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  useEffect(() => {
    refreshComments();
    refreshLikes();
  }, []);

  if (!post) return null;

  const ext = post.image?.split(".").pop()?.split("?")[0]?.toLowerCase();
  const isVideo = ["mp4", "webm", "ogg"].includes(ext);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gradient-to-tr from-red-500 to-pink-500 text-white p-2 rounded-full shadow-sm z-50"
        >
          <RxCross2 className="text-lg" />
        </button>

        {/* Post Media (Image or Video) */}
        {isVideo ? (
          <video
            src={`https://buzzsway-server-production.up.railway.app${post.image}`}
            controls
            className="w-full max-h-[400px] rounded-t-2xl"
          />
        ) : (
          <img
            src={`https://buzzsway-server-production.up.railway.app${post.image}`}
            alt="Full Post"
            className="w-full object-cover max-h-[400px] rounded-t-2xl"
          />
        )}

        {/* Caption */}
        <div className="px-4 pt-3">
          <p className="text-sm text-gray-800 mb-2 font-medium">
            {post.caption || "No caption"}
          </p>
        </div>

        {/* Like / Comment / More */}
        <div className="flex justify-between items-center px-4 pb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button onClick={handleLike}>
                {liked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-600" />
                )}
              </button>
              <span className="text-sm text-gray-800">{likes.length}</span>
            </div>

            <div className="flex items-center gap-1">
              <FaRegComment className="text-gray-600" />
              <span className="text-sm text-gray-800">{comments.length}</span>
            </div>
          </div>

          {/* More Options */}
          <div className="relative">
            <button
              onClick={() => setShowOptions((prev) => !prev)}
              className="p-1 hover:bg-gray-100 rounded-full"
              title="More Options"
            >
              <span className="text-lg text-gray-600">⋯</span>
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-20">
                {isOwner && (
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                  >
                    Delete this post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="px-4 max-h-32 overflow-y-auto text-sm">
          {loadingComments ? (
            <p className="text-gray-500 italic">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet.</p>
          ) : (
            comments.map((cmt, i) => {
              const isAuthor = cmt?.postedBy?.username === currentUser.username;
              return (
                <div key={cmt._id || i} className="mb-2 group relative">
                  <span className="font-medium">
                    {cmt?.postedBy?.username || "Unknown"}
                  </span>{" "}
                  <span>{cmt.text}</span>
                  {isAuthor && (
                    <button
                      onClick={() => handleDeleteComment(cmt._id)}
                      className="absolute right-0 top-0 text-xs text-red-500 hidden group-hover:block"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add Comment */}
        <div className="flex items-center border-t p-3">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />
          <button
            onClick={handleAddComment}
            className="ml-2 px-3 py-1.5 text-sm text-white rounded bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
