import React, { useState } from 'react'
import Button from './ui/Button'
import ResourceAllocationModal from './ResourceAllocationModal'

export default function ResourceAllocation() {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  const submit = async ({ cpu, gpu, memory }) => {
    try {
      const payload = {}
      if (cpu !== '') payload.cpu = cpu
      if (gpu !== '') payload.gpu = gpu
      if (memory !== '') payload.memory = memory

      console.log('제출 payload:', payload)

      await fetch('/api/mljobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

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
      <ResourceAllocationModal isOpen={isOpen} onClose={close} onSubmit={submit} />
    </>
  )
}
