import "./styles/App.css";

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthCallback } from "casdoor-react-sdk";
import * as Setting from "./Setting";
import HomePage from "./pages/HomePage";
import ArticlesPage from "./pages/ArticlePage";
import CasbinManagerPage from "./pages/CasbinManagerPage";
import AddArticlePage from "./pages/AddArticlePage";
import ArticleManagePage from "./pages/ArticleManagePage";

class App extends React.Component {
  authCallback = (
    <AuthCallback
      sdk={Setting.CasdoorSDK}
      serverUrl={Setting.ServerUrl}
      saveTokenFromResponse={(res) => {
        Setting.setToken(res?.data);
        Setting.goToLink("/");
      }}
      isGetTokenSuccessful={(res) => res?.status === "ok"}
    />
  );

  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/callback" element={this.authCallback} />
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/manage-articles" element={<ArticleManagePage />} />
          <Route path="/add-article" element={<AddArticlePage />} />
          <Route path="/casbinmanager" element={<CasbinManagerPage />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
