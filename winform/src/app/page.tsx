import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-text-primary mb-4">
            WinForm
          </h1>
          <p className="text-xl text-text-secondary mb-8">
            AI-Powered Football Intelligence Platform
          </p>
          
          <div className="bg-card rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              Coming Soon
            </h2>
            <p className="text-text-secondary mb-6">
              We are building the most advanced AI football prediction platform. 
              Get ready for data-driven insights, real-time odds analysis, and intelligent match predictions.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="bg-accent text-white px-6 py-2 rounded hover:bg-accent/80 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-card border border-accent text-accent px-6 py-2 rounded hover:bg-accent/10 transition"
              >
                Register
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-text-secondary">
              WinForm is under active development. Check back soon for AI match predictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}