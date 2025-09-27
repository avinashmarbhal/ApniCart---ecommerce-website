// src/components/Footer.jsx
import React from 'react';

export default function SimpleFooter() {
  return (
    <div className="text-center text-xs text-gray-600 mt-10 pb-6 ">
        <hr />
      <div className="flex gap-4 justify-center mt-3 mb-1">
        <a href="#" className="hover:underline">Conditions of Use</a>
        <a href="#" className="hover:underline">Privacy Notice</a>
        <a href="#" className="hover:underline">Help</a>
      </div>
      <div>© 1996–2025, ApniCart.com, Inc. or its affiliates</div>
    </div>
  );
}
