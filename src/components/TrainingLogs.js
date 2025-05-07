import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import Card from './ui/Card';
import Input from './ui/Input';

function TrainingLogs() {
  const [logs, setLogs] = useState([]);
  const [term, setTerm] = useState('');

  useEffect(() => {
    // 실시간/초기 로그 로드 로직
  }, []);

  const filtered = logs.filter(log =>
    log.message.toLowerCase().includes(term.toLowerCase()) ||
    log.level.toLowerCase().includes(term.toLowerCase())
  );

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Activity className="mr-2 text-indigo-600" /> 학습 로그
      </h2>
      <Input
        label="로그 검색"
        placeholder="검색어를 입력하세요..."
        value={term}
        onChange={e => setTerm(e.target.value)}
      />
      <div className="bg-gray-800 text-gray-100 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
        {filtered.map((log, i) => (
          <div key={i} className={`mb-1 ${log.level === 'WARNING' ? 'text-yellow-300' : 'text-gray-300'}`}>
            <span className="text-gray-500">[{log.time}]</span>{' '}
            <span className={log.level === 'WARNING' ? 'text-yellow-300 font-bold' : 'text-blue-300'}>
              {log.level}
            </span>: {log.message}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default TrainingLogs;
