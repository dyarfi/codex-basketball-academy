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
}: {
  subject: string
  sender?: { name: string; email: string }
  to?: [{ name: string; email: string }]
  phone?: number
  messages?: string
}) {
  // Brevo API endpoint and payload construction
  const url = 'https://api.brevo.com/v3/smtp/email'
  const htmlContent = `<!DOCTYPE html><html><body><h3>${subject}</h3><p>Hello ${to[0]?.email || 'there'},</p>${messages}</p<hr><p style="font-size: 12px; color: #888;">This email was sent by ${APP_NAME} website: ${APP_URL}.</p></body></html>`
  // Construct the payload for Brevo API
  const payload = {
    sender,
    to,
    subject,
    htmlContent,
  }
  // Set up headers for the API request
  const headers = {
    'api-key': KEY_BREVO as string,
    accept: 'application/json',
    'Content-Type': 'application/json',
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
