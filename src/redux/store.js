import { configureStore } from '@reduxjs/toolkit'
import formSlice from './slices/formSlice'
import routeSlice from './slices/routeSlice'

export default configureStore({
  reducer: {
      form: formSlice,
      route: routeSlice
  },
})