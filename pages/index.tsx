import type { NextPage } from 'next'
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronDoubleRightIcon,
  ChevronRightIcon
} from '@heroicons/react/outline'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { supabase, useObjectState } from 'services'
import { SEO, Spinner } from 'components'
import { Modal } from 'containers'
import classnames from 'classnames'
import { useEffect } from 'react'

interface State {
  isCalendarOpen: boolean
  title: string
  isLoading: boolean
  description: string
  currentDate: string
  list: Table.Tasks[]
}

const HomePage: NextPage = () => {
  const [
    { isCalendarOpen, title, isLoading, description, currentDate, list },
    setState,
    onChange
  ] = useObjectState<State>({
    isCalendarOpen: false,
    title: '',
    isLoading: false,
    description: '',
    currentDate: dayjs().format('YYYY-MM-DD'),
    list: []
  })

  const get = async () => {
    try {
      const { data } = await supabase.from('tasks').select()
      setState({ list: data || [] })
    } catch (err) {
      console.error(err)
    }
  }

  const create = async () => {
    if (!title) return
    setState({ isLoading: true })
    try {
      await supabase.from<Table.Tasks>('tasks').insert({ title, description })
      setState({ title: '', description: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setState({ isLoading: false })
    }
  }

  useEffect(() => {
    get()
  }, [])
  return (
    <>
      <SEO title="Task" />
      <div className="container mx-auto max-w-lg px-4 sm:px-0">
        <div className="mt-10 flex items-center gap-1">
          <button className="chevron-button">
            <ChevronDoubleLeftIcon />
          </button>
          <button className="chevron-button">
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
          <button className="chevron-button">
            <ChevronRightIcon />
          </button>
          <button className="chevron-button">
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
              autoFocus
              placeholder="타이틀"
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') create()
              }}
            />
            {isLoading && <Spinner className="h-5 w-5" />}
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
            <div className="flex items-center rounded p-2 duration-150 hover:bg-neutral-800">
              <div className="flex-1 cursor-pointer truncate">{item.title}</div>
              <span className="relative h-5 w-5 rounded-full border border-neutral-700" />
            </div>
          ))}
        </div>
      </div>

      <Modal.Calendar
        isOpen={isCalendarOpen}
        onClose={() => setState({ isCalendarOpen: false })}
      />
    </>
  )
}

export default HomePage
