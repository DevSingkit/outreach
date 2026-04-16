'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRDisplayProps {
  qrCodeData: string; // pass the qr_code_data value from the DB directly
}

export function QRDisplay({ qrCodeData }: QRDisplayProps) {
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    if (!qrCodeData) return;
    QRCode.toDataURL(qrCodeData, { width: 192, margin: 1 })
      .then(setSrc)
      .catch(console.error);
  }, [qrCodeData]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="p-3 bg-white rounded-card border border-muted/20 shadow-sm">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="QR Code for check-in" className="w-48 h-48" />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center text-muted text-xs">
            Generating...
          </div>
        )}
      </div>
      <p className="text-xs font-dm text-muted text-center">
        Show this QR code at check-in
      </p>
    </div>
  );
}