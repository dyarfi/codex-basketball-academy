import { useEffect, useState } from 'react'

import {
  Box,
  Grid,
  Group,
  TextInput,
  Flex,
  Radio,
  CheckIcon,
  Textarea,
  Button,
  Image,
  Text,
  LoadingOverlay,
} from '@mantine/core'
/* Mantine Icons */
import { DateInput, DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import {
  IconUserCheck,
  IconDeviceMobileShare,
  IconSend,
  IconClock,
  IconShield,
  IconBallBasketball,
  IconAt,
} from '@tabler/icons-react'
import dayjs from 'dayjs'

/* Mantine Dates */

import '@mantine/dates/styles.css'
import { useParams } from '@redwoodjs/router'

import { generateCode } from 'src/lib/utils'
import { CreateMessageInput } from 'src/types/graphql'
import { MessageType, MetaType } from 'src/types/site-type'

import { ModalSuccess } from '../Modal/ModalSuccess'

import classes from './RadioCard.module.css'

const SITE_NAME = process.env.SITE_NAME
// const URL_API = process.env.URL_API

// import { ImageCheckboxes, ImageRadioInputs } from "./ImageCheckBox";

export function FormTrial({
  onSubmit,
  csrfToken,
  loading,
}: {
  onSubmit?: (input: CreateMessageInput) => {}
  csrfToken?: string
  loading: boolean
}) {
  const { query } = useParams()
  const [completed, setCompleted] = useState(false)
  const [valueDate, setValueDate] = useState<string | null>(null)
  const [fieldDisabled, setFieldDisabled] = useState<boolean | false>(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      fullName: (query?.fullName as string) || '',
      email: '',
      address: '',
      birthDate: '',
      phone: '',
      parentName: '',
      parentPhone: '',
      gender: 1,
      title: '',
      trialLocation: 'ccp',
      code: '',
    },

    validate: {
      fullName: (value) =>
        /^[a-zA-Z\d\s\-\.]+$/i.test(value) ? null : 'Format Nama Salah',
      address: (value) =>
        /^[a-zA-Z\d\s\-\.\,\(\)]+$/i.test(value) ? null : 'Format Alamat Salah',
      // birthDate: (value) =>
      //   /^[0-3]?[0-9]\/[0-3]?[0-9]\/(?:[0-9]{2})?[0-9]{2}$/i.test(value)
      //     ? null
      //     : "Format Tanggal Salah",
      phone: (value) =>
        /^[0-9]+$/i.test(value) ? null : 'Format Handphone Salah',
      parentName: (value) =>
        /^[a-zA-Z\d\s\-\.]+$/i.test(value) ? null : 'Format Nama Salah',
      parentPhone: (value) =>
        /^[0-9]+$/i.test(value) ? null : 'Format Handphone Salah',
    },

    // onValuesChange(values, previous) {},
  })

  useEffect(() => {
    if (form.submitting) {
      setFieldDisabled(true)
    } else {
      setFieldDisabled(false)
    }
  }, [form.submitting])

  const data = [
    {
      name: 'Community Center Pamulang (CCP)',
      value: 'ccp',
      description: 'Core components library: inputs, buttons, overlays, etc.',
    },
    {
      name: 'Sola Sport Hall (BSD)',
      value: 'sola',
      description: 'Collection of reusable hooks for React applications.',
    },
  ]

  const cards = data.map((item, i) => (
    <Radio.Card
      className={classes.root}
      radius="md"
      value={item.value}
      key={item.name}
      name="trialLocation"
    >
      <Group wrap="nowrap" key={item.name}>
        <Radio.Indicator key={i} icon={CheckIcon} />
        <div>
          <Text className={classes.label}>{item.name}</Text>
          <Text className={classes.description}>{item.description}</Text>
        </div>
      </Group>
    </Radio.Card>
  ))

  return (
    <Box py={{ base: 0, md: 24 }}>
      {query && query?.fullName ? (
        <Text mb={15} fw={600} size="lg">
          Lanjut lagi daftar-nya yuk
        </Text>
      ) : (
        ''
      )}
      <Grid h={'100%'} grow gutter={{ base: 0, lg: 'md' }}>
        <Grid.Col span={{ base: 12, sm: 6 }} p={0}>
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
          <form
            id="formTrial"
            onSubmit={form.onSubmit(async (values) => {
              const code = await generateCode(10)
              setCompleted(false)
              // values.birthDate = dayjs(values.birthDate).format('DD-MM-YYYY')
              values.birthDate = valueDate
              values.code = code
              values.title = 'ROOKIE'
              onSubmit({
                subject: 'Trial',
                status: 1,
                type: MessageType.TRIAL,
                meta: MetaType.JSON,
                message: JSON.stringify(values),
              })
              // const res = await fetch(`${URL_API}/service/contact/trial`, {
              //   method: 'POST',
              //   body: JSON.stringify(values),
              //   next: { revalidate: 0 },
              // })
              // const json = await res.json()
              // if (json) {
              //   setCompleted(true)
              //   form.reset()
              // }
              form.reset()
              setValueDate(null)
            })}
            method="POST"
          >
            <input
              name="csrfToken"
              type="hidden"
              defaultValue={csrfToken || ''}
            />
            <Grid
              grow
              justify="space-between"
              align="flex-start"
              gutter={{ base: 0, lg: 'sm' }}
            >
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  disabled={fieldDisabled}
                  required
                  key={form.key('fullName')}
                  {...form.getInputProps('fullName')}
                  mb={{ base: 8, xs: 12 }}
                  label="Nama Lengkap"
                  placeholder="Nama Lengkap"
                  size="md"
                  leftSection={<IconUserCheck size={18} />}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <label htmlFor="gender">
                  <legend>Jenis Kelamin</legend>
                  <Radio.Group
                    key={form.key('gender')}
                    {...form.getInputProps('gender')}
                    defaultValue="1"
                  >
                    <Flex
                      mih={50}
                      gap="sm"
                      justify="flex-start"
                      // align="center"
                      direction="row"
                      wrap="wrap"
                      pt={6}
                    >
                      <Radio
                        disabled={fieldDisabled}
                        size="md"
                        icon={CheckIcon}
                        label="Putra"
                        name="gender"
                        value="1"
                      />
                      <Radio
                        disabled={fieldDisabled}
                        size="md"
                        icon={CheckIcon}
                        label="Putri"
                        name="gender"
                        value="2"
                      />
                    </Flex>
                  </Radio.Group>
                </label>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  required
                  disabled={fieldDisabled}
                  key={form.key('email')}
                  {...form.getInputProps('email')}
                  mb={{ base: 8, xs: 12 }}
                  label="Email"
                  placeholder="Email"
                  size="md"
                  leftSection={<IconAt size={18} />}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DatePickerInput
                  dropdownType="modal"
                  minDate={dayjs().subtract(18, 'year').format('YYYY-MM-DD')}
                  maxDate={dayjs().subtract(4, 'year').format('YYYY-MM-DD')}
                  radius={0}
                  disabled={fieldDisabled}
                  required
                  key={form.key('birthDate')}
                  {...form.getInputProps('birthDate')}
                  valueFormat="DD-MM-YYYY"
                  label="Tanggal Lahir"
                  placeholder="DD-MM-YYYY"
                  clearable
                  defaultValue={valueDate}
                  onChange={setValueDate}
                  leftSection={<IconClock size={18} />}
                  size="md"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  disabled={fieldDisabled}
                  required
                  key={form.key('phone')}
                  {...form.getInputProps('phone')}
                  mb={{ base: 8, xs: 12 }}
                  label="Handphone Pribadi"
                  placeholder="No Hp"
                  size="md"
                  leftSection={<IconDeviceMobileShare size={18} />}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  disabled={fieldDisabled}
                  required
                  key={form.key('parentName')}
                  {...form.getInputProps('parentName')}
                  mb={{ base: 8, xs: 12 }}
                  label="Nama Orang Tua"
                  placeholder="Nama Orang Tua"
                  size="md"
                  leftSection={<IconShield size={18} />}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  disabled={fieldDisabled}
                  required
                  key={form.key('parentPhone')}
                  {...form.getInputProps('parentPhone')}
                  mb={{ base: 8, xs: 12 }}
                  label="Handphone Orang Tua"
                  placeholder="No Hp. Orang Tua"
                  size="md"
                  leftSection={<IconDeviceMobileShare size={18} />}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 12 }} pb={15}>
                <label htmlFor="locationTrial">
                  <legend>Lokasi Trial</legend>
                  <Radio.Group
                    key={form.key('locationTrial')}
                    {...form.getInputProps('locationTrial')}
                    defaultValue="ccp"
                    mt={{ base: 10, sm: 15 }}
                  >
                    <Grid columns={12}>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <Radio
                          disabled={fieldDisabled}
                          size="md"
                          icon={CheckIcon}
                          value="ccp"
                          label="Community Center Pamulang (CCP)"
                          description="Sabtu 10.00 - 12.00 WIB"
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <Radio
                          disabled={fieldDisabled}
                          size="md"
                          icon={CheckIcon}
                          value="sola"
                          label="Sola Sport Hall (BSD)"
                          description="Sabtu - Minggu 16.00 - 18.00 WIB"
                        />
                      </Grid.Col>
                    </Grid>
                  </Radio.Group>
                </label>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 12 }}>
                <Textarea
                  disabled={fieldDisabled}
                  required
                  key={form.key('address')}
                  {...form.getInputProps('address')}
                  mb={{ base: 8, xs: 12 }}
                  size="md"
                  label="Alamat Lengkap"
                  placeholder="Alamat Lengkap Domisili"
                  autosize
                  minRows={3}
                  maxRows={12}
                  wrapperProps={{ input: { name: 'address' } }}
                />
                {/* <Switch
                  defaultChecked={false}
                  name="agreement"
                  label="Saya setuju dengan syarat dan ketentuan"
                  mb={20}
                /> */}
                <Button
                  radius={0}
                  type="submit"
                  variant="filled"
                  w={'100%'}
                  size="lg"
                  leftSection={<IconSend size={18} type="submit" />}
                  loading={form.submitting}
                  disabled={form.submitting}
                >
                  Kirim
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }} visibleFrom="md">
          <Image
            src="images/half_logo.png"
            width={'100%'}
            height={'230'}
            alt={SITE_NAME}
          />
          <Box my={{ base: 0, md: 30 }} mx={{ base: 0, md: 10 }} c="dimmed">
            <b style={{ textTransform: 'uppercase' }}>Jadwal waktu & tempat</b>{' '}
            <br />
            <ul style={{ listStyle: 'none', paddingLeft: '.5rem' }}>
              <li>
                <IconBallBasketball
                  style={{ verticalAlign: 'middle', marginRight: '.25rem' }}
                />
                <b>Sola Sport Hall (BSD)</b> <br />
                🗓️ : Sabtu, 1 Februari 2025 <br />
                🕒 : 10.00 - 12.00 WIB <br />
                🏟️ : SOLA SPORT
                <br />
                <Box component="address">
                  HALL Nusa Loka, Jl. Batam Blok J11, 4 Selatan BSD No.Kav 02
                  Sektor 14, Serpong, Tangerang Selatan
                </Box>
                <br /> 📍 : https://maps.app.goo.gl/7Ryuas1SgSPs9trP6
                <br />
                <br />
              </li>
            </ul>
          </Box>
        </Grid.Col>
      </Grid>
      {completed ? <ModalSuccess onClose={() => {}} /> : null}
    </Box>
  )
}
