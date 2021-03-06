import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import { combineReducers, configureStore } from "@reduxjs/toolkit"

import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import { ThemeProvider } from "@mui/material/styles"

import Home from "./pages/Home"
import Recipes from "./pages/Recipes"
import SingleRecipe from "./pages/SingleRecipe"
import RecipeForm from "./pages/RecipeForm"
import Profile from "./pages/Profile"
import UserForm from "./pages/UserForm"
import Error404 from "./pages/Error404"
import AccessDenied from "./pages/AccessDenied"
import Header from "./components/Header"
import Footer from "./components/Footer"
import loading from "./reducers/loading"
import user from "./reducers/user"
import { theme } from "./utils/theme"

const reducer = combineReducers({
  loading: loading.reducer,
  user: user.reducer
})

const persistedStateJSON = localStorage.getItem("state")
let persistedState = {}

if (persistedStateJSON) {
  persistedState = JSON.parse(persistedStateJSON)
}

const store = configureStore({ reducer, preloadedState: persistedState })

store.subscribe(() => {
  localStorage.setItem("state", JSON.stringify(store.getState()))
})

const hero = {
  title: "Edible nostalgia",
}

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth="md" sx={{ bgcolor: "#eddcd2" }}>
            <Header />
            <main>
              <Routes>
                <Route path="/recipes/add" element={<RecipeForm />} />
                <Route path="/recipes/:recipeId/edit" element={<RecipeForm />} />
                <Route path="/recipes/:recipeId" element={<SingleRecipe />} />
                <Route path="/recipes" element={<Recipes hero={hero} />} />
                <Route path="/login" element={<UserForm />} />
                <Route path="/profile/edit" element={<UserForm />} />
                <Route path="/profile" element={<Profile hero={hero} />} />
                <Route path="/error404" element={<Error404 hero={hero} />} />
                <Route path="/accessdenied" element={<AccessDenied hero={hero} />} />
                <Route path="/" element={<Home hero={hero} />} />
                <Route path="*" element={<Error404 hero={hero} />} />
              </Routes>
            </main>
            <Footer />
          </Container>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default App
