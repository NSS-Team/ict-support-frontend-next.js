'use client';

import SecurityCodesModal from '~/app/_components/securityCodes/SecurityCodesModal';

type Props = {
  showModal: boolean;
  setShowModal: (val: boolean) => void;
  codes: string[];
  isError: boolean;
  retry: () => void;
};

export default function SecurityCodeHandler({
  showModal,
  setShowModal,
  codes,
  isError,
  retry,
}: Props) {
  if (!showModal) return null;

  return (
    <>
      {/* Main modal */}
      <SecurityCodesModal
        codes={codes}
        onClose={() => setShowModal(false)}
      />

      {/* Error fallback */}
      {isError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-bold text-red-600 mb-2">Error</h3>
            <p className="text-gray-700 mb-4">Failed to generate security codes. Please try again.</p>
            <button
              onClick={retry}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </>
  );
}
