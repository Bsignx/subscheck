import * as Z from 'zod'

export const RegisterSchema = Z.object({
  email: Z.string().email({
    message: 'Please enter a valid email address'
  }),
  password: Z.string().min(8, {
    message: 'Password must be at least 8 characters long'
  }),
  name: Z.string().min(2, {
    message: 'Name must be at least 2 characters long'
  })
})
