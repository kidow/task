import type { NextPage } from 'next'
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronDoubleRightIcon,
  ChevronRightIcon
} from '@heroicons/react/outline'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'

interface State {}

const HomePage: NextPage = () => {
  return (
    <div className="container mx-auto max-w-lg px-4 sm:px-0">
      <div className="mt-10 flex items-center">
        <button className="chevron-button">
          <ChevronDoubleLeftIcon />
        </button>
        <button className="chevron-button">
          <ChevronLeftIcon />
        </button>
        <div className="flex-1 text-center text-lg font-bold">
          <button className="rounded py-1 px-2 hover:bg-neutral-800 active:opacity-90">
            {dayjs().format('YYYY-MM-DD')}
          </button>
        </div>
        <button className="chevron-button">
          <ChevronRightIcon />
        </button>
        <button className="chevron-button">
          <ChevronDoubleRightIcon />
        </button>
      </div>
    </div>
  )
}

export default HomePage
