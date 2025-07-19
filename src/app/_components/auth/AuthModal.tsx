// 'use client';

// import { useState } from 'react';
// import { Dialog, DialogContent } from '@radix-ui/react-dialog';
// import SignInForm from './SignInForm';
// import SignUpForm from './SignUpForm';
// import OtpVerification from './OtpVerification';

// export type AuthStep = 'signIn' | 'signUp' | 'otp';

// export default function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
//   const [step, setStep] = useState<AuthStep>('signIn');
//   const [email, setEmail] = useState('');
//   const [pendingVerificationId, setPendingVerificationId] = useState('');

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="rounded-2xl p-6 shadow-xl w-[90vw] max-w-md bg-white">
//         {step === 'signIn' && (
//           <SignInForm
//             onSuccess={() => onOpenChange(false)}
//             onSwitchToSignUp={() => setStep('signUp')}
//           />
//         )}
//         {step === 'signUp' && (
//           <SignUpForm
//             onEmailSent={(email, verificationId) => {
//               setEmail(email);
//               setPendingVerificationId(verificationId);
//               setStep('otp');
//             }}
//             onBack={() => setStep('signIn')}
//           />
//         )}
//         {step === 'otp' && (
//           <OtpVerification
//             email={email}
//             verificationId={pendingVerificationId}
//             onSuccess={() => onOpenChange(false)}
//             onBack={() => setStep('signUp')}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
