import React, { useState } from "react"
import { Button, Stack, TextField } from "@mui/material"
import axios from 'axios'

const CreateFlashcard = ({ userId, deckId }) => {
  console.log(`[CreateFlashcard] deckId is ${deckId}`)
  const [formValue, setFormValue] = useState({})
  const [errors, setErrors] = useState({
    frontText: null,
    frontImage: null,
    backText: null,
    backImage: null
  })

  const isUrl = (value) => {
    const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    return re.test(value)
  }

  function validateProperty(fieldName, fieldValue) {
    const fieldValueTrimmed = fieldValue.trim()
    if (fieldValueTrimmed === '') {
      return 'Field cannot be empty'
    } else if (fieldName === "frontImage" || fieldName === "backImage") {
      const validateUrl = fieldName.isUrl()
      if (validateUrl === false) {
        return 'Invalid Url entered'
      }
    }
    return null
  }

  const handleChange = (event) => {
    event.preventDefault()
    console.log("[CreateFlashcard] onChange ", event)
    if (validateProperty(event.target.name, event.target.value)) {
      const currentValues = formValue
      currentValues[event.target.name] = event.target.value
      setFormValue(currentValues)
    } else {
      setErrors(formValue)
      return ' event handling error, one or more card fields contains invalid information'
    }
  }
  
  const handleSubmit = async (event) => {
    console.log("[CreateFlashcard] onSubmit ", event)
    event.preventDefault()
    try {
      const response = await axios.post(`http://localhost:8000/decks/${deckId}/cards`, formValue, { headers: { user: userId } })
      console.log(`[createflashcard] response submit ${response.status}`)
    } catch (err) {
      console.log(`response error ${err.status}`)
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <span>Form values: {formValue.frontText} &amp; {formValue.backText}</span>
      <TextField
        margin="normal"
        required
        fullWidth
        id="frontImage"
        label="Front Image"
        name="frontImage"
        onChange={handleChange}
        autoFocus
        error={errors.frontImage}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="frontText"
        label="Front Text"
        id="frontText"
        onChange={handleChange}
        error={errors.frontText}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="backImage"
        label="Back Image"
        name="backImage"
        onChange={handleChange}
        error={errors.backImage}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="backText"
        label="Back Text"
        id="backText"
        onChange={handleChange}
        error={errors.backText}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Stack>
  )
}

export default CreateFlashcard
