// components/BibleApp.js
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sun,
  Moon,
  Mic,
  MicOff,
  Download,
  Search,
  Lightbulb,
  Plus,
  MessageCircle,
  X,
} from 'lucide-react';

// Tailwind JIT helpers – keep even if unused
// bg-yellow-200 dark:bg-yellow-800

const BibleApp = () => {
  /* ---------- state ---------- */
  const [currentBook, setCurrentBook]   = useState('Matthew');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [searchTerm, setSearchTerm]     = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [highlights, setHighlights]     = useState({});
  const [notes, setNotes]               = useState({});
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText]         = useState('');
  const [darkMode, setDarkMode]         = useState(false);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [loadingAI, setLoadingAI]       = useState(false);
  const [fontSize, setFontSize]         = useState(16);
  const [isListening, setIsListening]   = useState(false);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);

  /* ---------- effects ---------- */
  // Enable voice search if supported
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSearchSupported(true);
    }
  }, []);

  // Dark mode toggle
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Load highlights from localStorage on mount
  useEffect(() => {
    const savedHighlights = localStorage.getItem('bibleHighlights');
    if (savedHighlights) {
      setHighlights(JSON.parse(savedHighlights));
    }
  }, []);

  // Persist highlights to localStorage when updated
  useEffect(() => {
    localStorage.setItem('bibleHighlights', JSON.stringify(highlights));
  }, [highlights]);

  /* ---------- bible data ---------- */
  const bibleData = {
    Matthew: {
      1: {
        1: 'The book of the generation of Jesus Christ…',
        // …(all Matthew 1–2 verses)
        25: 'and knew her not till she had brought forth a son: and he called his name Jesus.',
      },
      2: {
        1: 'Now when Jesus was born in Bethlehem of Judaea…',
        23: 'that he should be called a Nazarene.',
      },
    },
    Mark:   { 1: { 1: 'The beginning of the gospel of Jesus Christ…' } },
    Luke:   { 1: { 1: 'Forasmuch as many have taken in hand…' } },
    John:   { 1: { 1: 'In the beginning was the Word…' } },
  };

  /* ---------- helpers ---------- */
  const books   = Object.keys(bibleData);
  const chapters = Object.keys(bibleData[currentBook] || {}).map(Number);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const results = [];
    Object.entries(bibleData).forEach(([book, chapters]) => {
      Object.entries(chapters).forEach(([ch, verses]) => {
        Object.entries(verses).forEach(([vs, text]) => {
          if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
              book,
              chapter: Number(ch),
              verse: Number(vs),
              text,
              reference: `${book} ${ch}:${vs}`,
            });
          }
        });
      });
    });
    setSearchResults(results);
  };

  // Highlight toggle with localStorage persistence
  const toggleHighlight = (book, chapter, verse) => {
    const key = `${book}_${chapter}_${verse}`;
    setHighlights((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVerseClick = (book, chapter, verse) => {
    const key = `${book}_${chapter}_${verse}`;
    setSelectedVerse({ book, chapter, verse, key });
    setNoteText(notes[key] || '');
    setShowNoteModal(true);
  };

  const saveNote = () => {
    if (selectedVerse) {
      setNotes((prev) => ({ ...prev, [selectedVerse.key]: noteText }));
      setShowNoteModal(false);
    }
  };

  const getAIExplanation = async (book, chapter, verse) => {
    setLoadingAI(true);
    const verseText = bibleData[book]?.[chapter]?.[verse];
    if (!verseText) return setLoadingAI(false);
    const prompt = `Explain ${book} ${chapter}:${verse} ("${verseText}") in 3–4 sentences.`;
    try {
      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiExplanation({ text: data.explanation, verse: `${book} ${chapter}:${verse}`, verseText });
    } catch {
      setAiExplanation({ text: 'AI explanation unavailable.', verse: `${book} ${chapter}:${verse}`, verseText });
    } finally {
      setLoadingAI(false);
    }
  };

  const exportNotes = () => {
    const text = Object.entries(notes)
      .map(([key, note]) => {
        const [book, chapter, verse] = key.split('_');
        return `${book} ${chapter}:${verse}\n${note}`;
      })
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bible_notes.txt';
    a.click();
  };

  const startVoiceSearch = () => {
    if (!voiceSearchSupported) return alert('Voice search not supported.');
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Speech();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const t = e.results[0][0].transcript.toLowerCase();
      const bookMap = { matthew: 'Matthew', mark: 'Mark', luke: 'Luke', john: 'John' };
      const b = Object.keys(bookMap).find(k => t.includes(k));
      if (b) setCurrentBook(bookMap[b]);
      const m = t.match(/chapter (\d+)/i);
      if (m) setCurrentChapter(Number(m[1]));
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  /* ---------- render ---------- */
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold">ASV Bible Study</h1>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Font Size:</label>
              <input type="range" min="12" max="24" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-20" />
              <span className="text-sm">{fontSize}px</span>
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              {voiceSearchSupported && (
                <button onClick={startVoiceSearch} disabled={isListening} className={`p-2 rounded-lg ${isListening ? 'bg-red-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              )}
              <button onClick={exportNotes} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="h-4 w-4" />
                <span>Export Notes</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="space-y-6">
          <section className={`rounded-lg border p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Book</label>
                <select value={currentBook} onChange={(e) => setCurrentBook(e.target.value)} className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                  {books.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Chapter</label>
                <select value={currentChapter} onChange={(e) => setCurrentChapter(Number(e.target.value))} className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                  {chapters.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className={`rounded-lg border p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className="font-semibold mb-4">Search</h3>
            <div className="flex space-x-2">
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search verses..." onKeyPress={(e) => e.key === 'Enter' && handleSearch()} className={`flex-1 p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
              <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </section>
        </aside>

        <section className="lg:col-span-2 space-y-6">
          <div className={`rounded-lg border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h2 className="text-3xl font-bold mb-6 text-center">{currentBook} Chapter {currentChapter}</h2>
            <div className="space-y-4" style={{ fontSize: `${fontSize}px` }}>
              {Object.entries(bibleData[currentBook]?.[currentChapter] || {}).map(([verse, text]) => {
                const key = `${currentBook}_${currentChapter}_${verse}`;
                const isHighlighted = highlights[key];
                const hasNote = notes[key];
                return (
                  <div key={verse} className={`p-3 rounded-lg cursor-pointer transition-colors ${isHighlighted ? 'bg-yellow-200 dark:bg-yellow-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={() => handleVerseClick(currentBook, currentChapter, verse)}>
                    <div className="flex items-start space-x-3">
                      <span className="w-8 text-sm font-bold text-blue-600">{verse}</span>
                      <div className="flex-1">
                        <span className="leading-relaxed">{text}</span>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            key={`hl-${currentBook}-${currentChapter}-${verse}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleHighlight(currentBook, currentChapter, verse);
                            }}
                            className={`text-xs px-2 py-1 rounded ${isHighlighted ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 dark:bg-gray-600'}`}
                          >
                            {isHighlighted ? 'Highlighted' : 'Highlight'}
                          </button>
                          {hasNote && <MessageCircle className="h-4 w-4 text-blue-600" />}
                          <button onClick={(e) => { e.stopPropagation(); getAIExplanation(currentBook, currentChapter, verse); }} className="text-xs px-2 py-1 rounded bg-purple-600 text-white hover:bg-purple-700"><Lightbulb className="h-3 w-3 inline mr-1" /> AI</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {(aiExplanation || loadingAI) && (
            <div className={`rounded-lg border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-purple-50 border-purple-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-purple-600">AI Biblical Insight</h3>
                {aiExplanation && !loadingAI && (
                  <button onClick={() => {
                      const key = aiExplanation.verse.replace(/\s+/g, '_').replace(':', '_');
                      const insight = `AI insight for ${aiExplanation.verse}\n\n${aiExplanation.text}`;
                      setNotes((n) => ({ ...n, [key]: n[key] ? `${n[key]}\n\n${insight}` : insight }));
                    }} className="flex items-center space-x-2 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                    <Plus className="h-4 w-4" /> <span>Add to Notes</span>
                  </button>
                )}
              </div>
              {loadingAI ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-sm">Analyzing scripture with AI…</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiExplanation?.verse && (
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      <p className="font-medium">{aiExplanation.verse}</p>
                      <p className="italic mt-1">"{aiExplanation.verseText}"</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-purple-600 mb-1">Explanation</h4>
                    <p className="text-sm">{aiExplanation?.text}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Note for {selectedVerse?.book} {selectedVerse?.chapter}:{selectedVerse?.verse}</h3>
              <button onClick={() => setShowNoteModal(false)} className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Enter your note here..." className={`w-full p-3 rounded border h-32 resize-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} autoFocus />
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={() => setShowNoteModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={saveNote} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BibleApp;
