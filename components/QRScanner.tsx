// components/QRScanner.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (token: string) => void;
  onError?: () => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScan,
        onError,
      )
      .catch(() => {
        // Camera permission denied or not available
      });

    return () => {
      scanner.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <div
        id="qr-reader"
        className="w-full rounded-card overflow-hidden"
      />
      <p className="text-xs text-muted font-dm text-center mt-2">
        Point camera at the owner&rsquo;s QR code
      </p>
    </div>
  );
}