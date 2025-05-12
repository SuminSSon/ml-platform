import React, { useState } from 'react'
import { Server } from 'lucide-react'
import Card from './ui/Card'
import SectionHeader from './ui/SectionHeader'
import Button from './ui/Button'
import Input from './ui/Input'
import Modal from './ui/Modal'
import { kubernetesAPI } from '../services/api'

export default function ResourceAllocation() {
  const [isOpen, setIsOpen] = useState(false)
  const [cpu, setCpu] = useState(4)
  const [gpu, setGpu] = useState(2)
  const [memory, setMemory] = useState(16)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  const submit = async () => {
    try {
      await kubernetesAPI.createMLJob({ cpu, gpu, memory })
      alert('작업 제출 성공')
      close()
    } catch (e) {
      console.error(e)
      alert('제출 중 오류 발생')
    }
  }

  return (
    <>
      <Button onClick={open}>할당 설정</Button>

      <Modal isOpen={isOpen} onClose={close} title='자원 할당 설정'>
        <Input
          label='CPU 코어'
          type='number'
          min='1'
          max='24'
          value={cpu}
          onChange={(e) => setCpu(Number(e.target.value))}
        />
        <Input
          label='GPU 개수'
          type='number'
          min='0'
          max='8'
          value={gpu}
          onChange={(e) => setGpu(Number(e.target.value))}
        />
        <Input
          label='메모리 (GB)'
          type='number'
          min='1'
          max='128'
          value={memory}
          onChange={(e) => setMemory(Number(e.target.value))}
        />
        <div className='mt-6 flex justify-end space-x-2'>
          <Button variant='secondary' onClick={close}>
            취소
          </Button>
          <Button onClick={submit}>제출</Button>
        </div>
      </Modal>
    </>
  )
}
