import { ArrowRight, Sparkles, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { GitHub } from '@/components/icons'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/auth/server'

export default async function LandingPage() {
  const session = await getSession()

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Logo />

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="size-8" asChild>
                  <Link
                    href="https://github.com/fenghan34/rejume"
                    target="_blank"
                  >
                    <GitHub className="size-5" />
                  </Link>
                </Button>

                <Button size="sm" variant="outline" asChild>
                  {session ? (
                    <Link href="/dashboard">Dashboard</Link>
                  ) : (
                    <Link href="/login">Sign in</Link>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <section className="px-6 py-20 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-powered Resume Builder
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span>More than a</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                resume{' '}
              </span>
              <span className="block">it’s expression</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your resume with Rejume and let AI help you craft a
              professional resume.
            </p>

            <Button size="lg" asChild>
              <Link href={session ? '/dashboard' : '/login'}>
                Start your resume
              </Link>
            </Button>
          </div>
        </section>

        <section id="features" className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Why Choose Rejume
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful tools, open source
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to create the perfect resume, built with
                transparency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="group p-8 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-200 dark:hover:border-green-800">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Resume Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Analyze your resume with AI and receive personalized feedback
                  and suggestions based on target job descriptions.
                </p>
              </div>

              <div className="group p-8 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  AI-Powered Writing
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get intelligent suggestions for bullet points, skills, and
                  achievements tailored to your industry and experience level.
                </p>
              </div>

              <div className="group p-8 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-200 dark:hover:border-purple-800">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Editor</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Edit your resume with our powerful markdown editor with live
                  preview and instant formatting.
                </p>
              </div>

              <div className="group p-8 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-800">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <GitHub className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Open Source</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built with transparency and community in mind. View the code,
                  contribute, and help shape the future of resume building.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Ready to create your standout resume?
            </h2>
            <Button size="lg" variant="secondary" asChild>
              <Link href={session ? '/dashboard' : '/login'}>
                Start Building Now
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}
