'use client';

import { CheckCircle } from 'lucide-react';

const WaitingForApproval = () => {
  return (
    <div className="text-center mt-10">
      <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Submitted for Approval</h2>
      <p className="text-gray-600">
        Your form has been submitted and is awaiting admin approval.
      </p>
    </div>
  );
};

export default WaitingForApproval;
