import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useLoginPage } from '../hooks/useLoginPage';
import { LoginForm } from '../components';

export function LoginPage() {
  const { form, isLoading, error, onSubmit } = useLoginPage();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm
            form={form}
            onSubmit={onSubmit}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}
