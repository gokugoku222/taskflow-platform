import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign In"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthLayout>
  );
}
