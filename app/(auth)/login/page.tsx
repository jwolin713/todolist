"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Feather, Mail, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Use the configured URL only if it's not localhost OR if we're currently on localhost
      // This prevents production sites from redirecting to localhost
      const configuredUrl = process.env.NEXT_PUBLIC_APP_URL
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      const isConfiguredLocalhost = configuredUrl?.includes('localhost') || configuredUrl?.includes('127.0.0.1')

      const redirectUrl = (configuredUrl && (isLocalhost || !isConfiguredLocalhost))
        ? configuredUrl
        : window.location.origin

      console.log('Magic link redirect URL:', redirectUrl)
      console.log('Current hostname:', window.location.hostname)
      console.log('Configured URL:', configuredUrl)

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
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
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
          <form onSubmit={handleLogin} className="space-y-4">
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
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Send Magic Link</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              No password required. Just click the link in your email.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
