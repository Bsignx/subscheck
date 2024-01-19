import * as Z from 'zod'

export const LoginSchema = Z.object({
  email: Z.string().email({
    message: 'Please enter a valid email address'
  }),
  password: Z.string().min(1, {
    message: 'Please enter a password'
  })
})
