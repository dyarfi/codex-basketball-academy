import { db } from '../src/lib/db'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'

export async function seed() {
  try {
    console.log('Seeding database...')

    // Delete existing data in the correct order
    console.log('Clearing existing data...')
    await db.enrollment.deleteMany({})
    await db.class.deleteMany({})
    await db.program.deleteMany({})
    await db.payment.deleteMany({})
    await db.user.deleteMany({})

    // Create test users
    console.log('Creating users...')
    const hashedPassword = hashPassword('password123')

    const adminUser = await db.user.create({
      data: {
        email: 'admin@academy.com',
        hashedPassword: hashedPassword.hash,
        salt: hashedPassword.salt,
        role: 'ADMIN',
        isActive: true,
      },
    })

    const coachUser = await db.user.create({
      data: {
        email: 'coach@academy.com',
        hashedPassword: hashedPassword.hash,
        salt: hashedPassword.salt,
        role: 'COACH',
        isActive: true,
      },
    })

    const playerUser = await db.user.create({
      data: {
        email: 'player@academy.com',
        hashedPassword: hashedPassword.hash,
        salt: hashedPassword.salt,
        role: 'PLAYER',
        isActive: true,
        profile: {
          create: {
            firstName: 'Michael',
            lastName: 'Player',
            dateOfBirth: new Date('2010-05-15'),
            position: 'Guard',
            jerseyNumber: 23,
          },
        },
      },
      include: { profile: true },
    })

    const parentUser = await db.user.create({
      data: {
        email: 'parent@academy.com',
        hashedPassword: hashedPassword.hash,
        salt: hashedPassword.salt,
        role: 'PARENT',
        isActive: true,
        profile: {
          create: {
            firstName: 'Sarah',
            lastName: 'Parent',
          },
        },
      },
      include: { profile: true },
    })

    console.log('Creating programs...')
    // Create programs
    const beginnerProgram = await db.program.create({
      data: {
        name: 'Beginner',
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
        name: 'Intermediate',
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
        name: 'Advanced',
        level: 'ADVANCED',
        minAge: 15,
        maxAge: 18,
        capacity: 16,
        durationWeeks: 12,
        pricePerMonth: 199.99,
        isActive: true,
      },
    })

    console.log('Creating classes...')
    // Create classes
    const beginnerClass = await db.class.create({
      data: {
        programId: beginnerProgram.id,
        name: 'Beginner - Monday Evening',
        scheduleDay: 'MONDAY',
        scheduleTime: '18:00-19:00',
        capacity: 15,
        currentEnrollment: 0,
        startDate: new Date('2026-04-06'),
        coachId: coachUser.id,
        coachName: 'Coach Name',
        isActive: true,
      },
    })

    const intermediateClass = await db.class.create({
      data: {
        programId: intermediateProgram.id,
        name: 'Intermediate - Wed/Fri',
        scheduleDay: 'WEDNESDAY',
        scheduleTime: '17:30-18:30',
        capacity: 18,
        currentEnrollment: 0,
        startDate: new Date('2026-04-08'),
        coachId: coachUser.id,
        coachName: 'Coach Name',
        isActive: true,
      },
    })

    console.log('Creating enrollments...')
    // Create enrollment
    await db.enrollment.create({
      data: {
        userId: playerUser.id,
        classId: beginnerClass.id,
        programId: beginnerProgram.id,
        enrollmentDate: new Date(),
        status: 'ACTIVE',
      },
    })

    // Update class current enrollment
    await db.class.update({
      where: { id: beginnerClass.id },
      data: { currentEnrollment: 1 },
    })

    console.log('✅ Database seeded successfully!')
  } catch (error) {
    console.error('🔥 Error seeding database:', error)
    throw error
  }
}
