import QRCode from 'qrcode'

// Helper function to generate unique certificate number
function generateCertificateNumber(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `CERT-${timestamp}-${random}`
}

// Helper function to generate unique verification code
function generateVerificationCode(count?: number): string {
  return (
    Math.random()
      .toString(count || 36)
      .substring(2, 15) +
    Math.random()
      .toString(count || 36)
      .substring(2, 15)
  )
}

// Helper function to generate QR code data for certificate verification
// Returns a data URL (Base64 encoded PNG image) for the QR code
// The QR code contains a public URL to verify and download the certificate
async function generateCertificateQRCode(certificateData: {
  certificateNumber: string
  verificationCode: string
  userId: string
  programId: string
}): Promise<string> {
  try {
    // Get the base URL from environment or use a default
    const baseUrl = process.env.PUBLIC_URL || 'https://example.com'

    // Build the public certificate verification URL
    const verificationUrl = `${baseUrl}/verify-certificate/${certificateData.verificationCode}`

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'H',
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

export {
  generateVerificationCode,
  generateCertificateNumber,
  generateCertificateQRCode,
}
