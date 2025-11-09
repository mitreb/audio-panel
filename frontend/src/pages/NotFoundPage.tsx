import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center space-y-6 max-w-2xl">
        {/* Large 404 */}
        <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>

        {/* Error message */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground text-lg">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <Button asChild variant="default" size="lg">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <a>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
