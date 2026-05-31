import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Font,
} from '@react-pdf/renderer'

// Register the font
Font.register({
  family: 'Caveat',
  src: '/fonts/caveat/Caveat-Regular.ttf',
})

interface CertificateData {
  certificateNumber: string
  title: string
  description?: string
  userName: string
  programName: string
  achievementDate: string
  graduationClass?: string
  ageGroupTeam?: string
  issuedBy?: string
  expiryDate?: string
  signatureUrl?: string
  verifiedAt?: string
  pdfUrl?: string
  templateId?: string
  isDark?: boolean
}

type NextPage = {
  nextPage?: string[]
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
  },
  pageDark: {
    backgroundColor: '#1a1a1a',
  },
  container: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  main: {
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 10,
  },
  header: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    marginTop: 5,
    fontSize: 50,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
  },
  titleDark: {
    marginTop: 5,
    fontSize: 50,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  subtitleDark: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  recipientSection: {
    marginBottom: 20,
    textAlign: 'center',
  },
  recipientLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  recipientLabelDark: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
  recipientName: {
    fontSize: 38,
    // fontWeight: 'bold',
    fontFamily: 'Caveat',
    color: '#1a1a1a',
    // textDecoration: 'underline',
    marginTop: 10,
  },
  recipientNameDark: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
    textDecoration: 'underline',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 1.6,
  },
  descriptionDark: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 1.6,
  },
  detailsGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 11,
    marginBottom: 11,
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '48%',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 3,
  },
  detailLabelDark: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  detailValueDark: {
    fontSize: 14,
    color: '#ffffff',
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerDark: {
    marginTop: 'auto',
    borderTopColor: '#444',
    borderTopWidth: 1,
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '30%',
  },
  signatureImage: {
    width: 54,
    height: 48,
    marginBottom: 10,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    width: '100%',
    marginBottom: 5,
  },
  signatureLineDark: {
    borderTopWidth: 1,
    borderTopColor: '#ffffff',
    width: '100%',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  signatureTextDark: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 20,
  },
  certNumber: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
  },
  certNumberDark: {
    fontSize: 10,
    color: '#aaa',
    marginBottom: 5,
  },
})

export const CertificatePDF = ({
  certificateNumber,
  title: _title,
  description,
  userName,
  programName,
  achievementDate,
  graduationClass,
  ageGroupTeam,
  issuedBy,
  expiryDate,
  signatureUrl,
  verifiedAt,
  pdfUrl: _pdfUrl,
  templateId,
  isDark = false,
  nextPage,
}: CertificateData & NextPage) => {
  const pageStyle = isDark ? styles.pageDark : styles.page
  const titleStyle = isDark ? styles.titleDark : styles.title
  const subtitleStyle = isDark ? styles.subtitleDark : styles.subtitle
  const recipientLabelStyle = isDark
    ? styles.recipientLabelDark
    : styles.recipientLabel
  const recipientNameStyle = isDark
    ? styles.recipientNameDark
    : styles.recipientName
  const descriptionStyle = isDark ? styles.descriptionDark : styles.description
  const detailLabelStyle = isDark ? styles.detailLabelDark : styles.detailLabel
  const detailValueStyle = isDark ? styles.detailValueDark : styles.detailValue
  const footerStyle = isDark ? styles.footerDark : styles.footer
  const signatureLineStyle = isDark
    ? styles.signatureLineDark
    : styles.signatureLine
  const signatureTextStyle = isDark
    ? styles.signatureTextDark
    : styles.signatureText
  const certNumberStyle = isDark ? styles.certNumberDark : styles.certNumber
  console.log({})

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={pageStyle}>
        <ImageBackground
          src={`/certs/${templateId ? templateId : 'cert-template-01.png'}`}
        >
          <View style={styles.container}>
            <View>
              <View style={styles.main}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={titleStyle}>CERTIFICATE</Text>
                  <Text style={subtitleStyle}>of Achievement</Text>
                </View>

                {/* Recipient Section */}
                <View style={styles.recipientSection}>
                  <Text style={recipientLabelStyle}>
                    This certificate is proudly presented to
                  </Text>
                  <Text style={recipientNameStyle}>{userName}</Text>
                </View>

                {/* Main Description */}
                {description && (
                  <Text style={descriptionStyle}>{description}</Text>
                )}

                {/* Details Grid */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    {/* <Image
                      src={<IconProgress size={18} />}
                      style={styles.signatureImage}
                      debug={true}
                    /> */}
                    {/* <IconProgress size={18} /> */}
                    <Text style={detailLabelStyle}>PROGRAM</Text>
                    <Text style={detailValueStyle}>{programName}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={detailLabelStyle}>ACHIEVEMENT DATE</Text>
                    <Text style={detailValueStyle}>
                      {new Date(achievementDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>

                  {graduationClass && (
                    <View style={styles.detailItem}>
                      <Text style={detailLabelStyle}>GRADUATION CLASS</Text>
                      <Text style={detailValueStyle}>{graduationClass}</Text>
                    </View>
                  )}

                  {ageGroupTeam && (
                    <View style={styles.detailItem}>
                      <Text style={detailLabelStyle}>TEAM</Text>
                      <Text style={detailValueStyle}>{ageGroupTeam}</Text>
                    </View>
                  )}

                  {expiryDate && (
                    <View style={styles.detailItem}>
                      <Text style={detailLabelStyle}>VALID UNTIL</Text>
                      <Text style={detailValueStyle}>
                        {new Date(expiryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Footer with Signature */}
                <View style={footerStyle}>
                  {signatureUrl && (
                    <View style={styles.signatureSection}>
                      <Image src={signatureUrl} style={styles.signatureImage} />
                    </View>
                  )}

                  <View style={styles.signatureSection}>
                    <View style={signatureLineStyle} />
                    <Text style={signatureTextStyle}>
                      {issuedBy || 'Program Director'}
                    </Text>
                  </View>

                  <View style={styles.signatureSection}>
                    <View style={signatureLineStyle} />
                    <Text style={signatureTextStyle}>
                      Date {verifiedAt ? `: ${verifiedAt}` : ''}
                    </Text>
                  </View>
                </View>

                <Text style={certNumberStyle}>
                  Certificate #{certificateNumber}
                </Text>
              </View>
            </View>
          </View>
          {nextPage && (
            <View style={styles.container}>
              <View style={{ marginTop: 40, height: 500 }}>
                <View style={styles.main}>
                  {/* Header */}
                  <View style={styles.header}>
                    <Text style={titleStyle}>ASSESSMENTS</Text>
                    <Text style={subtitleStyle}>of Achievement</Text>
                  </View>

                  {/* Main Assessment */}
                  <View style={{ marginTop: 20 }}>
                    <Text style={descriptionStyle}>
                      Shooting: {nextPage?.shooting}
                    </Text>
                    <Text style={descriptionStyle}>
                      Dribbling: {nextPage?.dribbling}
                    </Text>
                    <Text style={descriptionStyle}>
                      Defense: {nextPage?.defense}
                    </Text>
                    <Text style={descriptionStyle}>
                      Basketball IQ: {nextPage?.basketballIQ}
                    </Text>
                    <Text style={descriptionStyle}>
                      Athleticism: {nextPage?.athleticism}
                    </Text>
                    <Text style={descriptionStyle}>
                      Overall Score: {nextPage?.overallScore}
                    </Text>
                  </View>

                  {/* Footer with Signature */}
                  <View style={footerStyle}>
                    <View style={styles.signatureSection}>
                      <View style={signatureLineStyle} />
                      <Text style={signatureTextStyle}>
                        {nextPage?.assessedBy || 'Program Director'}
                      </Text>
                    </View>
                    <View style={styles.signatureSection}>
                      <View style={signatureLineStyle} />
                      <Text style={signatureTextStyle}>
                        {nextPage?.feedback || 'Good Job!'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ImageBackground>
      </Page>
    </Document>
  )
}
