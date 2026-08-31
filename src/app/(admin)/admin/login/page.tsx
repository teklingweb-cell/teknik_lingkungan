import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = { title: 'Login — Admin Panel' };

export default function LoginPage() {
  return (
    <div className="login-body">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
