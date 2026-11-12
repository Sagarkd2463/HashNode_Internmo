import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Article from "./pages/Article.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Editor from "./pages/Editor.jsx";
import Profile from "./pages/Profile.jsx";
import Tags from "./pages/Tags.jsx";
import TagFeed from "./pages/TagFeed.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          {/* Public Routes */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/posts/:slug" element={<Article />} />

          <Route path="/tags" element={<Tags />} />

          <Route path="/tags/:slug" element={<TagFeed />} />

          {/* Protected Routes */}

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/editor" element={<Editor />} />

            <Route path="/editor/:id" element={<Editor />} />

            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* 404 Route */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
