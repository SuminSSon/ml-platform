import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { kubernetesAPI } from '../services/api';

export default function PodTable({ pods }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPod, setSelectedPod] = useState('');

  // pods가 null 이거나 배열이 아닐 때 빈 배열로 대체
  const safePods = Array.isArray(pods) ? pods : [];

  const openLogs = async (podName) => {
    setSelectedPod(podName);
    setLoading(true);
    setIsOpen(true);
    try {
      const text = await kubernetesAPI.getPodLogs(podName);
      setLogs(text.split('\n'));
    } catch {
      setLogs(['로그 불러오기 실패']);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setLogs([]);
  };

  return (
    <>
      <Card>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Layers className="mr-2 text-indigo-600" /> 활성 파드
        </h2>
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                {['파드명','상태','CPU','GPU','메모리','작업'].map(col => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {safePods.map((pod, idx) => (
                <tr 
                  className={ idx % 2 === 0 ? 'bg-white' : 'bg-gray-50' }
                  key={pod.name}
                >
                  <td className="px-6 py-4">{pod.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      pod.status === 'Running'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{pod.cpu}</td>
                  <td className="px-6 py-4">{pod.gpu}</td>
                  <td className="px-6 py-4">{pod.memory}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="secondary" onClick={() => openLogs(pod.name)}>
                      로그 보기
                    </Button>
                    <Button variant="danger" onClick={() => {/* 중지 로직 */}}>
                      중지
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isOpen} onClose={close} title={`${selectedPod} 로그`}>
        {loading ? (
          <p>로딩 중…</p>
        ) : (
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
            {logs.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}
