import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, Disc3, Upload, ListMusic } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-24 md:py-32 lg:py-40">
          <div className="flex max-w-[980px] flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Manage Your Music Products
              <br className="hidden sm:inline" />
              <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {' '}
                All in One Place
              </span>
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Create, organize, and manage your music catalog. Upload cover art,
              track details, and keep everything organized with ease.
            </p>
          </div>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link to="/register">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Upload Cover Art</h3>
              <p className="text-sm text-muted-foreground">
                Easily upload and manage cover art for all your music products
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ListMusic className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Organize Your Catalog</h3>
              <p className="text-sm text-muted-foreground">
                Keep track of all your albums, singles, and releases in one
                place
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Disc3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Track Everything</h3>
              <p className="text-sm text-muted-foreground">
                Manage artist names, product details, and metadata effortlessly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto flex flex-col gap-4 py-10 px-4 items-center justify-center">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 by{' '}
            <a
              href="https://github.com/mitreb"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-4"
            >
              Tymofii O.
            </a>{' '}
            with React, TypeScript, and shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
};
