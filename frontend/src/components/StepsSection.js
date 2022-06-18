import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import uniqid from "uniqid"


const StepsSection = (props) => {
  const { recipe } = props
  const navigate = useNavigate()

  useEffect(() => {
    if (recipe === undefined) {
      navigate("/error404")
    }
  })

  return (
    <Grid
      item
      xs={12}
      md={8}
    >
      <Typography variant="h6" gutterBottom>
        Steps
      </Typography>
      <Divider />
      {recipe.steps.map(step => (
        <Typography key={uniqid()} paragraph variant="p">
          {step}
        </Typography>
      ))}
    </Grid>
  )
}

export default StepsSection