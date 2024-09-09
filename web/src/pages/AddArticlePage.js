import React, { useState } from "react";
import * as Setting from "../Setting";
import { useNavigate } from "react-router-dom"; // Zmienione na useNavigate

const AddArticlePage = () => {
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const navigate = useNavigate(); // Zmienione na useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const newArticle = {
            name,
            content,
            category,
        };

        try {
            const response = await fetch("http://localhost:8081/article", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newArticle),
            });

            if (!response.ok) {
                throw new Error("Failed to add article");
            }

            const data = await response.json();
            Setting.showMessage("Article added successfully!");
            navigate("/manage-articles"); // Zmienione na navigate
        } catch (error) {
            console.error("Error adding article:", error);
            Setting.showMessage("Unable to add the article.");
        }
    };

    return (
        <div>
            <h1>Add New Article</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Article</button>
            </form>
        </div>
    );
};

export default AddArticlePage;
