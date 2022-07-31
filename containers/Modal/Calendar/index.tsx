import type { FC } from 'react'
import { Modal } from 'containers'

export interface Props extends ModalProps {}
interface State {}

const CalendarModal: FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      CalendarModal
    </Modal>
  )
}

export default CalendarModal
