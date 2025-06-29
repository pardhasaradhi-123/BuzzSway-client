import { timeAgo } from "../utils/timeAgo";
import { FiHeart, FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";
import { useState } from "react";
import API from "../utils/axios";

const PostCard = ({ post, currentUser, onPostUpdate, onClick }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [liked, setLiked] = useState(post.likes?.includes(currentUser?.id));
  const [likeLoading, setLikeLoading] = useState(false);

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const handleLike = async () => {
    try {
      setLikeLoading(true);
      const alreadyLiked = likes.includes(currentUser?.id);
      const updatedLikes = alreadyLiked
        ? likes.filter((id) => id !== currentUser.id)
        : [...likes, currentUser.id];

      setLikes(updatedLikes);
      setLiked(!alreadyLiked);

      await API.post(`/posts/${post._id}/like`, {
        userId: currentUser.id,
      });

      const userRes = await API.get(
        `/posts/user/${post.user?._id || post.user}`
      );
      const updatedPost = userRes.data.find((p) => p._id === post._id);
      if (updatedPost && typeof onPostUpdate === "function") {
        onPostUpdate(updatedPost);
      }
    } catch (err) {
      console.error("Failed to like post", err);
    } finally {
      setLikeLoading(false);
    }
  };

  const isVideo = post.image?.match(/\.(mp4|webm|ogg)$/);

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 mb-6 transition-all hover:shadow-xl border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 text-white flex items-center justify-center rounded-full font-bold text-lg shadow">
            {post?.user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-semibold text-buzzPrimary">
              @{post?.user?.username || "unknown"}
            </p>
            <p className="text-sm text-gray-400">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className="text-gray-800 leading-relaxed mb-4">{post.caption}</p>

      {/* Media: Video or Image */}
      {post.image && (
        <div
          onClick={onClick}
          className="rounded-lg mb-3 max-h-72 overflow-hidden cursor-pointer"
        >
          {post.image.match(/\.(mp4|webm|ogg)$/) ? (
            <video
              src={`${backendUrl}${post.image}`}
              className="w-full max-h-72 object-cover rounded-md pointer-events-none"
              muted
            />
          ) : (
            <img
              src={`${backendUrl}${post.image}`}
              alt="Post"
              className="w-full object-cover rounded-md"
            />
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-6 text-gray-600 text-sm">
        <button
          className={`flex items-center gap-1 transition-all ${
            liked ? "text-pink-500" : "hover:text-buzzPrimary hover:scale-105"
          }`}
          onClick={handleLike}
          disabled={likeLoading}
        >
          <FiHeart className="text-lg" />
          <span>{likes.length}</span>
        </button>

        <button
          className="flex items-center gap-1 hover:text-buzzPrimary hover:scale-105 transition"
          onClick={onClick}
        >
          <FiMessageCircle className="text-lg" />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
