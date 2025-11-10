import { Spinner } from './ui/spinner';

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Spinner className="size-8" />
    </div>
  );
}
