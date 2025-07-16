import React, { useState, useEffect } from 'react';
import { BookOpen, Sun, Moon, Mic, MicOff, Download, Search, Lightbulb, Plus, MessageCircle, X } from 'lucide-react';

const BibleApp = () => {
  const [currentBook, setCurrentBook] = useState('Matthew');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [highlights, setHighlights] = useState({});
  const [notes, setNotes] = useState({});
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isListening, setIsListening] = useState(false);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSearchSupported(true);
    }
  }, []);

  const bibleData = {
    Matthew: {
      1: {
        1: "The book of the generation of Jesus Christ, the son of David, the son of Abraham.",
        2: "Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judah and his brethren;",
        // truncated for brevity
      },
      2: {
        1: "Now when Jesus was born in Bethlehem of Judaea in the days of Herod the king...",
        // truncated for brevity
      },
    },
  };

  const books = ['Matthew', 'Mark', 'Luke', 'John'];
  const chapters = Object.keys(bibleData[currentBook] || {}).map(Number);

  const startVoiceSearch = () => {
    if (!voiceSearchSupported) return alert('Voice search is not supported.');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      parseVoiceCommand(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const parseVoiceCommand = (transcript) => {
    const bookMap = { matthew: 'Matthew', mark: 'Mark', luke: 'Luke', john: 'John' };
    let chapter = transcript.match(/chapter (\d+)/i);
    let book = Object.keys(bookMap).find((b) => transcript.includes(b));
    if (book) setCurrentBook(bookMap[book]);
    if (chapter) setCurrentChapter(parseInt(chapter[1]));
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return setSearchResults([]);
    const results = [];
    Object.entries(bibleData).forEach(([book, chapters]) => {
      Object.entries(chapters).forEach(([ch, verses]) => {
        Object.entries(verses).forEach(([vs, text]) => {
          if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({ book, chapter: parseInt(ch), verse: parseInt(vs), text, reference: `${book} ${ch}:${vs}` });
          }
        });
      });
    });
    setSearchResults(results);
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

  const toggleHighlight = (book, chapter, verse) => {
    const key = `${book}_${chapter}_${verse}`;
    setHighlights((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getAIExplanation = async (book, chapter, verse) => {
    setLoadingAI(true);
    const verseText = bibleData[book][chapter][verse];
    const prompt = `Explain ${book} ${chapter}:${verse} (\"${verseText}\") in 3–4 sentences.`;
    try {
      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiExplanation({ text: data.explanation, verse: `${book} ${chapter}:${verse}`, verseText });
    } catch {
      const sample = {
        text: `This verse contains rich theological significance in its historical context.`,
        greek: 'Original Greek insights would be provided here.',
        context: 'Historical and cultural context for the original audience.',
        crossRef: 'Key Old Testament passages and their connections.',
        commentary: 'Theological commentary from the perspective of the original authors.',
        application: 'How this verse connects to the broader biblical narrative.',
      };
      setAiExplanation({ ...sample, verse: `${book} ${chapter}:${verse}`, verseText });
    } finally {
      setLoadingAI(false);
    }
  };

  const exportNotes = () => {
    const text = Object.entries(notes).map(([key, note]) => {
      const [book, chapter, verse] = key.split('_');
      return `${book} ${chapter}:${verse}\n${note}`;
    }).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bible_notes.txt';
    a.click();
  };

  const addInsightToNotes = () => {
    if (!aiExplanation?.verse) return;
    const match = aiExplanation.verse.match(/(\w+)\s+(\d+):(\d+)/);
    if (!match) return;
    const [, book, chapter, verse] = match;
    const key = `${book}_${chapter}_${verse}`;
    const insight = `AI Insight for ${aiExplanation.verse}\n\n${aiExplanation.text}`;
    setNotes((prev) => ({ ...prev, [key]: prev[key] ? `${prev[key]}\n\n${insight}` : insight }));
    alert('AI insight added to notes!');
  };

  // Rendering code would go here...
  return (
    <div>
      <p>This is your Bible App. Rendering structure has been shortened for this rewrite.</p>
    </div>
  );
};

export default BibleApp;
