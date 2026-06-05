const C_API_KEY = process.env.CLOUDINARY_API_KEY
const C_API_SCR = process.env.CLOUDINARY_API_SECRET
const C_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET
const C_CLOUD = process.env.CLOUDINARY_NAME

const C_TSTAMP = Date.now() / 1000
const C_UP_URL = `https://api.cloudinary.com/v1_1/${C_CLOUD}/image/upload`
const C_LC_URL = `https://api.cloudinary.com/v1_1/${C_CLOUD}/resources/search`
const KEY_BREVO = process.env.KEY_BREVO
const APP_NAME = process.env.APP_NAME
const APP_URL = process.env.APP_URL

export function uploadCloud(file: any, folder: string) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided for upload.'))
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', C_PRESET as string)
    formData.append('folder', `assets/${folder}`)
    formData.append('api_key', C_API_KEY as string)
    formData.append('timestamp', C_TSTAMP.toString())

    fetch(C_UP_URL, {
      method: 'POST',
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          return reject(errorData || new Error('Upload failed.'))
        }
        const data = await res.json()
        return resolve(data)
      })
      .catch((err) => {
        return reject(err || new Error('Network error during upload.'))
      })
  })
}

export function listCloud() {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams()
    params.append('expression', 'name')
    params.append('sort_by[0][public_id]', 'desc')
    const authString = `${C_API_KEY}:${C_API_SCR}`
    const encodedAuth = btoa(authString)

    fetch(`${C_LC_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${encodedAuth}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          return reject(errorData || new Error('List failed.'))
        }
        const data = await res.json()
        return resolve(data)
      })
      .catch((err) => {
        return reject(err || new Error('Network error during listing.'))
      })
  })
}

export async function sendEmailMessage({
  subject = 'Hello World',
  sender = { name: APP_NAME as string, email: 'defrian.yarfi@gmail.com' },
  to = [{ name: 'John Doe', email: 'defrian.yarfi@gmail.com' }],
  messages = 'This is a test email sent from the application.',
  attachment = [
    {
      content: '',
      name: '',
      url: '',
    },
  ],
  sandbox = false,
}: {
  subject: string
  sender?: { name: string; email: string }
  to?: [{ name: string; email: string }]
  phone?: number
  messages?: string
  attachment?: [
    {
      content: string // Base64-encoded attachment data
      name: string // Attachment filename. Required when content is provided.
      url?: string // Absolute URL of the attachment. Local file paths are not supported.
    },
  ]
  sandbox?: boolean
}) {
  // Brevo API endpoint and payload construction
  const url = 'https://api.brevo.com/v3/smtp/email'
  const htmlContent = templateEmailCertificate({ subject, to, messages })
  // Construct the payload for Brevo API
  const payload = {
    sender,
    to,
    subject,
    htmlContent,
    attachment,
  }
  // Set up headers for the API request
  const headers = {
    'api-key': KEY_BREVO as string,
    accept: 'application/json',
    'Content-Type': 'application/json',
    ...(sandbox && { 'X-Sib-Sandbox': 'drop' }),
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Email send failed:', errorData)
    } else {
      const data = await response.json()
      console.log('Email sent:', data)
    }
  } catch (error) {
    console.error('Network or fetch error:', error)
  }
}

export function templateEmailCertificate({
  subject = 'Hello World',
  to = [{ name: 'John Doe', email: '' }],
  messages = 'This is a test email sent from the application.',
}) {
  return `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Certificate</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!-- Tailwind CSS v4 -->
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-gray-100">
            <div class="max-w-md mx-auto bg-white shadow-lg p-4 rounded-lg mt-10">
              <!-- Header -->
              <header class="mb-4">
                <h1 class="text-2xl font-bold text-center">${subject}</h1>
              </header>
              <!-- Certificate Details -->
              <main>
                <p>Dear ${to[0]?.name || 'Customer'},</p>
                <p class="text-gray-700 mb-2">Thank you for your participation. Below are your certificate details:</p>
                <p class="text-gray-700 mb-2">${messages}</p>
                <a href="#" class="block bg-red-900 text-white text-center px-4 py-2 rounded mt-4">View Details</a>
              </main>
              <!-- Footer -->
              <footer class="mt-4 text-center text-gray-600">
                <p>For any questions, contact support. <a href="${APP_URL}" target="_blank">${APP_NAME}</a></p>
              </footer>
            </div>
          </body>
          </html>`
}
