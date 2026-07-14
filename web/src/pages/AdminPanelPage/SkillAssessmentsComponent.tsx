import React, { useState, useMemo, Fragment } from 'react'

import {
  Container,
  Group,
  Button,
  Badge,
  TextInput,
  Select,
  Text,
  Loader,
  Alert,
  Tooltip,
  Box,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch, IconPlus, IconAlertCircle } from '@tabler/icons-react'

import { routes, useParams } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import GraphSkills from 'src/components/Common/Graph/GraphSkills'
import { CrudTable } from 'src/components/CrudTable'
import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import SkillAssessmentModal from 'src/components/Modals/SkillAssessmentModal'
import { GET_PROGRAMS } from 'src/graphql/programs-queries'
import {
  GET_PAGINATED_SKILL_ASSESSMENTS,
  CREATE_SKILL_ASSESSMENT,
  UPDATE_SKILL_ASSESSMENT,
  DELETE_SKILL_ASSESSMENT,
} from 'src/graphql/skill-assessments-queries'
import { USERS_QUERY } from 'src/graphql/users-queries'

const getPageFromParam = (value: unknown) => {
  const parsedPage = Number(value)

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

const SkillAssessmentsPage = () => {
  const PAGE_SIZE = 10
  const { page = 1, search, programId } = useParams()

  const [searchQuery, setSearchQuery] = useState(
    typeof search === 'string' ? search : ''
  )
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const [programFilter, setProgramFilter] = useState<string | null>(
    typeof programId === 'string' ? programId : null
  )
  const [currentPage, setCurrentPage] = useState(() => getPageFromParam(page))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)

  const variables = {
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery || undefined,
    programId: programFilter || undefined,
  }

  const { data, loading, error, refetch } = useQuery(
    GET_PAGINATED_SKILL_ASSESSMENTS,
    {
      variables,
    }
  )

  // Fetch programs and users for the modal
  const { data: programsData, loading: programsLoading } =
    useQuery(GET_PROGRAMS)
  const { data: usersData, loading: usersLoading } = useQuery(USERS_QUERY, {
    variables: { role: 'PLAYER', isActive: true },
  })

  const assessments = data?.paginatedSkillAssessments?.items || []
  const totalAssessments = data?.paginatedSkillAssessments?.totalCount || 0
  const programs = programsData?.programs || []
  const players = usersData?.users || []
  const totalPages =
    data?.paginatedSkillAssessments?.totalPages ??
    Math.max(1, Math.ceil(totalAssessments / PAGE_SIZE))

  const programOptions = useMemo(() => {
    return programs.map((p: any) => ({ value: p.id, label: p.name }))
  }, [programs])

  const [createAssessment, { loading: isCreating }] = useMutation(
    CREATE_SKILL_ASSESSMENT,
    {
      onCompleted: () => {
        toast.success('Skill assessment created successfully')
        setIsModalOpen(false)
        refetch()
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to create skill assessment')
      },
      refetchQueries: [{ query: GET_PAGINATED_SKILL_ASSESSMENTS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const [updateAssessment, { loading: isUpdating }] = useMutation(
    UPDATE_SKILL_ASSESSMENT,
    {
      onCompleted: () => {
        toast.success('Skill assessment updated successfully')
        setIsModalOpen(false)
        setSelectedAssessment(null)
        refetch()
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to update skill assessment')
      },
      refetchQueries: [{ query: GET_PAGINATED_SKILL_ASSESSMENTS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const [deleteAssessment, { loading: isDeleting }] = useMutation(
    DELETE_SKILL_ASSESSMENT,
    {
      onCompleted: () => {
        toast.success('Skill assessment deleted successfully')
        setIsDeleteModalOpen(false)
        setSelectedAssessment(null)
        refetch()
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete skill assessment')
      },
      refetchQueries: [{ query: GET_PAGINATED_SKILL_ASSESSMENTS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const handleCreate = () => {
    setSelectedAssessment(null)
    setIsModalOpen(true)
  }

  const handleEdit = (assessment: any) => {
    setSelectedAssessment(assessment)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (assessment: any) => {
    setSelectedAssessment(assessment)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (values: any) => {
    if (selectedAssessment) {
      updateAssessment({
        variables: {
          id: selectedAssessment.id,
          input: values,
        },
      })
    } else {
      createAssessment({
        variables: {
          input: values,
        },
      })
    }
  }

  const handleConfirmDelete = () => {
    if (selectedAssessment) {
      deleteAssessment({
        variables: { id: selectedAssessment.id },
      })
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green'
    if (score >= 60) return 'blue'
    if (score >= 40) return 'yellow'
    return 'red'
  }

  const columns = [
    {
      key: 'user',
      header: 'Player',
      render: (val: any, user: Record<string, string>) => (
        <Tooltip
          withArrow
          label={
            <Box pos={'relative'} bg="white" p={'sm'}>
              <GraphSkills
                title={val?.profile?.firstName + ' ' + val?.profile?.lastName}
                graphData={[
                  {
                    skill: 'Defense',
                    value: user?.defense,
                  },
                  {
                    skill: 'Shooting',
                    value: user?.shooting,
                  },
                  {
                    skill: 'Dribble',
                    value: user?.dribbling,
                  },
                  {
                    skill: 'BasketballIQ',
                    value: user?.basketballIQ,
                  },
                  {
                    skill: 'Athleticism',
                    value: user?.athleticism,
                  },
                  {
                    skill: 'OverallScore',
                    value: user?.overallScore,
                  },
                ]}
              />
            </Box>
          }
        >
          <Text size="sm">
            {val?.profile?.firstName} {val?.profile?.lastName}
          </Text>
        </Tooltip>
      ),
    },
    {
      key: 'program',
      header: 'Program',
      render: (val: any) => <Text size="sm">{val?.name || 'N/A'}</Text>,
    },
    {
      key: 'overallScore',
      header: 'Overall Score',
      render: (val: number) => (
        <Badge color={getScoreColor(val)} variant="light">
          {val}/100
        </Badge>
      ),
    },
    {
      key: 'shooting',
      header: 'Shooting',
      render: (val: number) => (
        <Badge color={getScoreColor(val)} variant="dot">
          {val}
        </Badge>
      ),
    },
    {
      key: 'dribbling',
      header: 'Dribbling',
      render: (val: number) => (
        <Badge color={getScoreColor(val)} variant="dot">
          {val}
        </Badge>
      ),
    },
    {
      key: 'defense',
      header: 'Defense',
      render: (val: number) => (
        <Badge color={getScoreColor(val)} variant="dot">
          {val}
        </Badge>
      ),
    },
    {
      key: 'assessmentDate',
      header: 'Date',
      render: (val: string) => (
        <Text size="sm">{new Date(val).toLocaleDateString()}</Text>
      ),
    },
  ]

  if (loading && !data) {
    return (
      <Container size="xl" py="xl">
        <Group justify="center" p="xl">
          <Loader size="sm" />
        </Group>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="filled"
        >
          Failed to load skill assessments: {error.message}
        </Alert>
      </Container>
    )
  }

  return (
    <Container
      size="xl"
      py={{ base: 'sm', sm: 'md', md: 'xl' }}
      px={{ base: 'xs', sm: 'md' }}
    >
      <Group justify="space-between" mb="lg" grow={true} align="flex-start">
        <div>
          <Text size="lg" fw={700}>
            Skill Assessments Management
          </Text>
          <Text size="sm" color="dimmed">
            Track and manage player skill evaluations
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreate}
          color="blue"
        >
          Add New Assessment
        </Button>
      </Group>

      <Group
        gap="md"
        mb="lg"
        className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4"
        grow={true}
      >
        <TextInput
          placeholder="Search by player name or email..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          className="flex-1"
        />

        <Select
          placeholder="Filter by program"
          data={[{ value: '', label: 'All Programs' }, ...programOptions]}
          value={programFilter || ''}
          onChange={(value) => setProgramFilter(value || null)}
          clearable
        />
      </Group>

      <CrudTable
        data={assessments}
        columns={columns as any}
        isLoading={loading && !data}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {assessments.length > 0 && totalPages > 1 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setCurrentPage(newPage)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}

      <SkillAssessmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        assessmentData={selectedAssessment}
        users={players}
        programs={programs}
        isLoading={isCreating || isUpdating}
        isDataLoading={programsLoading || usersLoading}
      />

      <ConfirmDelete
        isOpen={isDeleteModalOpen}
        title="Delete Skill Assessment"
        message={`Are you sure you want to delete the skill assessment for "${selectedAssessment?.user?.profile?.firstName} ${selectedAssessment?.user?.profile?.lastName}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </Container>
  )
}

export default SkillAssessmentsPage
