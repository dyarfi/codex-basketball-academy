const C_API_KEY = process.env.CLOUDINARY_API_KEY
const C_API_SCR = process.env.CLOUDINARY_API_SECRET
const C_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET
const C_CLOUD = process.env.CLOUDINARY_NAME

const C_TSTAMP = Date.now() / 1000
const C_UP_URL = `https://api.cloudinary.com/v1_1/${C_CLOUD}/image/upload`
const C_LC_URL = `https://api.cloudinary.com/v1_1/${C_CLOUD}/resources/search`

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

export function sendWhatsAppBusiness({
  subject,
  phone,
  messages,
}: {
  subject: string
  phone: number
  messages: string
}) {
  const url = 'https://graph.facebook.com/v22.0/722635610936779/messages'

  const payload = {
    messaging_product: 'whatsapp',
    // to: '+62' + phone,
    to: '+6287882276763',
    type: 'text',
    text: {
      // the text object
      // preview_url: false,
      body: 'Hello asdadsa asdasda. Site: https://dykraf.com',
    },
    // template: {
    //   name: 'hello_world',
    //   language: { code: 'en_US' },
    // },
  }
  //  EAAKWlHqY26QBPS2s1GsvG3vKIadzCkt8DeYd01EBTd1TKv6FHZAWtZBpIxYyFPSDNTUjVOZB4cpOQ5WgaqGvqXq9GnaH8wiCTg5T8m3FwDwCHpHrI2NQJ7qp5N7gn9U8GaOTYy8afVhhQPQ1ExP2LpavMCfLk8Fb4kQKcZBSDUrwyW6Ta0NJQwj6cUW7hCeAZAwZDZD
  const headers = {
    Authorization:
      'Bearer EAAQI5nP84UABPVR2kz2hYkjJxXZC9sGAJrFHZB5da0X2zmtPLBUvXwnSb0910x1bIEJiPZCRluPU64oggWolxiTyJ5kxunLKplYaPxaq0FV1xYeZCXX067ZCDGFlpFnhHYuZC13eJAJDbZCGIZCzopn0s9vVm61wWPQZBzcMRFpVgxYDwSc8RFEzn2xVbfZBZC3k7ZCpZCwZDZD',
    'Content-Type': 'application/json',
  }

  fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error('Error sending message:', errorData)
        return
      }
      const data = await res.json()
      console.log('Message sent:', data)
    })
    .catch((error) => {
      console.error('Network or fetch error:', error)
    })
}

export async function sendEmailMessage({
  subject = 'Hello World',
  sender: { name = 'Dykaf', email = 'defrian.yarfi@gmail.com' },
  to = [],
  messages = '<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo.</p></body></html>',
}: {
  subject: string
  sender: { name: string; email: string }
  to: [{ name: string; email: string }]
  phone: number
  messages: string
}) {
  const url = 'https://api.brevo.com/v3/smtp/email'

  const payload = {
    sender: {
      name,
      email,
    },
    to: to.length
      ? to
      : [
          {
            email: 'defrian.yarfi@gmail.com',
            name: 'John Doe',
          },
        ],
    subject,
    htmlContent: messages,
  }

  const headers = {
    'api-key':
      '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',
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
