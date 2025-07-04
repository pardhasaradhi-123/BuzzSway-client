import { useEffect, useState, useContext } from "react";
import API from "../utils/axios";
import PostCard from "../components/PostCard";
import PostModal from "../components/PostModal";
import { AuthContext } from "../context/AuthContext";
import Lottie from "lottie-react";
import loadingAnim from "../assets/loading.json";
import emptyAnim from "../assets/empty.json";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user: currentUser } = useContext(AuthContext);

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL ||
    "https://buzzsway-server-production.up.railway.app";

  // Format the image URL safely
  const formatImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `${backendUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/posts/allPosts");
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const normalized = sorted.map((post) => ({
        ...post,
        image: formatImageUrl(post.image),
      }));
      setPosts(normalized);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Update post in state
  const handlePostUpdate = (updatedPost) => {
    const updated = {
      ...updatedPost,
      image: formatImageUrl(updatedPost.image),
    };
    setPosts((prevPosts) => [
      updated,
      ...prevPosts.filter((p) => p._id !== updatedPost._id),
    ]);
  };

  // Remove post from state
  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
    setSelectedPost(null);
  };

  const handlePostClick = (post) => {
    setSelectedPost({
      ...post,
      image: formatImageUrl(post.image),
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Feed</h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <Lottie animationData={loadingAnim} loop className="w-40 h-40" />
          <p className="text-gray-500">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Lottie animationData={emptyAnim} loop className="w-60 h-60" />
          <p className="text-gray-400 italic mt-4">No posts yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post._id}
              onClick={() => currentUser && handlePostClick(post)}
              className="cursor-pointer"
            >
              <PostCard
                post={post}
                currentUser={currentUser}
                onPostUpdate={handlePostUpdate}
              />
            </div>
          ))}
        </div>
      )}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          currentUser={currentUser}
          onPostDeleted={() => handlePostDeleted(selectedPost._id)}
        />
      )}
    </div>
  );
};

export default Home;
