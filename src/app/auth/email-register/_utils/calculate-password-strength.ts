export const calculatePasswordStrength = (password: string) => {
  if (!password) return 0

  let strength = 0

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    strength += 1
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    strength += 1
  }

  // Check for numbers
  if (/[0-9]/.test(password)) {
    strength += 1
  }

  // Check for special characters
  if (/[^a-zA-Z0-9]/.test(password)) {
    strength += 1
  }

  if (password.length >= 10) strength += 1

  return (strength / 5) * 100
}
