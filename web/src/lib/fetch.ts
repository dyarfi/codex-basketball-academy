import React from 'react'

import { render } from '@react-email/render'
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

import {
  templateEmailCertificate,
  templateConfirmEmail,
  templateMemberAccepted,
} from './emailTemplates'
// // Sending a confirmation email
// await sendEmailMessage({
//   template: 'confirmEmail',
//   subject: 'Confirm your account',
//   to: [{ name: 'User Name', email: 'user@example.com' }],
//   url: 'https://example.com/confirm?token=123'
// })

// // Default certificate email (backward compatible)
// await sendEmailMessage({
//   subject: 'Your Certificate',
//   messages: 'Congratulations on completing the course!',
//   to: [{ name: 'User Name', email: 'user@example.com' }]
// })

const templateEmails = {
  confirmEmail: templateConfirmEmail,
  emailCertificate: templateEmailCertificate,
  memberAccepted: templateMemberAccepted,
}

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
  template = 'emailCertificate',
  subject = 'Hello World',
  sender = { name: APP_NAME as string, email: 'defrian.yarfi@gmail.com' },
  to = [{ name: 'John Doe', email: 'defrian.yarfi@gmail.com' }],
  messages = 'This is a test email sent from the application.',
  url = '',
  attachment = [
    {
      content: '',
      name: '',
      url: '',
    },
  ],
  sandbox = false,
}: {
  template?: keyof typeof templateEmails
  subject: string
  sender?: { name: string; email: string }
  to?: { name: string; email: string }[]
  phone?: number
  messages?: string
  url?: string
  attachment?: {
    content: string // Base64-encoded attachment data
    name: string // Attachment filename. Required when content is provided.
    url?: string // Absolute URL of the attachment. Local file paths are not supported.
  }[]
  sandbox?: boolean
}) {
  // Brevo API endpoint and payload construction
  const urlBrevo = 'https://api.brevo.com/v3/smtp/email'
  const selectedTemplate =
    templateEmails[template] || templateEmails.emailCertificate
  const htmlContent = await render(
    selectedTemplate({ subject, to, messages, url }) as React.ReactElement
  )
  // Construct the payload for Brevo API
  const payload = {
    sender,
    to,
    subject,
    htmlContent,
    ...(attachment[0]?.content ? { attachment } : undefined),
  }
  // Set up headers for the API request
  const headers = {
    'api-key': KEY_BREVO as string,
    accept: 'application/json',
    'Content-Type': 'application/json',
    ...(sandbox && { 'X-Sib-Sandbox': 'drop' }),
  }

  try {
    const response = await fetch(urlBrevo, {
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
