// 'use client';

// import { useState } from 'react';
// import { useSignIn, useClerk } from '@clerk/nextjs';

// export default function SignInForm({ onSuccess, onSwitchToSignUp }: {
//   onSuccess: () => void;
//   onSwitchToSignUp: () => void;
// }) {
//   const { signIn, isLoaded } = useSignIn();
//   const { setActive } = useClerk();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isLoaded) return;

//     try {
//       const result = await signIn.create({ identifier: email, password });

//       if (result.status === 'complete') {
//         await setActive({ session: result.createdSessionId });
//         onSuccess();
//       } else {
//         setError('Check your email to continue.');
//       }
//     } catch (err: any) {
//       setError(err.errors?.[0]?.message || 'Sign-in failed.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <h2 className="text-xl font-semibold text-center">Sign In</h2>

//       {error && <p className="text-red-600 text-sm text-center">{error}</p>}

//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="w-full p-2 border rounded"
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full p-2 border rounded"
//         required
//       />
//       <button
//         type="submit"
//         className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
//       >
//         Sign In
//       </button>

//       <p className="text-sm text-center">
//         Don’t have an account?{' '}
//         <button type="button" className="underline" onClick={onSwitchToSignUp}>
//           Sign Up
//         </button>
//       </p>
//     </form>
//   );
// }
