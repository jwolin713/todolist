/**
 * Setup Verification Script
 *
 * This script checks if all prerequisites are set up correctly
 * before running the application.
 *
 * Run with: npx tsx scripts/verify-setup.ts
 */

import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

interface CheckResult {
  name: string
  status: "pass" | "fail" | "warn"
  message: string
}

const results: CheckResult[] = []

function checkResult(name: string, status: "pass" | "fail" | "warn", message: string) {
  results.push({ name, status, message })
}

console.log("🔍 Verifying setup for AI Todo App...\n")
console.log("=" .repeat(60))

// Check 1: Environment file exists
console.log("\n📄 Checking environment configuration...")
const envPath = resolve(process.cwd(), ".env.local")
const envExists = existsSync(envPath)

if (envExists) {
  checkResult("Environment File", "pass", ".env.local exists")

  // Read and check environment variables
  const envContent = readFileSync(envPath, "utf-8")
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "ANTHROPIC_API_KEY",
  ]

  const missingVars: string[] = []
  const placeholderVars: string[] = []

  for (const varName of requiredVars) {
    const regex = new RegExp(`${varName}=(.+)`)
    const match = envContent.match(regex)

    if (!match) {
      missingVars.push(varName)
    } else {
      const value = match[1].trim()
      if (value.startsWith("your_") || value === "") {
        placeholderVars.push(varName)
      }
    }
  }

  if (missingVars.length > 0) {
    checkResult(
      "Required Variables",
      "fail",
      `Missing: ${missingVars.join(", ")}`
    )
  } else if (placeholderVars.length > 0) {
    checkResult(
      "Variable Values",
      "warn",
      `Placeholder values detected: ${placeholderVars.join(", ")}`
    )
  } else {
    checkResult("Environment Variables", "pass", "All required variables are set")
  }
} else {
  checkResult(
    "Environment File",
    "fail",
    ".env.local not found. Copy .env.local.example to .env.local"
  )
}

// Check 2: Dependencies installed
console.log("\n📦 Checking dependencies...")
const nodeModulesPath = resolve(process.cwd(), "node_modules")
const nodeModulesExists = existsSync(nodeModulesPath)

if (nodeModulesExists) {
  checkResult("Dependencies", "pass", "node_modules exists")

  // Check for critical dependencies
  const criticalDeps = [
    "@anthropic-ai/sdk",
    "@supabase/supabase-js",
    "@supabase/ssr",
    "next",
  ]

  const missingDeps: string[] = []

  for (const dep of criticalDeps) {
    const depPath = resolve(nodeModulesPath, dep)
    if (!existsSync(depPath)) {
      missingDeps.push(dep)
    }
  }

  if (missingDeps.length > 0) {
    checkResult(
      "Critical Dependencies",
      "fail",
      `Missing: ${missingDeps.join(", ")}`
    )
  } else {
    checkResult("Critical Dependencies", "pass", "All critical packages installed")
  }
} else {
  checkResult("Dependencies", "fail", "node_modules not found. Run 'npm install'")
}

// Check 3: Migration file exists
console.log("\n🗄️  Checking database setup...")
const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/20250101000000_initial_schema.sql"
)
const migrationExists = existsSync(migrationPath)

if (migrationExists) {
  checkResult("Migration File", "pass", "Database schema file exists")
  checkResult(
    "Migration Status",
    "warn",
    "Make sure to run this migration in your Supabase project"
  )
} else {
  checkResult("Migration File", "fail", "Database migration file not found")
}

// Check 4: Required directories
console.log("\n📁 Checking project structure...")
const requiredDirs = [
  "app",
  "components",
  "lib",
  "hooks",
  "public",
]

const missingDirs: string[] = []

for (const dir of requiredDirs) {
  const dirPath = resolve(process.cwd(), dir)
  if (!existsSync(dirPath)) {
    missingDirs.push(dir)
  }
}

if (missingDirs.length > 0) {
  checkResult("Project Structure", "fail", `Missing directories: ${missingDirs.join(", ")}`)
} else {
  checkResult("Project Structure", "pass", "All required directories exist")
}

// Check 5: Key files exist
console.log("\n📋 Checking key files...")
const keyFiles = [
  "lib/ai/client.ts",
  "lib/ai/task-parser.ts",
  "app/api/chat/route.ts",
  "components/chat/chat-panel.tsx",
  "hooks/use-chat.ts",
]

const missingFiles: string[] = []

for (const file of keyFiles) {
  const filePath = resolve(process.cwd(), file)
  if (!existsSync(filePath)) {
    missingFiles.push(file)
  }
}

if (missingFiles.length > 0) {
  checkResult("Key Files", "fail", `Missing files: ${missingFiles.join(", ")}`)
} else {
  checkResult("Key Files", "pass", "All key implementation files exist")
}

// Print Results
console.log("\n" + "=".repeat(60))
console.log("\n📊 VERIFICATION RESULTS\n")

let passCount = 0
let warnCount = 0
let failCount = 0

for (const result of results) {
  let icon = ""
  let color = ""

  switch (result.status) {
    case "pass":
      icon = "✅"
      passCount++
      break
    case "warn":
      icon = "⚠️"
      warnCount++
      break
    case "fail":
      icon = "❌"
      failCount++
      break
  }

  console.log(`${icon} ${result.name}: ${result.message}`)
}

console.log("\n" + "=".repeat(60))
console.log(`\n📈 Summary: ${passCount} passed, ${warnCount} warnings, ${failCount} failed\n`)

// Final verdict
if (failCount > 0) {
  console.log("❌ Setup is incomplete. Please fix the issues above before running the app.\n")
  console.log("Common fixes:")
  console.log("  • Missing .env.local → Copy .env.local.example and fill in your keys")
  console.log("  • Missing dependencies → Run: npm install")
  console.log("  • Database not set up → Run the migration in Supabase")
  console.log("")
  process.exit(1)
} else if (warnCount > 0) {
  console.log("⚠️  Setup is mostly complete, but some warnings need attention.\n")
  console.log("Next steps:")
  console.log("  1. Make sure your Supabase project is configured")
  console.log("  2. Run the database migration")
  console.log("  3. Update any placeholder values in .env.local")
  console.log("  4. Run: npm run dev")
  console.log("")
  process.exit(0)
} else {
  console.log("✅ Setup verification complete! Everything looks good.\n")
  console.log("You're ready to start the development server:")
  console.log("  npm run dev\n")
  console.log("Then open: http://localhost:3000\n")
  console.log("📖 See TESTING.md for a comprehensive testing guide.")
  console.log("")
  process.exit(0)
}
