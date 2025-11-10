import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UseFormReturn } from 'react-hook-form';
import type { RegisterFormData } from '../hooks/useRegisterPage';

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
  error: string;
}

export function RegisterForm({
  form,
  onSubmit,
  isLoading,
  error,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" {...register('name')} className="mt-1" />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1"
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1"
        />
        {errors.password && (
          <p className="text-sm text-red-600 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary/80">
            Sign in
          </Link>
        </span>
      </div>
    </form>
  );
}
