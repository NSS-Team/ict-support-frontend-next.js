'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { isClerkAPIResponseError } from '@clerk/clerk-js';

export default function CustomAuthForm() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up' | 'verify-email' | 'forgot-password' | 'code-login'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { signIn, isLoaded: signInLoaded, setActive: setSignInActive } = useSignIn();
  const { signUp, isLoaded: signUpLoaded, setActive: setSignUpActive } = useSignUp();
  const router = useRouter();

  const clearState = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCode('');
    setError('');
    setSuccessMsg('');
  };

  const handleSignIn = async () => {
    if (!signInLoaded) return;
    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId });
        router.push('/');
      } else {
        console.log('Intermediate step required:', result);
      }
    } catch (err) {
      const msg = isClerkAPIResponseError(err) ? err.errors[0]?.message ?? 'Unknown error' : 'Unknown error';
      setError(msg ?? 'Unknown error');
    }
  };

  const handleSignUp = async () => {
    if (!signUpLoaded) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setMode('verify-email');
    } catch (err) {
      const msg = isClerkAPIResponseError(err) ? err.errors[0]?.message : 'Unknown error';
      setError(msg ?? 'Unknown error');
    }
  };

  const handleVerify = async () => {
    if (!signUpLoaded) return;
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setSignUpActive({ session: result.createdSessionId });
        router.push('/');
      }
    } catch (err) {
      const msg = isClerkAPIResponseError(err) ? err.errors[0]?.message : 'Unknown error';
      setError(msg ?? 'Unknown error');
    }
  };

  const handleForgotPassword = async () => {
    if (!signInLoaded) return;
    try {
      await signIn.create({ identifier: email });
      // Find the emailAddressId from supportedFirstFactors
      const emailFactor = signIn.supportedFirstFactors?.find(
        (factor) => factor.strategy === 'reset_password_email_code' && 'emailAddressId' in factor
      ) as { emailAddressId?: string } | undefined;
      const emailAddressId = emailFactor?.emailAddressId;
      if (!emailAddressId) {
        setError('Unable to find email address for password reset.');
        return;
      }
      await signIn.prepareFirstFactor({ strategy: 'reset_password_email_code', emailAddressId });
      setSuccessMsg('Reset code sent to your email.');
      setMode('code-login');
    } catch (err) {
      const msg = isClerkAPIResponseError(err) ? err.errors[0]?.message : 'Error';
      setError(msg ?? 'Unknown error');
    }
  };

  const handleCodeLogin = async () => {
    if (!signInLoaded) return;
    try {
      const result = await signIn.attemptFirstFactor({ strategy: 'reset_password_email_code', code });
      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId });
        router.push('/');
      } else {
        setError('Invalid code or step incomplete');
      }
    } catch (err) {
      const msg = isClerkAPIResponseError(err) ? err.errors[0]?.message : 'Error';
      setError(msg ?? 'Unknown error');
    }
  };

  const renderInput = (type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );

  const renderForm = () => {
    switch (mode) {
      case 'sign-up':
        return (
          <>
            {renderInput('email', 'Email', email, (e) => setEmail(e.target.value))}
            {renderInput('password', 'Password', password, (e) => setPassword(e.target.value))}
            {renderInput('password', 'Confirm Password', confirmPassword, (e) => setConfirmPassword(e.target.value))}
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{' '}
              <button onClick={() => { clearState(); setMode('sign-in'); }} className="text-blue-600 hover:underline">
                Sign In
              </button>
            </p>
          </>
        );
      case 'sign-in':
        return (
          <>
            {renderInput('email', 'Email', email, (e) => setEmail(e.target.value))}
            {renderInput('password', 'Password', password, (e) => setPassword(e.target.value))}
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              onClick={handleSignIn}
            >
              Sign In
            </button>
            <p className="text-sm text-center mt-4">
              <button onClick={() => { clearState(); setMode('forgot-password'); }} className="text-blue-500 hover:underline">
                Forgot Password?
              </button>
            </p>
            <p className="text-sm text-center mt-2">
              Don’t have an account?{' '}
              <button onClick={() => { clearState(); setMode('sign-up'); }} className="text-blue-600 hover:underline">
                Sign Up
              </button>
            </p>
          </>
        );
      case 'verify-email':
        return (
          <>
            <p className="mb-2 text-sm text-gray-700">Enter the verification code sent to your email.</p>
            {renderInput('text', 'Verification Code', code, (e) => setCode(e.target.value))}
            <button
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              onClick={handleVerify}
            >
              Verify Email
            </button>
          </>
        );
      case 'forgot-password':
        return (
          <>
            {renderInput('email', 'Enter your email', email, (e) => setEmail(e.target.value))}
            <button
              className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition"
              onClick={handleForgotPassword}
            >
              Send Reset Code
            </button>
            <p className="text-sm text-center mt-4">
              Remembered password?{' '}
              <button onClick={() => { clearState(); setMode('sign-in'); }} className="text-blue-600 hover:underline">
                Back to Sign In
              </button>
            </p>
          </>
        );
      case 'code-login':
        return (
          <>
            <p className="text-sm text-gray-700 mb-2">Enter the reset code sent to your email.</p>
            {renderInput('text', 'Reset Code', code, (e) => setCode(e.target.value))}
            <button
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
              onClick={handleCodeLogin}
            >
              Log In with Code
            </button>
          </>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center capitalize text-gray-800">
        {mode.replace('-', ' ')}
      </h2>

      {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
      {successMsg && <p className="text-green-600 text-sm mb-4 text-center">{successMsg}</p>}

      {renderForm()}
    </div>
  );
}
