import React, { useState, useRef, useEffect } from 'react'
import { Layers } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Modal from './ui/Modal'
import { kubernetesAPI } from '../services/kubernetes'
import ResourceAllocation from './ResourceAllocation'
import Input from './ui/Input'


const temp = [
  {
    name: 'standby-controller-6ddf7dc554-btzf6',
    status: 'Stop',
    cpu: '100%',
    gpu: '100%',
    memory: '100%',
    job: 'job1',
  },
  {
    name: 'pod2',
    status: 'Running',
    cpu: '100%',
    gpu: '100%',
    memory: '100%',
    job: 'job2',
  },
]

const temp2 = [
  '2025-05-13T12:10:38.152860304Z 2025-05-13T12:10:38Z INFO controller-runtime.metrics Starting metrics server',
  '2025-05-13T12:10:38.154650341Z 2025-05-13T12:10:38Z INFO Starting EventSource {"controller": "mljob", "controllerGroup": "ai.mljob-controller", "controllerKind": "MLJob", "source": "kind source: *v1.MLJob"}',
  '2025-05-13T12:10:38.154686743Z 2025-05-13T12:10:38Z INFO Starting EventSource {"controller": "mljob", "controllerGroup": "ai.mljob-controller", "controllerKind": "MLJob", "source": "kind source: *v1beta1.Workload"}',
  '2025-05-13T12:10:38.154694736Z 2025-05-13T12:10:38Z INFO Starting EventSource {"controller": "mljob", "controllerGroup": "ai.mljob-controller", "controllerKind": "MLJob", "source": "kind source: *v1.Pod"}',
  '2025-05-13T12:10:38.154701951Z 2025-05-13T12:10:38Z INFO controller-runtime.metrics Serving metrics server {"bindAddress": ":8080", "secure": false}',
  '2025-05-13T12:10:38.272979200Z 2025-05-13T12:10:38Z INFO Starting Controller {"controller": "mljob", "controllerGroup": "ai.mljob-controller", "controllerKind": "MLJob"}',
  '2025-05-13T12:10:38.273011354Z 2025-05-13T12:10:38Z INFO Starting workers {"controller": "mljob", "controllerGroup": "ai.mljob-controller", "controllerKind": "MLJob", "worker count": 1}',
  '2025-05-13T12:10:38.152860304Z 2025-05-13T12:10:38Z INFO controller-runtime.metrics Starting metrics server',
  '2025-05-13T12:10:38.154650341Z 2025-05-13T12:10:38Z INFO Starting EventSource {"controller": "mljob", "controllerGroup": "ai.mljob-controller", "controllerKind": "MLJob", "source": "kind source: *v1.MLJob"}',
  '2025-05-13T12:10:38.154686743Z 2025-05-13T12:10:38Z INFO Starting EventSource {"controller": "mljob", "controllerGroup": "ai.mljob-controller", "controllerKind": "MLJob", "source": "kind source: *v1beta1.Workload"}',
  '2025-05-13T12:10:38.154694736Z 2025-05-13T12:10:38Z INFO Starting EventSource {"controller": "mljob", "controllerGroup": "ai.mljob-controller", "controllerKind": "MLJob", "source": "kind source: *v1.Pod"}',
  '2025-05-13T12:10:38.154701951Z 2025-05-13T12:10:38Z INFO controller-runtime.metrics Serving metrics server {"bindAddress": ":8080", "secure": false}',
  '2025-05-13T12:10:38.272979200Z 2025-05-13T12:10:38Z INFO Starting Controller {"controller": "mljob", "controllerGroup": "ai.mljob-controller", "controllerKind": "MLJob"}',
  '2025-05-13T12:10:38.273011354Z 2025-05-13T12:10:38Z INFO Starting workers {"controller": "mljob", "controllerGroup": "ai.mljob-controller", "controllerKind": "MLJob", "worker count": 1}',
]


export default function PodTable({ pods }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [logs, setLogs] = useState([])
  const [socket, setSocket] = useState(null)
  const [selectedPod, setSelectedPod] = useState('')

  const [podName, setPodName] = useState('')
  const [requirements, setRequirements] = useState('')
  const [file, setFile] = useState(null)

  const bottomRef = useRef(null)


  const safePods = Array.isArray(pods) && pods.length > 0 ? pods : []

  const openLogs = (podName) => {
    setSelectedPod(podName)
    setLogs([])
    setIsOpen(true)

    try {
      const text = await kubernetesAPI.getPodLogs(podName)
      setLogs(text.split('\n'))
    } catch {
      setLogs(temp2)
    } finally {
      setLoading(false)


    const ws = kubernetesAPI.connectLogStream(podName)

    ws.onopen = () => {
      console.log(`${podName} WebSocket 로그 연결됨`)
    }

    ws.onmessage = (event) => {
      const lines = event.data.split('\n')
      setLogs((prev) => [...prev, ...lines.filter(Boolean)])

    }

    ws.onerror = (e) => {
      console.error('로그 WebSocket 오류:', e)
      setLogs(['로그 스트리밍 중 오류 발생'])
    }

    ws.onclose = () => {
      console.warn('로그 WebSocket 연결 종료')
    }

    setSocket(ws)
  }

  const close = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close()
    }
    setSocket(null)
    setLogs([])
    setIsOpen(false)
  }

  const submitApi = async () => {
    /**
     * podName, requirements는 string
     * file은 File 객체인데 여기서 에러가 발생할 수도 있음. 이는 걍
     * 서버 요구사항에 맞춰서 gpt한테 너가 짜달라고 하면 짜줄거임
     */
    console.log('Pod Name:', podName)
    console.log('Requirements:', requirements)
    console.log('File:', file)

    // 여기는 너가 알아서 API 구현해서 넣으면 됨
    // try {
    //   const response = await kubernetesAPI.createPod(podName, requirements, file)
    //   console.log(response)
    // } catch (error) {
    //   console.error(error)
    // }
  }

  // 로그 추가 시 자동 스크롤
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])


  return (
    <>
      <Card>
        <h2 className='text-xl font-semibold mb-4 flex items-center'>
          <Layers className='mr-2 text-indigo-600' /> 활성 파드
          <Button
            variant='create'
            className='ml-auto'
            onClick={() => setIsCreateOpen(true)}
          >
            파드 생성
          </Button>
        </h2>
        <div>
          <table className='min-w-full divide-y divide-gray-200 table-auto'>
            <thead className='bg-gray-50'>
              <tr>
                {['파드명', '상태', 'CPU', 'GPU', '메모리', 'Age', '재시작', '작업'].map((col) => (
                  <th
                    key={col}
                    className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase'
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {safePods.map((pod, idx) => (
                <tr
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  key={pod.name}
                >
                  <td className='px-4 py-4'>{pod.name}</td>
                  <td className='px-4 py-4 text-center'>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        pod.status === 'Running'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {pod.status}
                    </span>
                  </td>
                  <td className='px-4 py-4'>{pod.cpu}</td>
                  <td className='px-4 py-4'>{pod.gpu}</td>
                  <td className='px-4 py-4'>{pod.memory}</td>
                  <td className='px-4 py-4 text-center'>
                    {typeof pod.age === 'string' && pod.age.trim() !== '' ? pod.age : '-'}
                  </td>
                  <td className='px-4 py-4 text-center'>
                    {typeof pod.restarts === 'number' ? pod.restarts : 0}
                  </td>
                  <td className='px-4 py-4 text-right space-x-2'>
                    <Button variant='secondary' onClick={() => openLogs(pod.name)}>
                      로그 보기
                    </Button>
                    <ResourceAllocation />
                    <Button variant='danger' onClick={() => {}}>
                      중지
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>


      <Modal
        isOpen={isOpen}
        onClose={close}
        title={`${selectedPod} 로그`}
        isLog={true}
      >
        {loading ? (
          <p>로딩 중…</p>
        ) : (
          <div className='bg-gray-900 text-gray-100 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm'>
            {logs.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}

      </Modal>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title='파드 생성'
      >
        <Input
          label='파드 이름'
          value={podName}
          onChange={(e) => setPodName(e.target.value)}
        />
        <Input
          label='요구 사항'
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />
        <Input
          label='파일 추가'
          type='file'
          onChange={(e) => setFile(e.target.files[0])}
        />
        <div className='mt-6 flex justify-end space-x-2'>
          <Button variant='secondary' onClick={() => setIsCreateOpen(false)}>
            취소
          </Button>
          <Button onClick={submitApi}>생성</Button>
        </div>
      </Modal>
    </>
  )
}
