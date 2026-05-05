import { Link, useRouteError } from 'react-router';

export function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-light tracking-wide mb-8" style={{ color: '#101828' }}>
          404
        </h1>
        <h2 className="text-2xl font-light tracking-wide mb-4" style={{ color: '#101828' }}>
          Page Not Found
        </h2>
        <p className="text-gray-600 font-light mb-8">
          {error?.statusText || error?.message || 'The page you are looking for does not exist.'}
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-4 text-sm text-white font-light tracking-widest transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#101828' }}
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
