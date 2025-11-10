export function LandingFooter() {
  return (
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
          — Built with React, TypeScript, and shadcn/ui
        </p>
      </div>
    </footer>
  );
}
