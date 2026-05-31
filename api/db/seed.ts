// We use the official Redwood hashPassword utility for dbAuth compatibility
import { hashPassword } from '@redwoodjs/auth-dbauth-api'

import { db } from '../src/lib/db'

export async function seed() {
  try {
    console.log('Seeding database...')

    // Delete existing data in correct dependency order
    console.log('Clearing existing data...')
    await db.message.deleteMany({})
    await db.announcement.deleteMany({})
    await db.playerStats.deleteMany({})
    await db.skillAssessment.deleteMany({})
    await db.certificate.deleteMany({})
    await db.payment.deleteMany({})
    await db.invoice.deleteMany({})
    await db.attendance.deleteMany({})
    await db.enrollment.deleteMany({})
    await db.class.deleteMany({})
    await db.program.deleteMany({})
    await db.profile.deleteMany({})
    await db.user.deleteMany({})

    // Hash password for all users
    const [passwordHash, passwordSalt] = hashPassword('password123')

    // Create Admin User
    console.log('Creating admin user...')
    const adminUser = await db.user.create({
      data: {
        email: 'admin@basketballacademy.com',
        hashedPassword: passwordHash,
        salt: passwordSalt,
        role: 'ADMIN',
        isActive: true,
        profile: {
          create: {
            firstName: 'Admin',
            lastName: 'User',
            phoneNumber: '+1-555-0100',
            address: '123 Academy Way',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'USA',
          },
        },
      },
    })

    // Create Coach Users
    console.log('Creating coach users...')
    const coach1 = await db.user.create({
      data: {
        email: 'coach.johnson@basketballacademy.com',
        hashedPassword: passwordHash,
        salt: passwordSalt,
        role: 'COACH',
        isActive: true,
        profile: {
          create: {
            firstName: 'Michael',
            lastName: 'Johnson',
            dateOfBirth: new Date('1985-03-20'),
            phoneNumber: '+1-555-0101',
            address: '456 Coaching Drive',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62702',
            country: 'USA',
          },
        },
      },
      include: {
        profile: true,
      },
    })

    const coach2 = await db.user.create({
      data: {
        email: 'coach.williams@basketballacademy.com',
        hashedPassword: passwordHash,
        salt: passwordSalt,
        role: 'COACH',
        isActive: true,
        profile: {
          create: {
            firstName: 'Sarah',
            lastName: 'Williams',
            dateOfBirth: new Date('1988-07-15'),
            phoneNumber: '+1-555-0102',
            address: '789 Court Lane',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62703',
            country: 'USA',
          },
        },
      },
      include: {
        profile: true,
      },
    })

    const coach3 = await db.user.create({
      data: {
        email: 'coach.brown@basketballacademy.com',
        hashedPassword: passwordHash,
        salt: passwordSalt,
        role: 'COACH',
        isActive: true,
        profile: {
          create: {
            firstName: 'David',
            lastName: 'Brown',
            dateOfBirth: new Date('1982-11-10'),
            phoneNumber: '+1-555-0103',
            address: '321 Basketball Blvd',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62704',
            country: 'USA',
          },
        },
      },
      include: {
        profile: true,
      },
    })

    // Create Programs
    console.log('Creating programs...')
    const beginnerProgram = await db.program.create({
      data: {
        name: 'Beginner Basketball Fundamentals',
        description:
          'Learn basic basketball skills including dribbling, passing, and shooting.',
        level: 'BEGINNER',
        minAge: 6,
        maxAge: 10,
        capacity: 15,
        durationWeeks: 8,
        pricePerMonth: 99.99,
        isActive: true,
      },
    })

    const intermediateProgram = await db.program.create({
      data: {
        name: 'Intermediate Basketball Development',
        description:
          'Develop intermediate skills including ball handling, defense, and game strategy.',
        level: 'INTERMEDIATE',
        minAge: 11,
        maxAge: 14,
        capacity: 18,
        durationWeeks: 12,
        pricePerMonth: 149.99,
        isActive: true,
      },
    })

    const advancedProgram = await db.program.create({
      data: {
        name: 'Advanced Basketball Training',
        description:
          'Advanced competitive training with emphasis on skill refinement and game play.',
        level: 'ADVANCED',
        minAge: 15,
        maxAge: 18,
        capacity: 16,
        durationWeeks: 12,
        pricePerMonth: 199.99,
        isActive: true,
      },
    })

    const eliteProgram = await db.program.create({
      data: {
        name: 'Elite Basketball Academy',
        description:
          'Elite level training for competitive and aspiring professional players.',
        level: 'ELITE',
        minAge: 16,
        maxAge: 21,
        capacity: 12,
        durationWeeks: 16,
        pricePerMonth: 299.99,
        isActive: true,
      },
    })

    // Create Classes for each program
    console.log('Creating classes...')
    const beginnerClass1 = await db.class.create({
      data: {
        programId: beginnerProgram.id,
        name: 'Beginner - Monday Evening',
        description:
          'Beginner class on Monday evenings for young players just starting out.',
        scheduleDay: 'MONDAY',
        scheduleTime: '18:00-19:00',
        capacity: 15,
        currentEnrollment: 0,
        startDate: new Date('2026-04-06'),
        endDate: new Date('2026-06-01'),
        coachId: coach1.id,
        coachName: 'Michael Johnson',
        isActive: true,
      },
    })

    const beginnerClass2 = await db.class.create({
      data: {
        programId: beginnerProgram.id,
        name: 'Beginner - Saturday Morning',
        description:
          'Beginner class on Saturday mornings for young players just starting out.',
        scheduleDay: 'SATURDAY',
        scheduleTime: '09:00-10:00',
        capacity: 15,
        currentEnrollment: 0,
        startDate: new Date('2026-04-04'),
        endDate: new Date('2026-05-30'),
        coachId: coach2.id,
        coachName: 'Sarah Williams',
        isActive: true,
      },
    })

    const intermediateClass1 = await db.class.create({
      data: {
        programId: intermediateProgram.id,
        name: 'Intermediate - Wed/Fri Evening',
        description:
          'Intermediate class meeting on Wednesday and Friday evenings.',
        scheduleDay: 'WEDNESDAY',
        scheduleTime: '17:30-18:30',
        capacity: 18,
        currentEnrollment: 0,
        startDate: new Date('2026-04-08'),
        endDate: new Date('2026-06-26'),
        coachId: coach1.id,
        coachName: 'Michael Johnson',
        isActive: true,
      },
    })

    const intermediateClass2 = await db.class.create({
      data: {
        programId: intermediateProgram.id,
        name: 'Intermediate - Sunday Afternoon',
        description: 'Intermediate class on Sunday afternoons.',
        scheduleDay: 'SUNDAY',
        scheduleTime: '14:00-15:30',
        capacity: 18,
        currentEnrollment: 0,
        startDate: new Date('2026-04-05'),
        endDate: new Date('2026-06-28'),
        coachId: coach3.id,
        coachName: 'David Brown',
        isActive: true,
      },
    })

    const advancedClass = await db.class.create({
      data: {
        programId: advancedProgram.id,
        name: 'Advanced - Tuesday/Thursday Evening',
        description:
          'Advanced competitive training meeting Tuesday and Thursday.',
        scheduleDay: 'TUESDAY',
        scheduleTime: '19:00-20:30',
        capacity: 16,
        currentEnrollment: 0,
        startDate: new Date('2026-04-07'),
        endDate: new Date('2026-06-30'),
        coachId: coach2.id,
        coachName: 'Sarah Williams',
        isActive: true,
      },
    })

    const eliteClass = await db.class.create({
      data: {
        programId: eliteProgram.id,
        name: 'Elite - Premium Training',
        description:
          'Elite level training with personalized coaching and competitive game play.',
        scheduleDay: 'MONDAY',
        scheduleTime: '19:30-21:00',
        capacity: 12,
        currentEnrollment: 0,
        startDate: new Date('2026-04-06'),
        endDate: new Date('2026-07-31'),
        coachId: coach1.id,
        coachName: 'Michael Johnson',
        isActive: true,
      },
    })

    // Create Player Users
    console.log('Creating player users...')
    const players = []
    const playerData = [
      {
        firstName: 'Michael',
        lastName: 'Jordan',
        position: 'Guard',
        jersey: 23,
        birthYear: 2012,
      },
      {
        firstName: 'LeBron',
        lastName: 'James',
        position: 'Forward',
        jersey: 4,
        birthYear: 2011,
      },
      {
        firstName: 'Kobe',
        lastName: 'Bryant',
        position: 'Guard',
        jersey: 24,
        birthYear: 2013,
      },
      {
        firstName: 'Stephen',
        lastName: 'Curry',
        position: 'Guard',
        jersey: 30,
        birthYear: 2012,
      },
      {
        firstName: 'Kevin',
        lastName: 'Durant',
        position: 'Forward',
        jersey: 35,
        birthYear: 2011,
      },
    ]

    for (const player of playerData) {
      const playerUser = await db.user.create({
        data: {
          email: `${player.firstName.toLowerCase()}.${player.lastName.toLowerCase()}@basketballacademy.com`,
          hashedPassword: passwordHash,
          salt: passwordSalt,
          role: 'PLAYER',
          isActive: true,
          profile: {
            create: {
              firstName: player.firstName,
              lastName: player.lastName,
              dateOfBirth: new Date(`${player.birthYear}-06-15`),
              phoneNumber: `+1-555-${2000 + Math.floor(Math.random() * 9000)}`,
              position: player.position,
              jerseyNumber: player.jersey,
              heightCm: 170 + Math.floor(Math.random() * 20),
              weightKg: 70 + Math.floor(Math.random() * 30),
              city: 'Springfield',
              state: 'IL',
              country: 'USA',
            },
          },
        },
      })
      players.push(playerUser)
    }

    // Create Parent Users
    console.log('Creating parent users...')
    const parent1 = await db.user.create({
      data: {
        email: 'parent.smith@basketballacademy.com',
        hashedPassword: passwordHash,
        salt: passwordSalt,
        role: 'PARENT',
        isActive: true,
        profile: {
          create: {
            firstName: 'John',
            lastName: 'Smith',
            phoneNumber: '+1-555-0201',
            address: '999 Family Lane',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62705',
            country: 'USA',
          },
        },
      },
    })

    const parent2 = await db.user.create({
      data: {
        email: 'parent.davis@basketballacademy.com',
        hashedPassword: passwordHash,
        salt: passwordSalt,
        role: 'PARENT',
        isActive: true,
        profile: {
          create: {
            firstName: 'Jennifer',
            lastName: 'Davis',
            phoneNumber: '+1-555-0202',
            address: '888 Parent Ave',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62706',
            country: 'USA',
          },
        },
      },
    })

    // Create Prospect Users
    console.log('Creating prospect users...')
    const prospect = await db.user.create({
      data: {
        email: 'prospect.miller@basketballacademy.com',
        hashedPassword: passwordHash,
        salt: passwordSalt,
        role: 'PROSPECT',
        isActive: true,
        profile: {
          create: {
            firstName: 'Chris',
            lastName: 'Miller',
            dateOfBirth: new Date('2010-08-20'),
            phoneNumber: '+1-555-0300',
            position: 'Forward',
            heightCm: 185,
            weightKg: 85,
            city: 'Springfield',
            state: 'IL',
            country: 'USA',
          },
        },
      },
    })

    // Create Enrollments
    console.log('Creating enrollments...')
    const enrollmentData = [
      {
        userId: players[0].id,
        classId: beginnerClass1.id,
        programId: beginnerProgram.id,
      },
      {
        userId: players[1].id,
        classId: beginnerClass2.id,
        programId: beginnerProgram.id,
      },
      {
        userId: players[2].id,
        classId: intermediateClass1.id,
        programId: intermediateProgram.id,
      },
      {
        userId: players[3].id,
        classId: advancedClass.id,
        programId: advancedProgram.id,
      },
      {
        userId: players[4].id,
        classId: eliteClass.id,
        programId: eliteProgram.id,
      },
    ]

    let enrollmentCount = 0
    for (const enrollment of enrollmentData) {
      await db.enrollment.create({
        data: {
          userId: enrollment.userId,
          classId: enrollment.classId,
          programId: enrollment.programId,
          enrollmentDate: new Date('2026-04-01'),
          status: 'ACTIVE',
        },
      })
      enrollmentCount++
    }

    // Update class current enrollment counts
    console.log('Updating class enrollment counts...')
    await db.class.update({
      where: { id: beginnerClass1.id },
      data: { currentEnrollment: 1 },
    })
    await db.class.update({
      where: { id: beginnerClass2.id },
      data: { currentEnrollment: 1 },
    })
    await db.class.update({
      where: { id: intermediateClass1.id },
      data: { currentEnrollment: 1 },
    })
    await db.class.update({
      where: { id: advancedClass.id },
      data: { currentEnrollment: 1 },
    })
    await db.class.update({
      where: { id: eliteClass.id },
      data: { currentEnrollment: 1 },
    })

    // Create Attendance records
    console.log('Creating attendance records...')
    const attendanceStatuses = [
      'PRESENT',
      'PRESENT',
      'LATE',
      'ABSENT',
      'EXCUSED',
    ]
    for (let i = 0; i < 3; i++) {
      for (const enrollment of enrollmentData) {
        const attendanceDate = new Date('2026-04-06')
        attendanceDate.setDate(attendanceDate.getDate() + i * 7)

        await db.attendance.create({
          data: {
            classId: enrollment.classId,
            userId: enrollment.userId,
            attendanceDate,
            status:
              attendanceStatuses[
                Math.floor(Math.random() * attendanceStatuses.length)
              ],
            notes: Math.random() > 0.8 ? 'Great effort today!' : undefined,
          },
        })
      }
    }

    // Create Invoices
    console.log('Creating invoices...')
    for (const player of players) {
      await db.invoice.create({
        data: {
          userId: player.id,
          invoiceNumber: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          amount: 149.99,
          dueDate: new Date('2026-05-01'),
          status: 'PENDING',
          description: 'Monthly training program fee',
        },
      })
    }

    // Create Payments
    console.log('Creating payments...')
    const invoices = await db.invoice.findMany({ take: 2 })
    for (const invoice of invoices) {
      await db.payment.create({
        data: {
          userId: invoice.userId,
          amount: invoice.amount,
          currency: 'USD',
          status: 'COMPLETED',
          description: 'Training program payment',
          invoiceId: invoice.id,
        },
      })

      await db.invoice.update({
        where: { id: invoice.id },
        data: {
          status: 'COMPLETED',
          paidDate: new Date(),
        },
      })
    }

    // Create Certificates
    console.log('Creating certificates...')
    const now = new Date()
    let r = 0
    for (const playerCert of players) {
      await db.certificate.create({
        data: {
          userId: playerCert.id,
          programId: beginnerProgram.id,
          classId: beginnerClass1.id,
          title: 'Basketball Fundamentals Completion',
          description:
            'Successfully completed the Beginner Basketball Fundamentals program.',
          graduationClass: 'Spring 2026',
          ageGroupTeam: 'U-12',
          achievementDate: now.toISOString(),
          certificateNumber: `CERT-${Date.now()}-00${r}`,
          pdfUrl: `https://example.com/certificates/beginner-cert-00${r}.pdf`,
          qrCode: `https://example.com/certificates/beginner-cert-00${r}-qr.png`,
          issuedBy: 'Basketball Academy Administration',
          templateId: 'beginner_certificate_template',
          signatureUrl: 'https://example.com/signature.png',
          verificationCode: `CERT-${Date.now()}-00${r}-VERIFY`,
          withAssessment: false,
          status: 'ISSUED',
          expiryDate: now.toISOString(),
          verifiedAt: now.toISOString(),
          revokedAt: now.toISOString(),
          revokedReason:
            'Graduation certificate issued for successful completion of the program.',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      })
      r++
    }

    // Create Skill Assessments
    console.log('Creating skill assessments...')
    for (const player of players) {
      await db.skillAssessment.create({
        data: {
          userId: player.id,
          programId: beginnerProgram.id,
          shooting: 65 + Math.floor(Math.random() * 30),
          dribbling: 70 + Math.floor(Math.random() * 25),
          defense: 60 + Math.floor(Math.random() * 35),
          basketballIQ: 75 + Math.floor(Math.random() * 20),
          athleticism: 68 + Math.floor(Math.random() * 28),
          overallScore: 67 + Math.floor(Math.random() * 28),
          feedback:
            'Excellent progress in fundamentals. Keep practicing ball handling.',
          assessedBy:
            coach1.profile?.firstName + ' ' + coach1.profile?.lastName,
          assessmentDate: new Date('2026-04-15'),
        },
      })
    }

    // Create Player Stats
    console.log('Creating player statistics...')
    for (const player of players) {
      await db.playerStats.create({
        data: {
          userId: player.id,
          gameDate: new Date('2026-04-10'),
          gameName: 'Spring 2026 Scrimmage VS Team A - BS Academy',
          points: Math.floor(Math.random() * 30),
          rebounds: Math.floor(Math.random() * 15),
          assists: Math.floor(Math.random() * 10),
          steals: Math.floor(Math.random() * 5),
          blocks: Math.floor(Math.random() * 5),
          minutesPlayed: 20 + Math.floor(Math.random() * 20),
        },
      })
    }

    // Create Announcements
    console.log('Creating announcements...')
    await db.announcement.create({
      data: {
        title: 'Welcome to Basketball Academy!',
        message:
          'We are excited to have you join our basketball training program. This season promises to be filled with learning, growth, and fun!',
        type: 'INFO',
        isDismissible: true,
        priority: 1,
        createdAt: new Date('2026-04-01'),
        updatedAt: new Date('2026-05-31'),
        isActive: true,
        createdById: adminUser.id,
      },
    })

    await db.announcement.create({
      data: {
        title: 'Upcoming Tournament Q1 2026',
        message:
          'Mark your calendars! We have an exciting tournament coming up on May 15th. All intermediate and advanced players are encouraged to participate.',
        type: 'INFO',
        isDismissible: true,
        priority: 2,
        createdAt: new Date('2026-04-02'),
        updatedAt: new Date('2026-05-15'),
        isActive: true,
        createdById: adminUser.id,
      },
    })

    await db.announcement.create({
      data: {
        title: 'Upcoming Tournament Q2 2026',
        message:
          'Mark your calendars! We have an exciting tournament coming up on May 15th. All intermediate and advanced players are encouraged to participate.',
        type: 'INFO',
        isDismissible: true,
        priority: 3,
        createdAt: new Date('2026-04-02'),
        updatedAt: new Date('2026-05-15'),
        isActive: true,
        createdById: adminUser.id,
      },
    })

    // Create Messages
    console.log('Creating messages...')
    await db.message.create({
      data: {
        senderId: coach1.id,
        recipientId: players[0].id,
        subject: 'Great Performance!',
        content:
          'Great job in yesterdays practice session! Your shooting technique has improved significantly.',
        isRead: false,
      },
    })

    await db.message.create({
      data: {
        senderId: parent1.id,
        recipientId: adminUser.id,
        subject: 'Question about billing',
        content:
          'Could you please clarify the invoice amount and payment terms?',
        isRead: false,
      },
    })

    // Create Site Settings
    console.log('Creating site settings...')
    await db.siteSetting.deleteMany({})

    // Site Identity Settings
    await db.siteSetting.create({
      data: {
        key: 'site_name',
        label: 'Site Name',
        group: 'site_identity',
        value: 'Basketball Academy',
        valueType: 'text',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'site_logo',
        label: 'Site Logo URL',
        group: 'site_identity',
        value: '🏀',
        valueType: 'text',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'site_tagline',
        label: 'Site Tagline',
        group: 'site_identity',
        value: 'Excellence in Basketball Training',
        valueType: 'text',
      },
    })

    // Header Settings
    await db.siteSetting.create({
      data: {
        key: 'header_title',
        label: 'Header Title',
        group: 'header',
        value: 'Basketball Academy Admin',
        valueType: 'text',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'header_subtitle',
        label: 'Header Subtitle',
        group: 'header',
        value: 'Admin Dashboard',
        valueType: 'text',
      },
    })

    // Footer Settings
    await db.siteSetting.create({
      data: {
        key: 'footer_text',
        label: 'Footer Text',
        group: 'footer',
        value: '© 2026 Basketball Academy. All rights reserved.',
        valueType: 'text',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'footer_address',
        label: 'Footer Address',
        group: 'footer',
        value: '123 Academy Way, Springfield, IL 62701',
        valueType: 'text',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'footer_phone',
        label: 'Footer Phone',
        group: 'footer',
        value: '+1 (555) 123-4567',
        valueType: 'text',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'footer_email',
        label: 'Footer Email',
        group: 'footer',
        value: 'info@basketballacademy.com',
        valueType: 'text',
      },
    })

    // Content Settings
    await db.siteSetting.create({
      data: {
        key: 'homepage_welcome_title',
        label: 'Homepage Welcome Title',
        group: 'content',
        value: 'Welcome to Basketball Academy',
        valueType: 'text',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'homepage_welcome_text',
        label: 'Homepage Welcome Text',
        group: 'content',
        value:
          'Develop your basketball skills with our expert coaches and state-of-the-art facilities.',
        valueType: 'text',
      },
    })

    // Contact Settings
    await db.siteSetting.create({
      data: {
        key: 'contact_phone',
        label: 'Contact Phone Number',
        group: 'contact',
        value: '+1 (555) 123-4567',
        valueType: 'text',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'contact_email',
        label: 'Contact Email',
        group: 'contact',
        value: 'info@basketballacademy.com',
        valueType: 'text',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'contact_address',
        label: 'Contact Address',
        group: 'contact',
        value: '123 Academy Way, Springfield, IL 62701, USA',
        valueType: 'text',
      },
    })

    // Social Media Settings
    await db.siteSetting.create({
      data: {
        key: 'facebook_url',
        label: 'Facebook URL',
        group: 'social_media',
        value: 'https://facebook.com/basketballacademy',
        valueType: 'text',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'twitter_url',
        label: 'Twitter URL',
        group: 'social_media',
        value: 'https://twitter.com/basketballacademy',
        valueType: 'text',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'instagram_url',
        label: 'Instagram URL',
        group: 'social_media',
        value: 'https://instagram.com/basketballacademy',
        valueType: 'text',
      },
    })

    // Feature Settings
    await db.siteSetting.create({
      data: {
        key: 'enable_enrollment',
        label: 'Enable Enrollment',
        group: 'features',
        value: 'true',
        valueType: 'boolean',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'enable_payments',
        label: 'Enable Payments',
        group: 'features',
        value: 'true',
        valueType: 'boolean',
      },
    })

    await db.siteSetting.create({
      data: {
        key: 'enable_announcements',
        label: 'Enable Announcements',
        group: 'features',
        value: 'true',
        valueType: 'boolean',
      },
    })

    console.log('✅ Database seeded successfully!')
    console.log(`Created:`)
    console.log(`  - 1 Admin user`)
    console.log(`  - 3 Coaches`)
    console.log(`  - 5 Players`)
    console.log(`  - 2 Parents`)
    console.log(`  - 1 Prospect`)
    console.log(`  - 4 Programs (Beginner, Intermediate, Advanced, Elite)`)
    console.log(`  - 6 Classes`)
    console.log(`  - 5 Enrollments`)
    console.log(`  - 15 Attendance records`)
    console.log(`  - 5 Invoices`)
    console.log(`  - 2 Payments`)
    console.log(`  - 1 Certificate`)
    console.log(`  - 5 Skill Assessments`)
    console.log(`  - 5 Player Stats`)
    console.log(`  - 3 Announcements`)
    console.log(`  - 2 Messages`)
    console.log(`  - 23 Site Settings`)
  } catch (error) {
    console.error('🔥 Error seeding database:', error)
    throw error
  }
}
