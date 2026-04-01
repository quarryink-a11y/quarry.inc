"use client";

import { Button } from "@shared/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface EventSuccessDialogProps {
  onClose: () => void;
}

export function EventSuccessDialog({ onClose }: EventSuccessDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">ALL DONE!</h2>
        <p className="text-sm text-gray-500 mb-6">
          Have a safe trip, and we hope you&apos;re
          <br />
          fully booked! 😎
        </p>
        <Button
          variant="outline"
          onClick={onClose}
          className="rounded-full px-8"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
