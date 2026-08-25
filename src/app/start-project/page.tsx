'use client';

import React, { Suspense } from 'react';
import { MultiStepRequestForm } from '@/components/forms/MultiStepRequestForm';
import { Skeleton } from '@/components/ui/Skeleton';

export default function StartProjectPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 font-sans">
      <Suspense fallback={
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      }>
        <MultiStepRequestForm />
      </Suspense>
    </div>
  );
}
