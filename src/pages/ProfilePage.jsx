import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import API from "../utils/axios";
import PostModal from "../components/PostModal";
import Lottie from "lottie-react";
import loadingAnim from "../assets/loading.json";
import emptyAnim from "../assets/empty.json";
import img from "../assets/it's me.jpg";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [postForm, setPostForm] = useState({ image: "", caption: "" });
  const [activePost, setActivePost] = useState(null);

  const backendUrl = "https://buzzsway-server-production.up.railway.app";

  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(Cookies.get("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const isOwnProfile = loggedInUser?.id === profile?._id;

  const fetchUser = async () => {
    try {
      const res = await API.get(`/users/${id}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await API.get(`/posts/user/${id}`);
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [id]);

  useEffect(() => {
    if (profile?.followers && loggedInUser?.id) {
      setIsFollowing(profile.followers.includes(loggedInUser.id));
    }
  }, [profile, loggedInUser]);

  const handleEditProfile = () => {
    setFormData({
      username: profile.username || "",
      email: profile.email || "",
      bio: profile.bio || "",
    });
    setEditModalOpen(true);
  };

  const handleCreatePost = async () => {
    if (!postForm.media) {
      alert("Please select an image or video.");
      return;
    }

    try {
      const form = new FormData();
      form.append("media", postForm.media);
      form.append("caption", postForm.caption);

      await API.post(`/posts/${profile._id}/create`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchUser();
      await fetchPosts();
      setPostForm({ media: null, caption: "" });
      setPostModalOpen(false);
    } catch (err) {
      window.alert(err.response?.data?.message || "Error creating post");
    }
  };

  const handleSaveProfile = async () => {
    try {
      await API.put("/users/edit", formData);
      await fetchUser();
      setEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await API.post(`/users/${profile._id}/follow`);
      await fetchUser();
      setIsFollowing(res.data.followed);
    } catch (err) {
      console.error("Follow error", err);
    }
  };

  const formatImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `${backendUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  if (!profile) return <p className="pt-24 px-4">Loading...</p>;

  return (
    <div className="pt-24 px-4 md:px-10 max-w-5xl mx-auto">
      {/* Top Section */}
      <div className="flex flex-row items-start gap-4 flex-wrap">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 text-white flex items-center justify-center text-5xl font-bold uppercase">
          {profile.username?.charAt(0)}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{profile.username}</h2>

          <div className="flex gap-8 mt-4">
            <div>
              <span className="font-bold text-lg">
                {profile.posts?.length || 0}
              </span>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
            <div>
              <span className="font-bold text-lg">
                {profile.followers?.length || 0}
              </span>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div>
              <span className="font-bold text-lg">
                {profile.following?.length || 0}
              </span>
              <p className="text-sm text-gray-600">Following</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">
            {profile.bio || "🌟 MERN Stack Developer | 📸 BuzzSway Enthusiast"}
          </p>
        </div>

        <div className="mt-4 flex flex-row gap-2 w-full">
          {isOwnProfile ? (
            <>
              <button
                onClick={handleEditProfile}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setPostModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-lime-400 hover:opacity-90 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              >
                Create Post
              </button>
            </>
          ) : (
            <button
              onClick={handleFollow}
              className={`${
                isFollowing
                  ? "bg-gray-300 hover:bg-gray-400 text-black"
                  : "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:opacity-90"
              } px-4 py-2 rounded-md w-full sm:w-auto`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* Posts Section */}
      {loadingPosts ? (
        <div className="flex flex-col items-center justify-center min-h-80 mt-10">
          <Lottie animationData={loadingAnim} loop className="w-40 h-40" />
          <p className="text-gray-500 mt-2">Loading posts...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mt-8">
          {posts.map((post, i) => (
            <div
              key={i}
              className="relative w-full aspect-square overflow-hidden rounded-md shadow-md"
            >
              {post.image?.match(/\.(mp4|webm|ogg)$/) ? (
                <div
                  onClick={() =>
                    setActivePost({
                      ...post,
                      image: formatImageUrl(post.image),
                      user: { _id: profile._id, username: profile.username },
                    })
                  }
                  className="relative w-full h-full cursor-pointer"
                >
                  <video
                    src={formatImageUrl(post.image)}
                    controls
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
              ) : (
                <img
                  // src={formatImageUrl(post.image)}
                  src={img}
                  alt={`post-${i}`}
                  className="w-full h-full object-cover hover:scale-105 hover:brightness-110 transition-transform duration-200 ease-in-out cursor-pointer"
                  onClick={() =>
                    setActivePost({
                      ...post,
                      image: formatImageUrl(post.image),
                      user: { _id: profile._id, username: profile.username },
                    })
                  }
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-96 mt-10">
          <Lottie animationData={emptyAnim} loop className="w-60 h-60" />
          <p className="text-gray-500 mt-4">No posts yet.</p>
        </div>
      )}

      {/* Modals */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
            <input
              type="text"
              className="w-full border px-3 py-2 mb-2 rounded"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
            />
            <input
              type="email"
              className="w-full border px-3 py-2 mb-2 rounded"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <textarea
              className="w-full border px-3 py-2 mb-2 rounded"
              placeholder="Bio"
              rows={3}
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isPostModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Create New Post</h3>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) =>
                setPostForm((prev) => ({ ...prev, media: e.target.files[0] }))
              }
            />
            <textarea
              className="w-full border px-3 py-2 mb-2 rounded"
              placeholder="Caption"
              rows={3}
              value={postForm.caption}
              onChange={(e) =>
                setPostForm((prev) => ({ ...prev, caption: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPostModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="bg-gradient-to-r from-green-500 to-lime-400 text-white px-4 py-2 rounded"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {activePost && (
        <PostModal
          post={activePost}
          currentUser={loggedInUser}
          onClose={() => setActivePost(null)}
          onPostDeleted={async () => {
            setActivePost(null);
            await fetchPosts();
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
