import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import allEndpoints from "express-list-endpoints"

import {
  registerUser,
  getUsers,
  loginUser,
  editProfilePassword,
  editProfileOtherFields,
  addRatingToUser,
  getProfile,
  deleteProfile
} from "./controllers/userControllers"
import {
  addRecipe,
  getRecipes,
  getPublicRecipes,
  getRecipesByUserId,
  getRecipesByUserIdAndPublic,
  getSingleRecipe,
  editRecipe,
  addRatingToRecipe,
  deleteRecipe
} from "./controllers/recipeControllers"
import User from "./models/user"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})

app.get("/", (req, res) => {
  res.send(
    {
      "Welcome!": "Nadia's final project",
      "All endpoints are listed here": "/endpoints",
      "Frontend": "https://edible-nostalgia.netlify.app/"
    }
  )
})

app.get("/endpoints", (req, res) => {
  res.send(allEndpoints(app))
})

//--------------------------- ALL USERS ENDPOINT FOR DEV PURPOSE - TO REMOVE EVENTUALLY ---------------------------//
app.get("/users", getUsers)

//--------------------------- USER REGISTRATION ENDPOINT ---------------------------//
app.post("/register", registerUser)

//--------------------------- USER LOGIN ENDPOINT ---------------------------//
app.post("/login", loginUser)

//--------------------------- AUTHENTICATION MIDDLEWARE ---------------------------//
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization")

  try {
    const user = await User.findOne({ accessToken: accessToken })

    if (user) {
      next()
    } else {
      res.status(401).json({
        success: false,
        status_code: 401,
        response: {
          message: "Please log in / You are logged out"
        }
      })
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      response: {
        message: "Bad request.",
        errors: error
      }
    })
  }
}

//--------------------------- EDIT PROFILE ENDPOINT - PASSWORD ---------------------------//
app.patch("/users/user/:userId/edit/password", authenticateUser, editProfilePassword)

//--------------------------- EDIT PROFILE ENDPOINT - OTHER FIELDS ---------------------------//
app.patch("/users/user/:userId/edit/other", authenticateUser, editProfileOtherFields)

//--------------------------- ADD RATING TO RECIPE ENDPOINT ---------------------------//
app.patch("/users/user/:userId/edit/rating", authenticateUser, addRatingToUser)

//--------------------------- GET PROFILE ENDPOINT ---------------------------//
app.get("/users/user/:userId", authenticateUser, getProfile)

//--------------------------- DELETE PROFILE ENDPOINT ---------------------------//
app.delete("/users/user/:userId", authenticateUser, deleteProfile)

//--------------------------- ADD RECIPE ENDPOINT ---------------------------//
app.post("/recipes", authenticateUser, addRecipe)

//--------------------------- GET ALL RECIPES ENDPOINT FOR DEV PURPOSE - TO REMOVE EVENTUALLY ---------------------------//
app.get("/recipes/all", getRecipes)

//--------------------------- GET PUBLIC RECIPES ENDPOINT ---------------------------//
app.get("/recipes/public", getPublicRecipes)

//--------------------------- GET RECIPES ADDED BY SPECIFIC USER ENDPOINT ---------------------------//
app.get("/recipes/user/:userId", authenticateUser, getRecipesByUserId)

//--------------------------- GET RECIPES ADDED BY SPECIFIC USER + PUBLIC ENDPOINT ---------------------------//
app.get("/recipes/user/:userId/public", authenticateUser, getRecipesByUserIdAndPublic)

//--------------------------- GET SINGLE RECIPE ENDPOINT ---------------------------//
app.get("/recipes/recipe/:recipeId", getSingleRecipe)

//--------------------------- EDIT RECIPE ENDPOINT ---------------------------//
app.patch("/recipes/recipe/:recipeId", authenticateUser, editRecipe)

//--------------------------- ADD RATING TO RECIPE ENDPOINT ---------------------------//
app.patch("/recipes/recipe/:recipeId/rating", authenticateUser, addRatingToRecipe)

//--------------------------- DELETE RECIPE ENDPOINT ---------------------------//
app.delete("/recipes/recipe/:recipeId", authenticateUser, deleteRecipe)

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
