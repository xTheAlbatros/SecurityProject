import React, { useState, useEffect } from "react";
import * as Setting from "../Setting";
import { useNavigate } from "react-router-dom";

const ArticleManagePage = () => {
    const [articles, setArticles] = useState([]);
    const [selectedArticleId, setSelectedArticleId] = useState("");
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!Setting.isLoggedIn()) {
            navigate("/");
        } else {
            fetchArticles();
        }
    }, [navigate]);

    const fetchArticles = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8081/articles", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch articles");
            }

            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error("Error fetching articles:", error);
            Setting.showMessage("Unable to fetch articles.");
        } finally {
            setLoading(false);
        }
    };

    const handleArticleSelect = async (e) => {
        const articleId = e.target.value;
        setSelectedArticleId(articleId);

        if (articleId) {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`http://localhost:8081/article/${articleId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch the selected article");
                }

                const article = await response.json();
                setSelectedArticle(article);
            } catch (error) {
                console.error("Error fetching article:", error);
                Setting.showMessage("Unable to fetch the selected article.");
            }
        } else {
            setSelectedArticle(null);
        }
    };

    const handleDeleteArticle = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8081/article/${selectedArticleId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete article");
            }

            Setting.showMessage("Article deleted successfully.");
            setSelectedArticle(null);
            setSelectedArticleId("");
            fetchArticles();
        } catch (error) {
            console.error("Error deleting article:", error);
            Setting.showMessage("Unable to delete the article.");
        }
    };

    const handleAddNewArticle = () => {
        navigate("/add-article");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Manage Articles</h1>
            <div>
                <h2>Click below to add article</h2>
                <button onClick={handleAddNewArticle}>Add Article</button>
            </div>
            <div>
                <br/>
                <h2>Select your article</h2>
                <select value={selectedArticleId} onChange={handleArticleSelect}>
                    <option value="">-- Select an Article --</option>
                    {articles.map((article) => (
                        <option key={article.id} value={article.id}>
                            {article.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedArticle && (
                <div>
                    <h2>{selectedArticle.name}</h2>
                    <p>{selectedArticle.content}</p>
                    <p>{selectedArticle.category}</p>
                    <p>{selectedArticle.createdAt}</p>
                    <button onClick={handleDeleteArticle}>Delete Article</button>
                </div>
            )}
        </div>
    );
};

export default ArticleManagePage;
