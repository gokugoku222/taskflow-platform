import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/forms/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Create your account to get started"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
