import QRCode from 'qrcode'

export interface CertificateQRData {
  certificateNumber: string
  verificationCode: string
  userId: string
  programId: string
}

/**
 * Generate a QR code as a data URL for certificate verification
 * The QR code contains a public URL to verify and download the certificate
 * Format: https://example.com/verify-certificate/{verificationCode}
 */
export async function generateCertificateQR(
  data: CertificateQRData
): Promise<string> {
  try {
    // Create public verification URL
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.PUBLIC_URL || 'https://example.com'

    // Build the public certificate verification URL
    const verificationUrl = `${baseUrl}/verify-certificate/${data.verificationCode}`

    // Generate QR code as PNG data URL using qrcode library
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'M' as const,
      type: 'image/png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return qrDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

/**
 * Generate a unique verification code for the certificate
 */
export function generateVerificationCode(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}
