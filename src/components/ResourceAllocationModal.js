import React, { useState, useEffect } from 'react';

function ResourceAllocationModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues = { cpu: '', gpu: '', memory: '' }
}) {
  const [cpu, setCpu] = useState('');
  const [gpu, setGpu] = useState('');
  const [memory, setMemory] = useState('');
  const [disableCpu, setDisableCpu] = useState(true);
  const [disableGpu, setDisableGpu] = useState(true);
  const [disableMemory, setDisableMemory] = useState(true);

  useEffect(() => {
    setCpu(initialValues.cpu || '');
    setGpu(initialValues.gpu || '');
    setMemory(initialValues.memory || '');
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const payload = {};
    if (!disableCpu && cpu !== '') payload.cpu = cpu;
    if (!disableGpu && gpu !== '') payload.gpu = gpu;
    if (!disableMemory && memory !== '') payload.memory = memory;
    onSubmit(payload);
    onClose();
  };

  const InputRow = ({ label, value, setValue, disabled, setDisabled, placeholder }) => (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <div className="flex gap-2 items-center">
        <button
          type="button"
          className={`px-2 py-1 rounded text-sm border ${
            disabled ? 'bg-gray-200' : 'bg-indigo-600 text-white'
          }`}
          onClick={() => setDisabled(!disabled)}
        >
          {disabled ? '변경 없음' : '설정함'}
        </button>
        <input
          type="number"
          disabled={disabled}
          className="flex-1 border rounded p-2"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">자원 할당</h2>
        <div className="space-y-4">
          <InputRow
            label="CPU 코어"
            value={cpu}
            setValue={setCpu}
            disabled={disableCpu}
            setDisabled={setDisableCpu}
            placeholder="예: 4"
          />
          <InputRow
            label="GPU 개수"
            value={gpu}
            setValue={setGpu}
            disabled={disableGpu}
            setDisabled={setDisableGpu}
            placeholder="예: 1"
          />
          <InputRow
            label="메모리 (GB)"
            value={memory}
            setValue={setMemory}
            disabled={disableMemory}
            setDisabled={setDisableMemory}
            placeholder="예: 16"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button className="px-4 py-2 rounded-lg hover:bg-gray-100" onClick={onClose}>
            취소
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            onClick={handleSubmit}
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourceAllocationModal;
