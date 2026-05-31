import React, { useState } from 'react'

import {
  Container,
  Group,
  Button,
  Badge,
  TextInput,
  Text,
  Loader,
  Alert,
  Modal,
  Stack,
} from '@mantine/core'

import { useQuery, useMutation } from '@redwoodjs/web'

import AdminLayout from 'src/components/AdminLayout/AdminLayout'
import { CrudTable } from 'src/components/CrudTable'
import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import { ToastContainer } from 'src/components/Toast/Toast'
import { useToast } from 'src/components/Toast/useToast'
import {
  GET_MESSAGES,
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  DELETE_MESSAGE,
} from 'src/graphql/messages-queries'

const MessagesComponent = () => {
  const { toasts, success, error: toastError, removeToast } = useToast()
  const { data, loading, error, refetch } = useQuery(GET_MESSAGES)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)

  const [deleteMessage, { loading: isDeleting }] = useMutation(DELETE_MESSAGE, {
    onCompleted: () => {
      success('Message deleted successfully')
      setIsDeleteModalOpen(false)
      setSelectedMessage(null)
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to delete message')
    },
    refetchQueries: [{ query: GET_MESSAGES }],
    awaitRefetchQueries: true,
  })

  const messages = data?.messages || []

  const handleDeleteClick = (message: any) => {
    setSelectedMessage(message)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedMessage) {
      deleteMessage({ variables: { id: selectedMessage.id } })
    }
  }

  const columns = [
    {
      key: 'sender',
      header: 'Sender',
      render: (_: any, msg: any) =>
        msg.sender?.profile
          ? `${msg.sender.profile.firstName} ${msg.sender.profile.lastName}`
          : msg.sender?.email,
    },
    {
      key: 'recipient',
      header: 'Recipient',
      render: (_: any, msg: any) =>
        msg.recipient?.profile
          ? `${msg.recipient.profile.firstName} ${msg.recipient.profile.lastName}`
          : msg.recipient?.email,
    },
    { key: 'subject', header: 'Subject' },
    { key: 'content', header: 'Content' },
    {
      key: 'isRead',
      header: 'Read',
      render: (val: boolean) => (
        <Badge color={val ? 'green' : 'gray'}>{val ? 'Yes' : 'No'}</Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (val: string) => new Date(val).toLocaleString(),
    },
    // {
    //   key: 'actions',
    //   header: 'Actions',
    //   render: (_: any, msg: any) => (
    //     <Group>
    //       <Button color="red" size="xs" onClick={() => handleDeleteClick(msg)}>
    //         Delete
    //       </Button>
    //     </Group>
    //   ),
    // },
  ]

  if (loading) {
    return (
      <AdminLayout>
        <Container size="xl" py="xl">
          <Group justify="center" p="xl">
            <Loader size="sm" />
          </Group>
        </Container>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Container size="xl" py="xl">
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <h1 className="mb-6 text-2xl font-bold">Messages</h1>
        {error && (
          <Alert color="red" className="mb-6">
            Failed to load messages: {error.message}
          </Alert>
        )}
        <CrudTable
          columns={columns}
          data={messages}
          onDelete={handleDeleteClick}
        />
        <ConfirmDelete
          isOpen={isDeleteModalOpen}
          title="Delete Message"
          message="Are you sure you want to delete this message?"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      </Container>
    </AdminLayout>
  )
}

export default MessagesComponent
