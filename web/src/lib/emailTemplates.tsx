// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email'

// import { theme } from '../../config/tailwind.config'
// import { BarebonesFonts } from './theme-fonts'
const APP_NAME = process.env.APP_NAME as string
const APP_URL = process.env.APP_URL as string

const baseUrl = APP_URL ? `https://${APP_URL}` : ''

interface ConfirmEmailProps {
  companyName: string
  url: string
}

interface CertificateEmailProps {
  companyName: string
  url: string
  subject: string
  messages: string
  to: Record<string, string>
}

export function templateConfirmEmail({
  companyName = APP_NAME,
  url,
}: ConfirmEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head>{/* <BarebonesFonts /> */}</Head>
        <Body className="bg-bg-2 m-0 text-center font-sans">
          <Preview>Confirm your email address</Preview>
          <Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-[640px]">
            <Section>
              <Section className="bg-bg mobile:px-2 px-6 py-4">
                <Section className="mb-3 px-6">
                  <Row>
                    <Column className="w-1/2 py-[7px] align-middle">
                      <Row>
                        <Column className="w-[32px] align-middle">
                          <Img
                            src={`${baseUrl}/static/shared/logo-black.png`}
                            alt=""
                            width={23}
                            className="block"
                          />
                        </Column>
                      </Row>
                    </Column>
                    <Column
                      align="right"
                      className="w-1/2 py-[7px] align-middle"
                    >
                      <Text className="font-13 m-0 text-right font-sans">
                        <span className="text-fg-3">{companyName}</span>
                      </Text>
                    </Column>
                  </Row>
                </Section>

                <Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-[40px] py-[64px] text-center">
                  <Section className="mb-3">
                    <Img
                      src={`${baseUrl}/static/shared/logo-black.png`}
                      alt="Logo"
                      width={48}
                      className="mx-auto mb-5 block"
                    />
                    <Heading as="h1" className="font-28 text-fg m-0 font-sans">
                      We&apos;re almost there!
                    </Heading>
                  </Section>

                  <Text className="font-16 text-fg-2 mx-auto mb-8 mt-0 max-w-[380px] text-center font-sans">
                    Thank you for signing up for {companyName}.
                    <br />
                    To verify your account, we just need to confirm your email
                    address.
                  </Text>

                  <Section className="mb-6 text-center">
                    <Button
                      href={url}
                      className="bg-fg font-16 text-fg-inverted inline-block rounded-lg px-7 py-4 text-center font-sans leading-6"
                    >
                      Confirm email
                    </Button>
                  </Section>

                  <Text className="font-13 text-fg-3 mx-auto mb-0 mt-8 max-w-[400px] text-center font-sans">
                    If you didn&apos;t request this,
                    <br />
                    please ignore this email.
                  </Text>
                </Section>

                {/* Footer */}
                <Section className="bg-bg">
                  <Row>
                    <Column className="px-6 py-10 text-center">
                      <Text className="font-13 text-fg-3 mx-auto mb-8 mt-0 max-w-[280px] text-center font-sans">
                        Barebones is the catchy slogan that perfectly
                        encapsulates the vision of our company.
                      </Text>

                      <Section className="mb-8">
                        <Link
                          href="https://example.com/"
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${baseUrl}/static/shared/social-x-black.png`}
                            alt="X"
                            width={18}
                            className="block"
                          />
                        </Link>
                        <Link
                          href="https://example.com/"
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${baseUrl}/static/shared/social-in-black.png`}
                            alt="LinkedIn"
                            width={18}
                            className="block"
                          />
                        </Link>
                        <Link
                          href="https://example.com/"
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${baseUrl}/static/shared/social-yt-black.png`}
                            alt="YouTube"
                            width={18}
                            className="block"
                          />
                        </Link>
                        <Link
                          href="https://example.com/"
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${baseUrl}/static/shared/social-gh-black.png`}
                            alt="GitHub"
                            width={18}
                            className="block"
                          />
                        </Link>
                      </Section>

                      <Text className="font-11 text-fg-3 mb-5 mt-4 text-center font-sans">
                        123 Market Street, Floor 1
                        <br />
                        Tech City, CA, 94102
                      </Text>
                      <Text className="font-11 text-fg-3 m-0 text-center font-sans">
                        <Link href="https://example.com/" className="text-fg-3">
                          Unsubscribe
                        </Link>{' '}
                        from {companyName} marketing emails.
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}

export function templateEmailCertificate({
  subject = 'Hello World',
  to = [{ name: 'John Doe', email: '' }],
  messages = 'This is an online certificate email sent from the application.',
  companyName = APP_NAME,
  url = '',
}: CertificateEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head>{/* <BarebonesFonts /> */}</Head>
        <Body className="bg-bg-2 m-0 text-center font-sans">
          <Preview>Your online certificate</Preview>
          <Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-[640px]">
            <Section>
              <Section className="bg-bg mobile:px-2 px-6 py-4">
                <Section className="mb-3 px-6">
                  <Row>
                    <Column className="w-1/2 py-[7px] align-middle">
                      <Row>
                        <Column className="w-[32px] align-middle">
                          <Img
                            src={`${baseUrl}/favicon.png`}
                            alt=""
                            width={23}
                            className="block"
                          />
                        </Column>
                      </Row>
                    </Column>
                    <Column
                      align="right"
                      className="w-1/2 py-[7px] align-middle"
                    >
                      <Text className="font-13 m-0 text-right font-sans">
                        <span className="text-fg-3">{companyName}</span>
                      </Text>
                    </Column>
                  </Row>
                </Section>

                <Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-[40px] py-[64px] text-center">
                  <Section className="mb-3">
                    <Img
                      src={`${baseUrl}/static/shared/logo-black.png`}
                      alt="Logo"
                      width={48}
                      className="mx-auto mb-5 block"
                    />
                    <Heading as="h1" className="font-28 text-fg m-0 font-sans">
                      We&apos;re almost there!
                    </Heading>
                  </Section>

                  <Text className="font-16 text-fg-2 mx-auto mb-8 mt-0 max-w-[380px] text-center font-sans">
                    Thank you for signing up for {companyName}.
                    <br />
                    To verify your account, we just need to confirm your email
                    address.
                  </Text>

                  <Section className="mb-6 text-center">
                    <Button
                      href={url}
                      className="bg-fg font-16 text-fg-inverted inline-block rounded-lg px-7 py-4 text-center font-sans leading-6"
                    >
                      Confirm email
                    </Button>
                  </Section>

                  <Text className="font-13 text-fg-3 mx-auto mb-0 mt-8 max-w-[400px] text-center font-sans">
                    If you didn&apos;t request this,
                    <br />
                    please ignore this email.
                  </Text>
                </Section>

                {/* Footer */}
                <Section className="bg-bg">
                  <Row>
                    <Column className="px-6 py-10 text-center">
                      <Text className="font-13 text-fg-3 mx-auto mb-8 mt-0 max-w-[280px] text-center font-sans">
                        Barebones is the catchy slogan that perfectly
                        encapsulates the vision of our company.
                      </Text>

                      <Section className="mb-8">
                        <Link
                          href="https://example.com/"
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${baseUrl}/static/shared/social-x-black.png`}
                            alt="X"
                            width={18}
                            className="block"
                          />
                        </Link>
                        <Link
                          href="https://example.com/"
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${baseUrl}/static/shared/social-in-black.png`}
                            alt="LinkedIn"
                            width={18}
                            className="block"
                          />
                        </Link>
                        <Link
                          href="https://example.com/"
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${baseUrl}/static/shared/social-yt-black.png`}
                            alt="YouTube"
                            width={18}
                            className="block"
                          />
                        </Link>
                        <Link
                          href="https://example.com/"
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${baseUrl}/static/shared/social-gh-black.png`}
                            alt="GitHub"
                            width={18}
                            className="block"
                          />
                        </Link>
                      </Section>

                      <Text className="font-11 text-fg-3 mb-5 mt-4 text-center font-sans">
                        123 Market Street, Floor 1
                        <br />
                        Tech City, CA, 94102
                      </Text>
                      <Text className="font-11 text-fg-3 m-0 text-center font-sans">
                        <Link href="https://example.com/" className="text-fg-3">
                          Unsubscribe
                        </Link>{' '}
                        from {companyName} marketing emails.
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}

/*
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

export function templateForgotPassword({
  subject = 'Reset Your Password',
  to = [{ name: 'John Doe', email: '' }],
  messages = 'This is a forgot password email sent from the application.',
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
              <header class="mb-4">
                <h1 class="text-2xl font-bold text-center">${subject}</h1>
              </header>
              <main>
                <a href="#" class="block bg-red-900 text-white text-center px-4 py-2 rounded mt-4">View Details</a>
                Hello {{UserName}},
                <br />
                We received a request to reset the password for your account.
                <br />
                To create a new password, please click the link below:
                <br />
                {{ResetPasswordURL}}
                <br />
                For your security, this link will expire in {{ExpirationTime}}.
                <br />
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                <br />
                If the button or link above does not work, copy and paste the following URL into your browser:
                <br />
                {{ResetPasswordURL}}
                <br />
                If you need assistance, please contact our support team.
                <br />
                Best regards,
                <br />
                {{CompanyName}} Support Team
                {{SupportEmail}}
              </main>
              <!-- Footer -->
              <footer class="mt-4 text-center text-gray-600">
                <p>For any questions, contact support. <a href="${APP_URL}" target="_blank">${APP_NAME}</a></p>
              </footer>
            </div>
          </body>
          </html>`
}





*/
