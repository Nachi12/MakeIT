'use client';

import React, { Suspense } from 'react';
import { MultiStepRequestForm } from '@/components/forms/MultiStepRequestForm';

export default function RequestServicePage() {
  return (
    <div className="py-12">
      <Suspense fallback={<div className="p-12 text-center text-[#64748B]">Loading Form...</div>}>
        <MultiStepRequestForm />
      </Suspense>
    </div>
  );
}

