import React, { useState, useEffect } from 'react';

function ResourceAllocationModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues = { cpuCount: 1, gpuCount: 0, memory: 1 }
}) {
  const [cpuCount, setCpuCount] = useState(initialValues.cpuCount);
  const [gpuCount, setGpuCount] = useState(initialValues.gpuCount);
  const [memory, setMemory] = useState(initialValues.memory);

  useEffect(() => {
    setCpuCount(initialValues.cpuCount);
    setGpuCount(initialValues.gpuCount);
    setMemory(initialValues.memory);
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">자원 할당</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">CPU 코어</label>
            <input
              type="number"
              min="1"
              max="24"
              value={cpuCount}
              onChange={e => setCpuCount(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">GPU 개수</label>
            <input
              type="number"
              min="0"
              max="8"
              value={gpuCount}
              onChange={e => setGpuCount(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">메모리 (GB)</label>
            <input
              type="number"
              min="1"
              max="128"
              value={memory}
              onChange={e => setMemory(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            className="px-4 py-2 rounded-lg hover:bg-gray-100"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            onClick={() => {
              onSubmit({ cpuCount, gpuCount, memory });
              onClose();
            }}
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourceAllocationModal;