// 'use client';

// import { useState } from 'react';
// import { useSignUp } from '@clerk/nextjs';

// export default function SignUpForm({
//   onEmailSent,
//   onBack,
// }: {
//   onEmailSent: (email: string, verificationId: string) => void;
//   onBack: () => void;
// }) {
//   const { signUp, isLoaded } = useSignUp();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isLoaded) return;

//     if (password !== confirmPassword) {
//       return setError('Passwords do not match');
//     }

//     try {
//       await signUp.create({ emailAddress: email, password });
//       await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
//       if (!signUp.id) {
//         throw new Error('Verification ID is missing');
//       }
//       onEmailSent(email, signUp.id);
//     } catch (err: any) {
//       setError(err.errors?.[0]?.message || 'Sign-up failed');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <h2 className="text-xl font-semibold text-center">Sign Up</h2>
//       {error && <div className="text-red-600 text-sm">{error}</div>}
//       <input
//         className="w-full border p-2 rounded"
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <input
//         className="w-full border p-2 rounded"
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <input
//         className="w-full border p-2 rounded"
//         type="password"
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         required
//       />
//       <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
//         Continue
//       </button>
//       <p className="text-sm text-center">
//         Already have an account?{' '}
//         <button type="button" className="underline" onClick={onBack}>
//           Sign in
//         </button>
//       </p>
//     </form>
//   );
// }
