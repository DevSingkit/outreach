'use client';
import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (token: string) => void;
  onError?: () => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScan,
        onError,
      )
      .then(() => { isRunningRef.current = true; })
      .catch(() => {});

    return () => {
      if (isRunningRef.current) {
        scanner.stop().catch(() => {});
        isRunningRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <div id="qr-reader" className="w-full rounded-card overflow-hidden" />
      <p className="text-xs text-muted font-dm text-center mt-2">
        Point camera at the owner&rsquo;s QR code
      </p>
    </div>
  );
}