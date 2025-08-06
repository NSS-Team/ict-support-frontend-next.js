'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';
import { api } from '~/trpc/react';

export function useSecurityCodes() {
  const { user, isLoaded: userLoaded } = useUser();
  const [codes, setCodes] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const hasFetchedRef = useRef(false);

  const codesMetadata = Number(user?.publicMetadata?.codes ?? -1);
  const shouldTrigger = userLoaded && !!user && codesMetadata === 0;

  const {
    mutate: generateCodes,
    isError,
    reset,
  } = api.auth.generateCodes.useMutation({
    onSuccess: (res) => {
      const newCodes = res.data?.codes ?? [];
      setCodes(newCodes);
    },
    onError: (err) => {
      console.error('❌ Failed to generate codes:', err);
    },
  });

  useEffect(() => {
    if (shouldTrigger && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      setShowModal(true);
      generateCodes();
    }
  }, [shouldTrigger, generateCodes]);

  const retry = () => {
    hasFetchedRef.current = false;
    reset();
  };

  return {
    showModal,
    setShowModal,
    isError,
    codes,
    retry,
    userLoaded,
  };
}
