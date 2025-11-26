"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Feather, Mail, ArrowRight, Lock, Eye, EyeOff } from "lucide-react"

type AuthMode = "magic-link" | "password-signin" | "password-signup"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [authMode, setAuthMode] = useState<AuthMode>("password-signin")
  const supabase = createClient()

  const getRedirectUrl = () => {
    const configuredUrl = process.env.NEXT_PUBLIC_APP_URL
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const isConfiguredLocalhost = configuredUrl?.includes('localhost') || configuredUrl?.includes('127.0.0.1')

    return (configuredUrl && (isLocalhost || !isConfiguredLocalhost))
      ? configuredUrl
      : window.location.origin
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const redirectUrl = getRedirectUrl()

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${redirectUrl}/auth/callback`,
        },
      })

      if (error) {
        setMessage({ type: "error", text: error.message })
      } else {
        setMessage({
          type: "success",
          text: "Check your email for the magic link!",
        })
        setEmail("")
      }
    } catch {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage({ type: "error", text: error.message })
      } else {
        // Redirect will happen automatically via middleware
        window.location.href = "/"
      }
    } catch {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      setLoading(false)
      return
    }

    try {
      const redirectUrl = getRedirectUrl()

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${redirectUrl}/auth/callback`,
        },
      })

      if (error) {
        setMessage({ type: "error", text: error.message })
      } else {
        setMessage({
          type: "success",
          text: "Check your email to confirm your account!",
        })
        setEmail("")
        setPassword("")
        setConfirmPassword("")
      }
    } catch {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (authMode === "magic-link") {
      handleMagicLink(e)
    } else if (authMode === "password-signin") {
      handlePasswordSignIn(e)
    } else {
      handlePasswordSignUp(e)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border bg-card shadow-soft-lg">
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Feather className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-serif font-medium text-foreground">Welcome to TaskFlow</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              AI-powered task management for the modern workflow
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Auth Mode Tabs */}
          <div className="flex rounded-xl bg-secondary/50 p-1 mb-6">
            <button
              type="button"
              onClick={() => { setAuthMode("password-signin"); setMessage(null) }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                authMode === "password-signin"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode("password-signup"); setMessage(null) }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                authMode === "password-signup"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode("magic-link"); setMessage(null) }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                authMode === "magic-link"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Magic Link
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {(authMode === "password-signin" || authMode === "password-signup") && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 pr-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {authMode === "password-signup" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            )}

            {message && (
              <div
                className={`p-3 rounded-xl text-sm ${
                  message.type === "success"
                    ? "bg-chart-2/10 text-chart-2 border border-chart-2/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {message.text}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  <span>
                    {authMode === "magic-link" ? "Sending..." : authMode === "password-signup" ? "Creating account..." : "Signing in..."}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>
                    {authMode === "magic-link" ? "Send Magic Link" : authMode === "password-signup" ? "Create Account" : "Sign In"}
                  </span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {authMode === "magic-link"
                ? "No password required. Just click the link in your email."
                : authMode === "password-signup"
                ? "Already have an account? "
                : "Don't have an account? "}
              {authMode !== "magic-link" && (
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "password-signup" ? "password-signin" : "password-signup")}
                  className="text-primary hover:underline font-medium"
                >
                  {authMode === "password-signup" ? "Sign in" : "Sign up"}
                </button>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
