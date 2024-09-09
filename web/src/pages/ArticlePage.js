// ArticlesPage.js
import React, { useEffect, useState } from "react";
import * as Setting from "../Setting";
import {useNavigate} from "react-router-dom";

const ArticlesPage = () => {
    const [articles, setArticles] = useState([]);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Articles</h1>
            <ul>
                {articles.map((article) => (
                    <li key={article.id}>
                        <h3>{article.name}</h3>
                        <p>{article.content}</p>
                        <p>{article.createdAt}</p>
                        <p>{article.category}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArticlesPage;
