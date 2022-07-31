import type { FC } from 'react'
import { XIcon } from '@heroicons/react/solid'
import classnames from 'classnames'
import { createPortal } from 'react-dom'
import CalendarModal from './Calendar'

interface Props extends ReactProps, ModalProps {}
interface IModal extends FC<Props> {
  Calendar: typeof CalendarModal
}
interface State {}

const Modal: IModal = ({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-lg',
  title,
  description,
  padding = true,
  footer
}) => {
  if (!isOpen) return null
  return createPortal(
    <div
      className="fixed inset-0 z-30 overflow-y-auto"
      aria-labelledby="modal-title"
      aria-modal="true"
      role="dialog"
    >
      <div className="flex min-h-screen items-end justify-center p-0 text-center md:block">
        <div
          className="fixed inset-0 bg-black opacity-30 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>
        <span
          className="hidden h-screen align-middle md:inline-block"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className={classnames(
            `my-8 inline-block w-full transform overflow-hidden rounded-lg text-left align-middle shadow-xl transition-all`,
            maxWidth
          )}
        >
          <header className="border-t-4 border-cyan-600">
            {!!title && (
              <div
                className={classnames(
                  'flex border-b border-neutral-200 p-4',
                  !!description ? 'items-start' : 'items-center'
                )}
              >
                <div className="flex-1">
                  <h1 className="text-lg font-semibold">{title}</h1>
                  {!!description && (
                    <p className="mt-1 text-sm text-neutral-500">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-neutral-300"
                >
                  <XIcon className="h-5 w-5 text-neutral-800" />
                </button>
              </div>
            )}
          </header>
          <div
            className={classnames('bg-black', {
              'py-6 px-7': padding
            })}
          >
            {children}
          </div>
          {footer && (
            <footer className="border-t bg-black py-4 px-7">{footer}</footer>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

Modal.Calendar = CalendarModal

export default Modal
