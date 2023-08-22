import { useParams } from "react-router-dom";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import axios from "axios";
import { useEffect, useState } from "react";
import CommentsList from "../components/CommentsList";

const ArticlePage = () => {
  const { articleId } = useParams();
  const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });
  useEffect(() => {
    const loadArticleInfo = async () => {
      const response = await axios.get(`/api/articles/${articleId}`);
      const newArticleInfo = response.data;
      setArticleInfo(newArticleInfo);
    };
    loadArticleInfo();
  }, []);

  const article = articles.find((article) => article.name === articleId);
  const addUpVote = async () => {
    const response = await axios.put(`/api/articles/${articleId}/upvote`);
    const updatedArticle = response.data;
    setArticleInfo(updatedArticle);
  };

  if (article)
    return (
      <>
        <h1>{article.title}</h1>
        <div className="upvotes-section">
          <button onClick={addUpVote}>Upvote</button>
          <p>This article has {articleInfo.upvotes} upvote(s)</p>
        </div>
        {article.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        <CommentsList comments={articleInfo.comments} />
      </>
    );
  else return <NotFoundPage />;
};

export default ArticlePage;
