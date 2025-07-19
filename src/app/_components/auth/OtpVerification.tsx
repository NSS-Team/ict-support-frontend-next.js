// 'use client';

// import { useSignUp } from '@clerk/nextjs';
// import { useState } from 'react';

// export default function OtpVerification({
//   email,
//   verificationId,
//   onSuccess,
//   onBack,
// }: {
//   email: string;
//   verificationId: string;
//   onSuccess: () => void;
//   onBack: () => void;
// }) {
//   const { signUp, isLoaded, setActive } = useSignUp();
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState('');

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isLoaded) return;

//     try {
//       if (!signUp || signUp.id !== verificationId) throw new Error('Invalid signup flow');
//       const result = await signUp.attemptEmailAddressVerification({ code: otp });

//       if (result.status === 'complete') {
//         await setActive({ session: result.createdSessionId });
//         onSuccess();
//       }
//     } catch (err: any) {
//       setError(err.errors?.[0]?.message || 'Invalid OTP code');
//     }
//   };

//   return (
//     <form onSubmit={handleVerify} className="space-y-4">
//       <h2 className="text-xl font-semibold text-center">Verify OTP</h2>
//       <p className="text-sm text-gray-600 text-center">We sent a code to {email}</p>
//       {error && <div className="text-red-600 text-sm">{error}</div>}
//       <input
//         className="w-full border p-2 rounded"
//         type="text"
//         placeholder="Enter OTP code"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         required
//       />
//       <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
//         Verify
//       </button>
//       <button type="button" className="w-full text-sm underline mt-2" onClick={onBack}>
//         Back
//       </button>
//     </form>
//   );
// }
