import { useMemo } from 'react'

import { Loader } from '@mantine/core'

import { Link } from '@redwoodjs/router/Link'
import { useQuery } from '@redwoodjs/web'

import { GET_PUBLIC_AGE_GROUP_TEAMS } from 'src/graphql/age-group-teams-queries'
import DefaultLayout from 'src/layouts/DefaultLayout'
import { useAppTheme } from 'src/providers/ThemeProvider'

type Profile = {
  firstName?: string | null
  lastName?: string | null
  position?: string | null
  jerseyNumber?: number | null
  profilePhoto?: string | null
}

type TeamUser = {
  id: string
  email: string
  profile?: Profile | null
}

type AgeGroupTeam = {
  id: string
  name: string
  ageGroup: string
  description?: string | null
  coach?: TeamUser | null
  players: TeamUser[]
}

const heroImage =
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=2200&q=85'

const getName = (user?: TeamUser | null) => {
  const name = [user?.profile?.firstName, user?.profile?.lastName]
    .filter(Boolean)
    .join(' ')

  return name || user?.email || 'To be announced'
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const TeamsPage = () => {
  const { isDark } = useAppTheme()
  const { data, loading, error } = useQuery<{
    publicAgeGroupTeams: AgeGroupTeam[]
  }>(GET_PUBLIC_AGE_GROUP_TEAMS)

  const teams = useMemo(
    () => data?.publicAgeGroupTeams ?? [],
    [data?.publicAgeGroupTeams]
  )

  const totalPlayers = teams.reduce(
    (sum, team) => sum + (team.players?.length || 0),
    0
  )

  const pageClass = isDark
    ? 'bg-slate-950 text-slate-100'
    : 'bg-stone-50 text-slate-950'
  const sectionClass = isDark ? 'bg-slate-950' : 'bg-stone-50'
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600'
  const dividerClass = isDark ? 'border-slate-800' : 'border-stone-200'
  const divideClass = isDark ? 'divide-slate-800' : 'divide-stone-200'

  return (
    <DefaultLayout
      metaTags={{
        title: 'Age Group Teams',
        description: 'Meet the Basketball Academy age group teams and rosters.',
      }}
    >
      <main className={pageClass}>
        <section
          className="relative min-h-[72svh] overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(2, 6, 23, 0.92), rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.18)), url(${heroImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/70 to-transparent" />
          <div className="relative mx-auto flex min-h-[72svh] max-w-7xl flex-col justify-end px-5 pb-12 pt-20 sm:px-8 lg:px-10">
            <div className="max-w-3xl translate-y-0 opacity-100 transition duration-700 ease-out">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
                Academy Rosters
              </p>
              <h1 className="text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                Age Group Teams
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100 sm:text-xl">
                Follow each academy group, their coach, and the players building
                the next season together.
              </p>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 border-t border-white/20 pt-6 text-white sm:grid-cols-3">
              <div>
                <p className="text-3xl font-black">{teams.length}</p>
                <p className="text-sm text-slate-200">Active teams</p>
              </div>
              <div>
                <p className="text-3xl font-black">{totalPlayers}</p>
                <p className="text-sm text-slate-200">Rostered players</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-3xl font-black">U-12-U-18</p>
                <p className="text-sm text-slate-200">Core pathway</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${sectionClass} px-5 py-14 sm:px-8 lg:px-10`}>
          <div className="mx-auto max-w-7xl">
            <div
              className={`mb-10 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end ${dividerClass}`}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
                  Team Directory
                </p>
                <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                  Rosters by age group
                </h2>
              </div>
              <p className={`max-w-xl text-sm leading-6 ${mutedText}`}>
                Active teams are listed with current coach assignments and
                player details from each athlete profile.
              </p>
            </div>

            {loading && (
              <div className="flex min-h-64 items-center justify-center">
                <Loader size="sm" />
              </div>
            )}

            {error && (
              <div className="border border-red-200 bg-red-50 p-6 text-red-700">
                Failed to load teams. {error.message}
              </div>
            )}

            {!loading && !error && teams.length === 0 && (
              <div className={`border px-6 py-12 text-center ${dividerClass}`}>
                <p className={`text-lg ${mutedText}`}>
                  No active teams are published yet.
                </p>
              </div>
            )}

            {!loading && !error && teams.length > 0 && (
              <div className="space-y-8">
                {teams.map((team) => {
                  const coachName = getName(team.coach)

                  return (
                    <article
                      key={team.id}
                      className={`grid overflow-hidden border transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[0.75fr_1.25fr] ${
                        isDark
                          ? 'border-slate-800 bg-slate-900/70 shadow-black/20'
                          : 'border-stone-200 bg-white shadow-stone-200/70'
                      }`}
                    >
                      <div className="relative min-h-72 bg-slate-900 p-7 text-white">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.24),transparent_34%),linear-gradient(135deg,rgba(20,184,166,0.22),transparent_45%)]" />
                        <div className="relative flex h-full flex-col justify-between">
                          <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">
                              {team.ageGroup}
                            </p>
                            <h3 className="mt-3 text-4xl font-black leading-tight">
                              {team.name}
                            </h3>
                            <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">
                              {team.description ||
                                'Focused academy training with weekly skill development and competitive game preparation.'}
                            </p>
                          </div>

                          <div className="mt-10 flex items-center gap-4 border-t border-white/15 pt-5">
                            {team.coach?.profile?.profilePhoto ? (
                              <img
                                src={team.coach.profile.profilePhoto}
                                alt={coachName}
                                className="h-14 w-14 rounded-full border border-gray-600 object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">
                                {getInitials(coachName)}
                              </div>
                            )}
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                Head Coach
                              </p>
                              <p className="text-lg font-bold">{coachName}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 sm:p-8">
                        <div className="mb-5 flex items-center justify-between gap-4">
                          <div>
                            <p
                              className={`text-xs uppercase tracking-[0.18em] ${mutedText}`}
                            >
                              Roster
                            </p>
                            <h4 className="text-2xl font-black">
                              {team.players.length} players
                            </h4>
                          </div>
                          <span className="border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-amber-900">
                            {team.ageGroup}
                          </span>
                        </div>

                        {team.players.length === 0 ? (
                          <p
                            className={`border-t pt-5 text-sm ${mutedText} ${dividerClass}`}
                          >
                            Roster announcements are coming soon.{' '}
                            <Link
                              to="/signup"
                              className="font-bold hover:underline"
                            >
                              Register
                            </Link>{' '}
                            now to be part of the team!
                          </p>
                        ) : (
                          <div className={`divide-y ${divideClass}`}>
                            {team.players.map((player) => {
                              const playerName = getName(player)

                              return (
                                <div
                                  key={player.id}
                                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4 transition duration-200 hover:translate-x-1"
                                >
                                  {player.profile?.profilePhoto ? (
                                    <img
                                      src={player.profile.profilePhoto}
                                      alt={playerName}
                                      className="h-11 w-11 rounded-full border border-gray-200 object-cover"
                                    />
                                  ) : (
                                    <div
                                      className={`flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-xs font-black ${
                                        isDark
                                          ? 'bg-slate-800 text-slate-100'
                                          : 'bg-slate-100 text-slate-900'
                                      }`}
                                    >
                                      {getInitials(playerName)}
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="truncate font-bold">
                                      {playerName}
                                    </p>
                                    <p className={`text-sm ${mutedText}`}>
                                      {player.profile?.position || 'Player'}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs uppercase tracking-[0.16em] text-teal-600">
                                      No.
                                    </p>
                                    <p className="text-xl font-black">
                                      {player.profile?.jerseyNumber ?? '--'}
                                    </p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </DefaultLayout>
  )
}

export default TeamsPage
