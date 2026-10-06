import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZZES } from '../data/quizData';
import { useProgress } from '../context/ProgressContext';

export default function QuizSection() {
  const { quizScores, recordQuizScore } = useProgress();

  const [activeQuizId, setActiveQuizId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeQuiz = QUIZZES.find(q => q.id === activeQuizId);
  const currentQuestion = activeQuiz?.questions[currentQuestionIndex];

  const handleStartQuiz = (quizId) => {
    setActiveQuizId(quizId);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsAnswerSubmitted(false);
    setQuizFinished(false);
  };

  const handleSelectOption = (optIndex) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optIndex
    }));
  };

  const handleSubmitAnswer = () => {
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnswerSubmitted(false);
    } else {
      // Sınav bitti
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let score = 0;
    activeQuiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });

    recordQuizScore(activeQuiz.id, score, activeQuiz.questions.length);
    setQuizFinished(true);

    // Eğer %70'in üzerindeyse konfeti patlat!
    if ((score / activeQuiz.questions.length) >= 0.7) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Başlık Alanı */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Award className="w-4 h-4" />
          <span>Öğrenci Değerlendirme & Testler</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Oyun Programlama Bilgi Sınavları
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Öğrendiğiniz mekanik ve mimari prensipleri test edin, rozetler kazanın ve eksik konularınızı tespit edin.
        </p>
      </div>

      {/* Sınav Seçim Menüsü veya Aktif Sınav Ekranı */}
      {!activeQuizId || quizFinished ? (
        <div className="space-y-6">
          {quizFinished && activeQuiz && (
            /* Sınav Sonuç Kartı */
            <div className="bg-slate-900 border border-indigo-500/40 p-8 rounded-3xl text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mx-auto text-2xl">
                🏆
              </div>
              <h2 className="text-2xl font-bold text-white">Sınav Tamamlandı!</h2>
              <div className="text-4xl font-black text-indigo-400 font-mono">
                {quizScores[activeQuiz.id]?.score} / {activeQuiz.questions.length} Doğru
              </div>
              <p className="text-xs text-slate-300">
                Başarı Oranı: <strong className="text-emerald-400">%{quizScores[activeQuiz.id]?.percentage}</strong>
              </p>
              
              <div className="inline-flex items-center gap-2 bg-indigo-950/60 px-4 py-2 rounded-xl border border-indigo-800 text-xs font-semibold text-indigo-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Kazanılan Rozet: {activeQuiz.badgeTitle}</span>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => handleStartQuiz(activeQuiz.id)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tekrar Çöz</span>
                </button>
                <button
                  onClick={() => setActiveQuizId(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  Tüm Sınavlara Dön
                </button>
              </div>
            </div>
          )}

          {/* Sınav Kartları Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {QUIZZES.map(quiz => {
              const previousResult = quizScores[quiz.id];

              return (
                <div
                  key={quiz.id}
                  className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl flex flex-col justify-between space-y-4 transition group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        Seviye {quiz.levelNumber}
                      </span>
                      {previousResult && (
                        <span className="text-[11px] font-mono text-emerald-400 font-bold">
                          %{previousResult.percentage}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {quiz.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      {quiz.questions.length} Soru
                    </span>
                    <button
                      onClick={() => handleStartQuiz(quiz.id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5"
                    >
                      <span>{previousResult ? 'Tekrar Et' : 'Başla'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Aktif Sınav Sorusu */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* İlerleme Çubuğu */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Soru {currentQuestionIndex + 1} / {activeQuiz.questions.length}</span>
              <span className="font-semibold text-indigo-400">{activeQuiz.title}</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                className="bg-indigo-500 h-full transition-all duration-300"
              />
            </div>
          </div>

          {/* Soru Metni */}
          <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Şıklar */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === idx;
              const isCorrect = idx === currentQuestion.correctIndex;

              let optionClasses = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  optionClasses = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrect) {
                  optionClasses = 'bg-rose-950/40 border-rose-500 text-rose-300 ring-1 ring-rose-500';
                } else {
                  optionClasses = 'opacity-40 border-slate-800 text-slate-500';
                }
              } else if (isSelected) {
                optionClasses = 'bg-indigo-950/40 border-indigo-500 text-white ring-2 ring-indigo-500/40';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border cursor-pointer transition text-xs sm:text-sm flex items-start gap-3 ${optionClasses}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-snug flex-1">{opt}</span>
                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Detaylı Açıklama Kutusu */}
          {isAnswerSubmitted && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/30 text-xs space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                <HelpCircle className="w-4 h-4" />
                <span>Teknik Açıklama & Mantık:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Aksiyon Butonu */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={() => setActiveQuizId(null)}
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              Vazgeç ve Çık
            </button>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswers[currentQuestion.id] === undefined}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition shadow"
              >
                Cevabı Onayla
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
              >
                <span>{currentQuestionIndex < activeQuiz.questions.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
