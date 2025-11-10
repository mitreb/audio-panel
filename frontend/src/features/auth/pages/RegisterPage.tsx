import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRegisterPage } from '../hooks/useRegisterPage';
import { RegisterForm } from '../components';

export function RegisterPage() {
  const { form, isLoading, error, onSubmit } = useRegisterPage();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm
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
