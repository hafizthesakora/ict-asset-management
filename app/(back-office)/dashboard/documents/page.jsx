import DocumentUpload from '@/components/dashboard/DocumentUpload';
import FixedHeader from '@/components/dashboard/FixedHeader';
import React from 'react';

export default function Documents() {
  return (
    <div>
      <FixedHeader title="Purchases" newLink="/" />
      <DocumentUpload />
    </div>
  );
}
