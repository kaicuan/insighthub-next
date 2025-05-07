'use client';

import { useActionState, useState } from 'react';
import { register } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function RegisterForm({ email }: { email?: string }) {
  const [state, formAction, isPending] = useActionState(register, undefined);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: email || '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const renderField = (
    id: keyof typeof formValues,
    label: string,
    type: string,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        className="bg-transparent"
        value={formValues[id]}
        onChange={handleChange}
      />
      {state?.errors?.[id] && (
        <p className="text-red-500 text-sm">{state.errors[id][0]}</p>
      )}
    </div>
  );

  return (
    <form className="space-y-6" action={formAction}>
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField('firstName', 'First Name', 'text', 'John')}
        {renderField('lastName', 'Last Name', 'text', 'Doe')}
      </div>

      {/* Email Field */}
      {renderField('email', 'Email', 'email', 'you@example.com')}

      {/* Password Fields */}
      <div className="space-y-4">
        {renderField('password', 'Password', 'password', '••••••••')}
        {renderField(
          'confirmPassword',
          'Re-enter Password',
          'password',
          '••••••••'
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
        aria-disabled={isPending}
      >
        {isPending ? (
          <span className="animate-pulse">Creating Account...</span>
        ) : (
          <>Create Account</>
        )}
      </Button>

      {state?.message && (
        <p className="text-red-500 text-sm text-center">{state.message}</p>
      )}
    </form>
  );
}
