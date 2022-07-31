import type { NextPage } from 'next'
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronDoubleRightIcon,
  ChevronRightIcon,
  PencilAltIcon
} from '@heroicons/react/outline'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { supabase, useObjectState } from 'services'
import { Item, SEO, Spinner } from 'components'
import { Modal } from 'containers'
import { useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import jsCookie from 'js-cookie'

interface Props {
  user: User | null
}
interface State {
  isCalendarOpen: boolean
  title: string
  isCreating: boolean
  description: string
  currentDate: string
  list: Table.Tasks[]
  isLoading: boolean
  isLoggedIn: boolean
}

const HomePage: NextPage<Props> = ({ user }) => {
  const [
    {
      isCalendarOpen,
      title,
      isCreating,
      description,
      currentDate,
      list,
      isLoading,
      isLoggedIn
    },
    setState,
    onChange
  ] = useObjectState<State>({
    isCalendarOpen: false,
    title: '',
    isCreating: false,
    description: '',
    currentDate: dayjs().format('YYYY-MM-DD'),
    list: [],
    isLoading: true,
    isLoggedIn: false
  })

  const get = async () => {
    setState({ isLoading: true })
    try {
      const [{ data: unresolved }, { data: resolved }] = await Promise.all([
        supabase
          .from<Table.Tasks>('tasks')
          .select()
          .order('created_at')
          .eq('is_resolved', false)
          .lt(
            'created_at',
            new Date(
              dayjs(currentDate).add(1, 'day').format('YYYY-MM-DD')
            ).toISOString()
          )
          .gt('created_at', new Date(currentDate).toISOString()),
        supabase
          .from<Table.Tasks>('tasks')
          .select()
          .order('created_at')
          .eq('is_resolved', true)
          .lt(
            'created_at',
            new Date(
              dayjs(currentDate).add(1, 'day').format('YYYY-MM-DD')
            ).toISOString()
          )
          .gt('created_at', new Date(currentDate).toISOString())
      ])
      setState({ list: [...(unresolved || []), ...(resolved || [])] })
    } catch (err) {
      console.error(err)
    } finally {
      setState({ isLoading: false })
    }
  }

  const create = async () => {
    if (!title || isCreating) return
    setState({ isCreating: true })
    try {
      await supabase
        .from<Table.Tasks>('tasks')
        .insert({ title, description, is_resolved: false })
      setState({ title: '', description: '' })
      get()
    } catch (err) {
      console.error(err)
    } finally {
      setState({ isCreating: false })
    }
  }

  useEffect(() => {
    get()
  }, [currentDate])

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        jsCookie.set('access_token', session.access_token)
        if (session.user?.email === process.env.NEXT_PUBLIC_EMAIL)
          setState({ isLoggedIn: true })
      }
    })
  }, [])

  useEffect(() => {
    if (!!user) setState({ isLoggedIn: true })
  }, [user])
  return (
    <>
      <SEO title="Task" />
      <div className="container mx-auto max-w-lg px-4 sm:px-0">
        <div className="mt-6 flex items-center gap-1">
          <button
            disabled={isLoading}
            className="chevron-button"
            onClick={() =>
              setState({
                currentDate: dayjs(currentDate)
                  .add(-1, 'month')
                  .format('YYYY-MM-DD')
              })
            }
          >
            <ChevronDoubleLeftIcon />
          </button>
          <button
            disabled={isLoading}
            onClick={() =>
              setState({
                currentDate: dayjs(currentDate)
                  .add(-1, 'day')
                  .format('YYYY-MM-DD')
              })
            }
            className="chevron-button"
          >
            <ChevronLeftIcon />
          </button>
          <div className="flex-1 text-center text-lg font-bold">
            <button
              onClick={() => setState({ isCalendarOpen: true })}
              className="rounded py-1 px-2 hover:bg-neutral-800 active:opacity-90"
            >
              {currentDate}
            </button>
          </div>
          <button
            disabled={dayjs().format('YYYY-MM-DD') === currentDate || isLoading}
            onClick={() =>
              setState({
                currentDate: dayjs(currentDate)
                  .add(1, 'day')
                  .format('YYYY-MM-DD')
              })
            }
            className="chevron-button"
          >
            <ChevronRightIcon />
          </button>
          <button
            disabled={dayjs().format('YYYY-MM-DD') === currentDate || isLoading}
            onClick={() =>
              setState({
                currentDate: dayjs(currentDate)
                  .add(1, 'month')
                  .isAfter(dayjs(), 'month')
                  ? dayjs().format('YYYY-MM-DD')
                  : dayjs(currentDate).add(1, 'month').format('YYYY-MM-DD')
              })
            }
            className="chevron-button"
          >
            <ChevronDoubleRightIcon />
          </button>
        </div>

        <div className="mt-10">
          <div className="flex items-center gap-3 border-b border-neutral-700 pb-2">
            <input
              value={title}
              className="w-full flex-1 bg-transparent placeholder:italic"
              spellCheck={false}
              name="title"
              disabled={!isLoggedIn}
              autoFocus
              placeholder="오늘 해야할 태스크는..."
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') create()
              }}
            />
            {isCreating ? (
              <Spinner className="h-5 w-5" />
            ) : (
              !!title && (
                <button onClick={create}>
                  <PencilAltIcon className="h-5 w-5 text-neutral-600 hover:text-neutral-50 active:text-neutral-400" />
                </button>
              )
            )}
          </div>
          {!!title && (
            <textarea
              className="mt-2 w-full rounded border border-neutral-700 bg-transparent p-2 text-sm placeholder:italic"
              placeholder="설명"
              spellCheck={false}
              rows={4}
              value={description}
              name="description"
              onChange={onChange}
            />
          )}
        </div>

        <div className="mt-10 divide-y divide-neutral-700">
          {list.map((item) => (
            <Item key={item.id} onUpdate={get} {...item} />
          ))}
        </div>

        {!isLoggedIn && (
          <div className="fixed bottom-0 left-1/2 w-full -translate-x-1/2 py-4 text-center">
            <button
              onClick={() =>
                supabase.auth.signIn(
                  { provider: 'google' },
                  {
                    redirectTo:
                      process.env.NODE_ENV === 'development'
                        ? 'http://localhost:3000'
                        : 'https://task.kidow.me',
                    shouldCreateUser: false
                  }
                )
              }
            >
              구글로 로그인
            </button>
          </div>
        )}
      </div>

      <Modal.Calendar
        isOpen={isCalendarOpen}
        onClose={() => setState({ isCalendarOpen: false })}
      />
    </>
  )
}

export default HomePage
