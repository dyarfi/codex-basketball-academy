import { useState, FormEvent, ChangeEvent } from 'react'

import { useMutation } from '@apollo/client'
import {
  TextInput,
  Textarea,
  Button,
  Paper,
  Title,
  Stack,
  Alert,
  Group,
  Flex,
} from '@mantine/core'
import { IconCheck, IconAlertCircle } from '@tabler/icons-react'

import { CREATE_MESSAGE } from '../../graphql/messages-queries'

interface ContactFormProps {
  senderId?: string
  recipientId?: string
}

interface FormData {
  name: string
  email: string
  subject: string
  content: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  content?: string
}

export function ContactForm({
  senderId = '',
  recipientId = '',
}: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    content: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const [createMessage, { loading, error, data }] = useMutation(
    CREATE_MESSAGE,
    {
      onCompleted: () => {
        // Reset form on success
        setFormData({ name: '', email: '', subject: '', content: '' })
        setErrors({})
      },
      onError: (error) => {
        console.error('Message creation error:', error)
      },
    }
  )

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.content.trim()) {
      newErrors.content = 'Message content is required'
    }

    if (formData.subject && formData.subject.length > 200) {
      newErrors.subject = 'Subject must be less than 200 characters'
    }

    if (formData.content.length > 5000) {
      newErrors.content = 'Message must be less than 5000 characters'
    }

    if (formData.name.length <= 2) {
      newErrors.name = 'Name must be at least 3 characters'
    }
    if (formData.email.length <= 2) {
      newErrors.email = 'Email must be at least 3 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      // Add a new schema for contact us
      await createMessage({
        variables: {
          input: {
            senderId: 'public',
            recipientId: 'public',
            isRead: false,
            subject: formData.subject.trim() || null,
            content: formData.content.trim(),
          },
        },
      })
    } catch (err) {
      // Error is handled by onError callback
    }
  }

  const handleChange =
    (field: keyof FormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))
      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }))
      }
    }

  return (
    <Paper shadow="sm" p="xl" radius="md">
      <form onSubmit={handleSubmit} className="text-slate-900">
        <Stack gap="md">
          <Title order={2}>Send Us Message</Title>

          {data && (
            <Alert
              icon={<IconCheck size={16} />}
              title="Success"
              color="green"
              variant="light"
            >
              Your message has been sent successfully!
            </Alert>
          )}

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              variant="light"
            >
              {error.message || 'Failed to send message. Please try again.'}
            </Alert>
          )}
          <Flex justify="space-between">
            <TextInput
              label="Name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange('name')}
              error={errors.name}
              disabled={loading}
              required
              w="48%"
            />
            <TextInput
              label="Email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              disabled={loading}
              required
              w="48%"
            />
          </Flex>
          <TextInput
            label="Subject"
            placeholder="Enter message subject (optional)"
            value={formData.subject}
            onChange={handleChange('subject')}
            error={errors.subject}
            disabled={loading}
            required
          />

          <Textarea
            label="Message"
            placeholder="Enter your message"
            value={formData.content}
            onChange={handleChange('content')}
            error={errors.content}
            minRows={6}
            required
            disabled={loading}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={!formData.content.trim()}
            fullWidth
            size="lg"
          >
            Send Message
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}
