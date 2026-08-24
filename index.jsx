import React, { useState, useEffect } from 'react';
import { 
  Building2, Calendar, Sun, Users, CheckSquare, Camera, 
  Mic, MicOff, Send, RotateCcw, Plus, Trash2, Check, AlertCircle, Sparkles, FileText, ChevronRight
} from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Form, 2: Preview/Success
  const [siteInfo, setSiteInfo] = useState({
    siteName: '강남구 역삼동 상가 인테리어 현장',
    date: new Date().toISOString().split('T')[0],
    weather: '맑음 22°C',
    manager: '김소장'
  });

  // Workers state
  const [workers, setWorkers] = useState([
    { id: 1, category: '철거팀', count: 3 },
    { id: 2, category: '목공팀', count: 4 },
    { id: 3, category: '전기팀', count: 2 },
    { id: 4, category: '타일팀', count: 0 },
  ]);
  const [newCategory, setNewCategory] = useState('');

  // Tasks state
  const [selectedTasks, setSelectedTasks] = useState([
    '거실 가벽 목공틀 시공', '천장 전기 배선 작업'
  ]);
  const [customTask, setCustomTask] = useState('');
  const presetTasks = [
    '철거 및 폐기물 반출', '거실 가벽 목공틀 시공', '천장 전기 배선 작업', 
    '욕실 방수 및 타일 시공', '내부 도장(페인트) 작업', '시스템 에어컨 배관 설치',
    '창호 및 도어 설치', '자재 입고 및 검수'
  ];

  // Photos state
  const [photos, setPhotos] = useState([
    { id: 1, tag: '목공완료', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f1f1e?auto=format&fit=crop&w=300&q=80' },
    { id: 2, tag: '자재입고', url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=300&q=80' }
  ]);

  // Notes & Voice state
  const [notes, setNotes] = useState('자재 납품이 오전 중에 원활하게 이루어졌으며, 내일은 도장 작업 전양생 예정입니다.');
  const [isRecording, setIsRecording] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateWorkerCount = (id, delta) => {
    setWorkers(workers.map(w => {
      if (w.id === id) {
        const next = Math.max(0, w.count + delta);
        return { ...w, count: next };
      }
      return w;
    }));
  };

  const addCustomWorker = () => {
    if (!newCategory.trim()) return;
    setWorkers([...workers, { id: Date.now(), category: newCategory.trim(), count: 1 }]);
    setNewCategory('');
    showToast('새 공종이 추가되었습니다.');
  };

  const removeWorker = (id) => {
    setWorkers(workers.filter(w => w.id !== id));
  };

  const toggleTask = (task) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks(selectedTasks.filter(t => t !== task));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  const handleAddCustomTask = (e) => {
    if (e.key === 'Enter' && customTask.trim()) {
      e.preventDefault();
      if (!selectedTasks.includes(customTask.trim())) {
        setSelectedTasks([...selectedTasks, customTask.trim()]);
      }
      setCustomTask('');
    }
  };

  const simulateVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      showToast('음성 인식이 완료되었습니다.');
    } else {
      setIsRecording(true);
      showToast('마이크 작동 중... 말씀하세요 (3초 후 자동완성)');
      setTimeout(() => {
        setIsRecording(false);
        setNotes(prev => prev + ' 추가 특이사항: 오후 비산 먼지 방지 조치 완료함.');
        showToast('음성이 텍스트로 변환되었습니다.');
      }, 3000);
    }
  };

  const loadYesterdayData = () => {
    setWorkers([
      { id: 1, category: '철거팀', count: 4 },
      { id: 2, category: '목공팀', count: 3 },
      { id: 3, category: '전기팀', count: 2 },
      { id: 4, category: '타일팀', count: 1 },
    ]);
    setSelectedTasks(['철거 및 폐기물 반출', '자재 입고 및 검수']);
    setNotes('전일 데이터가 정상적으로 불러와졌습니다.');
    showToast('전일(어제) 공사일보 내용을 불러왔습니다.');
  };

  const handleMockPhotoCapture = () => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80'
    ];
    const randomUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
    setPhotos([...photos, { id: Date.now(), tag: '현장찰칵', url: randomUrl }]);
    showToast('현장 사진이 촬영 및 첨부되었습니다.');
  };

  const handleSubmitReport = () => {
    setCurrentStep(2);
    showToast('공사일보가 성공적으로 본사에 전송되었습니다!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex justify-center p-0 sm:py-6 sm:px-4 font-sans antialiased selection:bg-orange-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-950 sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col relative">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Bar */}
        <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center border border-orange-500/30 text-orange-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-orange-400 font-semibold tracking-wider uppercase">스마트 공사일보</span>
                <h1 className="text-sm font-bold text-slate-200 truncate max-w-[200px]">{siteInfo.siteName}</h1>
              </div>
            </div>
            <button 
              onClick={loadYesterdayData}
              className="text-xs bg-slate-800 hover:bg-slate-700 active:scale-95 transition text-slate-300 px-3 py-2 rounded-xl flex items-center gap-1.5 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
              <span>전일복사</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-28">

          {currentStep === 1 ? (
            <>
              {/* Date & Weather Card */}
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-800 rounded-xl text-slate-300">
                    <Calendar className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">작성 일자</div>
                    <div className="text-sm font-bold text-slate-200">{siteInfo.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/50">
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span className="text-xs font-medium text-slate-300">{siteInfo.weather}</span>
                </div>
              </div>

              {/* Section 1: Workers */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-400" />
                    <span>1. 공종별 투입 인력</span>
                    <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30">
                      총 {workers.reduce((acc, cur) => acc + cur.count, 0)}명
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {workers.map((worker) => (
                    <div key={worker.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between hover:border-slate-700 transition">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-sm text-slate-200">{worker.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateWorkerCount(worker.id, -1)}
                          className="w-9 h-9 bg-slate-800 hover:bg-slate-700 active:scale-90 transition rounded-xl flex items-center justify-center font-bold text-lg text-slate-300 border border-slate-700"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-base text-orange-400">{worker.count}</span>
                        <button 
                          onClick={() => updateWorkerCount(worker.id, 1)}
                          className="w-9 h-9 bg-orange-600 hover:bg-orange-500 active:scale-90 transition rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-orange-600/30"
                        >
                          +
                        </button>
                        {workers.length > 1 && (
                          <button 
                            onClick={() => removeWorker(worker.id)}
                            className="p-2 text-slate-500 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Worker Form */}
                <div className="flex gap-2 pt-1">
                  <input 
                    type="text" 
                    placeholder="새 공종 직접 입력 (예: 설비팀)"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition"
                  />
                  <button 
                    onClick={addCustomWorker}
                    className="bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-4 h-4 text-orange-400" />
                    <span>추가</span>
                  </button>
                </div>
              </section>

              {/* Section 2: Tasks */}
              <section className="space-y-3">
                <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-orange-400" />
                  <span>2. 오늘의 주요 작업 내용</span>
                </h2>
                
                <div className="flex flex-wrap gap-2">
                  {presetTasks.map((task, idx) => {
                    const isSelected = selectedTasks.includes(task);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleTask(task)}
                        className={`text-xs px-3.5 py-2.5 rounded-xl font-medium transition flex items-center gap-2 border ${
                          isSelected 
                            ? 'bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-600/20' 
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border ${isSelected ? 'bg-white text-orange-600 border-white' : 'border-slate-600'}`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{task}</span>
                      </button>
                    );
                  })}
                </div>

                <input 
                  type="text"
                  placeholder="직접 작업 입력 후 엔터 치기..."
                  value={customTask}
                  onChange={(e) => setCustomTask(e.target.value)}
                  onKeyDown={handleAddCustomTask}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition mt-2"
                />
              </section>

              {/* Section 3: Photos */}
              <section className="space-y-3">
                <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-orange-400" />
                  <span>3. 현장 사진 첨부</span>
                </h2>

                <div className="grid grid-cols-3 gap-2.5">
                  <button 
                    onClick={handleMockPhotoCapture}
                    className="aspect-square bg-slate-900 hover:bg-slate-800 active:scale-95 border border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-orange-400 transition group"
                  >
                    <div className="p-3 bg-slate-800 group-hover:bg-orange-500/20 rounded-xl transition">
                      <Camera className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="text-xs font-semibold">사진 촬영</span>
                  </button>

                  {photos.map((p) => (
                    <div key={p.id} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-800 group">
                      <img src={p.url} alt="현장사진" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" onError={(e)=>{e.target.src='https://placehold.co/300x300/1e293b/cbd5e1?text=Photo'}} />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2">
                        <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-md font-semibold">{p.tag}</span>
                      </div>
                      <button 
                        onClick={() => setPhotos(photos.filter(x => x.id !== p.id))}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 4: Voice / Memo Notes */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-400" />
                    <span>4. 특이사항 및 음성 메모</span>
                  </h2>
                  <button 
                    onClick={simulateVoiceRecording}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition border ${
                      isRecording 
                        ? 'bg-red-600 text-white border-red-500 animate-pulse' 
                        : 'bg-slate-800 hover:bg-slate-700 text-orange-400 border-slate-700'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecording ? '듣는 중...' : '음성 입력 (STT)'}</span>
                  </button>
                </div>

                <textarea 
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="특이사항이나 자재 입고 지연 사유 등을 입력하세요..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition resize-none"
                />
              </section>
            </>
          ) : (
            /* Success / Preview State */
            <div className="py-12 px-4 text-center space-y-6">
              <div className="w-20 h-20 bg-orange-600/20 border border-orange-500/40 text-orange-400 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-100">공사일보 제출 완료!</h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  본사 관리자 및 단톡방으로 공식 엑셀/PDF 양식이 자동 변환되어 전송되었습니다. 수고하셨습니다.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">현장명</span>
                  <span className="font-semibold text-slate-200">{siteInfo.siteName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">투입 인력</span>
                  <span className="font-semibold text-orange-400">총 {workers.reduce((a,b)=>a+b.count,0)}명</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">완료 작업</span>
                  <span className="font-semibold text-slate-200">{selectedTasks.length}건 선택됨</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">첨부 사진</span>
                  <span className="font-semibold text-slate-200">{photos.length}장</span>
                </div>
              </div>

              <button 
                onClick={() => setCurrentStep(1)}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3.5 rounded-2xl text-sm font-semibold text-slate-200 transition"
              >
                다시 수정하기
              </button>
            </div>
          )}

        </main>

        {/* Footer Action Bar */}
        {currentStep === 1 && (
          <footer className="absolute bottom-0 inset-x-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-4 z-40">
            <button 
              onClick={handleSubmitReport}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-98 transition py-4 rounded-2xl font-bold text-white shadow-xl shadow-orange-600/25 flex items-center justify-center gap-2 group"
            >
              <span>🚀 10초 만에 일보 제출하기</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
          </footer>
        )}

      </div>
    </div>
  );
}
