import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Rating from "@mui/material/Rating"
import Typography from "@mui/material/Typography"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import Skeleton from "@mui/material/Skeleton"

import EditDelete from "../components/EditDelete"
import Hero from "../components/Hero"
import Sidebar from "../components/Sidebar"
import StepsSection from "../components/StepsSection"
import loading from "../reducers/loading"
import { API_URL } from "../utils/urls"

const SingleRecipe = () => {
  const { recipeId } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isLoading = useSelector(store => store.loading.isLoading)
  const accessToken = useSelector(store => store.user.accessToken)
  const userId = useSelector(store => store.user.userId)

  const [recipe, setRecipe] = useState({})
  const [userRatings, setUserRatings] = useState([])
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [isRated, setIsRated] = useState(false)
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  const recipeRating = userRatings.find(item => item.recipeId === recipeId)

  useEffect(() => {
    if (accessToken) {
      dispatch(loading.actions.setLoading(true))

      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": accessToken,
        },
      }

      fetch(API_URL(`users/user/${userId}`), options)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUserRatings(data.response.ratings)
          } else {
            setIsSnackbarOpen(true)
            setSnackbarMessage(data.response.message)
            setSnackbarSeverity("warning")
          }
          dispatch(loading.actions.setLoading(false))
        })
        .catch(error => console.error("Error:", error))
    }
  }, [])

  useEffect(() => {
    dispatch(loading.actions.setLoading(true))
    fetch(API_URL(`recipes/recipe/${recipeId}`))
      .then(res => res.json())
      .then(data => {
        setRecipe(data.response)
        dispatch(loading.actions.setLoading(false))
      })
      .catch(error => console.error("Error:", error))
  }, [])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleDeleteRecipe = (recipeId) => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": accessToken,
      },
    }

    fetch(API_URL(`recipes/recipe/${recipeId}`), options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          navigate("/recipes")
        } else {
          setIsSnackbarOpen(true)
          setSnackbarMessage(data.response.message)
          setSnackbarSeverity("warning")
        }
      })
      .catch(error => console.error("Error:", error))
  }

  const addRatingToRecipe = () => {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": accessToken,
      },
      body: JSON.stringify({ rating })
    }

    fetch(API_URL(`recipes/recipe/${recipeId}/rating`), options)
      .then(res => res.json())
      .then(data => {
        setIsSnackbarOpen(true)
        setSnackbarMessage(data.response.message)
        if (data.success) {
          setSnackbarSeverity("success")
        } else {
          setSnackbarSeverity("warning")
        }
      })
      .catch(error => console.error("Error:", error))
  }

  const addRatingToUser = () => {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": accessToken,
      },
      body: JSON.stringify({ recipeId, rating })
    }

    fetch(API_URL(`users/user/${userId}/edit/rating`), options)
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
  }

  const onRateRecipe = () => {
    addRatingToRecipe()
    addRatingToUser()
    setIsRated(true)
  }

  return (
    <>
      <Snackbar
        autoHideDuration={3000}
        open={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
      >
        <Alert onClose={() => setIsSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Hero hero={recipe} />

      {accessToken && userId === recipe.addedBy &&
        <EditDelete
          editPath={`/recipes/${recipe._id}/edit`}
          openAction={handleClickOpen}
          open={open}
          setOpen={setOpen}
          onDelete={handleDeleteRecipe}
          itemId={recipe._id}
          title="Delete this recipe?"
          text="Click to confirm that you want to delete this recipe."
        />
      }

      {accessToken &&
        <Box sx={{ displayPrint: "none" }}>
          <Typography component="legend" color="text.secondary">
            {recipeRating !== undefined || isRated ? "Your rating" : "Rate this recipe"}
          </Typography>
          <Rating
            value={recipeRating !== undefined ? recipeRating.rating : rating}
            disabled={recipeRating !== undefined || isRated}
            onChangeActive={(event, newValue) => setRating(newValue)}
            onChange={onRateRecipe}
          />
        </Box>
      }

      {isLoading || Object.keys(recipe).length === 0 ?
        <Skeleton
          variant="rectangular"
          height={140}
          width="100%"
          animation="wave"
        />
        :
        <Grid container spacing={5}>
          <Sidebar recipe={recipe} />
          <StepsSection recipe={recipe} />
        </Grid>
      }
    </>
  )
}

export default SingleRecipe
