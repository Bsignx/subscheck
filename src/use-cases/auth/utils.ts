type ErrorType =
  | 'AdapterError'
  | 'AuthorizedCallbackError'
  | 'CallbackRouteError'
  | 'ErrorPageLoop'
  | 'EventError'
  | 'InvalidCallbackUrl'
  | 'CredentialsSignin'
  | 'InvalidEndpoints'
  | 'InvalidCheck'
  | 'JWTSessionError'
  | 'MissingAdapter'
  | 'MissingAdapterMethods'
  | 'MissingAuthorize'
  | 'MissingSecret'
  | 'OAuthAccountNotLinked'
  | 'OAuthCallbackError'
  | 'OAuthProfileParseError'
  | 'SessionTokenError'
  | 'OAuthSignInError'
  | 'EmailSignInError'
  | 'SignOutError'
  | 'UnknownAction'
  | 'UnsupportedStrategy'
  | 'InvalidProvider'
  | 'UntrustedHost'
  | 'Verification'
  | 'MissingCSRF'

interface AuthErrorType extends Error {
  type: ErrorType
  kind?: 'signIn' | 'error'
  cause?: Record<string, unknown> & { err?: Error }
}

export class AuthError extends Error implements AuthErrorType {
  type: ErrorType
  kind?: 'signIn' | 'error'
  cause?: Record<string, unknown> & { err?: Error }

  constructor(
    type: ErrorType,
    message?: string,
    cause?: Record<string, unknown>
  ) {
    super(message)
    this.type = type
    this.cause = cause
  }
}
