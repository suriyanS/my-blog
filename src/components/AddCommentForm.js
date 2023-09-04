import axios from "axios";
import { useState } from "react";
import useUser from "../hooks/useUser";

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
  const [commentText, setCommentText] = useState("");
  const { user, isLoading } = useUser();
  if (!isLoading) {
    const addComment = async () => {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = await axios.post(
        `/api/articles/${articleName}/comments`,
        {
          postedBy: user.email,
          comment: commentText,
        },
        {
          headers,
        }
      );
      const updateArticle = response.data;
      onArticleUpdated(updateArticle);
      setCommentText("");
    };
    return (
      <div id="add-comment-form">
        <h3>Add a Comment</h3>
        {user && <p>You are posting as {user.email}</p>}
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows="4"
          cols={50}
        />
        {user && <button onClick={addComment}>Add Comment</button>}
      </div>
    );
  }
};

export default AddCommentForm;
