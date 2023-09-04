import { useParams } from "react-router-dom";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import axios from "axios";
import { useEffect, useState } from "react";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";

const ArticlePage = () => {
  const { articleId } = useParams();
  const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });
  const { user, isLoading } = useUser();
  useEffect(() => {
    const loadArticleInfo = async () => {
      const token = user && (await user.getIdToken());
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`/api/articles/${articleId}`, {
        headers,
      });
      const newArticleInfo = response.data;
      setArticleInfo(newArticleInfo);
    };
    if (!isLoading) {
      loadArticleInfo();
    }
  }, [isLoading, user]);

  const article = articles.find((article) => article.name === articleId);
  const addUpVote = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.put(
      `/api/articles/${articleId}/upvote`,
      null,
      {
        headers,
      }
    );
    const updatedArticle = response.data;
    setArticleInfo(updatedArticle);
  };

  if (article)
    return (
      <>
        <h1>{article.title}</h1>
        <div className="upvotes-section">
          {user ? (
            <button onClick={addUpVote}>
              {articleInfo.canUpvote ? "Upvote" : "Alreday Upvoted"}
            </button>
          ) : (
            <button onClick={addUpVote}>Log in to upvote</button>
          )}

          <p>This article has {articleInfo.upvotes} upvote(s)</p>
        </div>
        {article.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        {user ? (
          <AddCommentForm
            articleName={articleId}
            onArticleUpdated={(updatedArticle) =>
              setArticleInfo(updatedArticle)
            }
          />
        ) : (
          <button>Log in to add a comment</button>
        )}

        <CommentsList comments={articleInfo.comments} />
      </>
    );
  else return <NotFoundPage />;
};

export default ArticlePage;
