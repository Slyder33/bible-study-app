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

  // Sample ASV Bible data (Matthew 1-2 for prototype)
  const bibleData = {
    Matthew: {
      1: {
        1: "The book of the generation of Jesus Christ, the son of David, the son of Abraham.",
        2: "Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judah and his brethren;",
        3: "and Judah begat Perez and Zerah of Tamar; and Perez begat Hezron; and Hezron begat Ram;",
        4: "and Ram begat Amminadab; and Amminadab begat Nahshon; and Nahshon begat Salmon;",
        5: "and Salmon begat Boaz of Rahab; and Boaz begat Obed of Ruth; and Obed begat Jesse;",
        6: "and Jesse begat David the king. And David begat Solomon of her that had been the wife of Uriah;",
        7: "and Solomon begat Rehoboam; and Rehoboam begat Abijah; and Abijah begat Asa;",
        8: "and Asa begat Jehoshaphat; and Jehoshaphat begat Joram; and Joram begat Uzziah;",
        9: "and Uzziah begat Jotham; and Jotham begat Ahaz; and Ahaz begat Hezekiah;",
        10: "and Hezekiah begat Manasseh; and Manasseh begat Amon; and Amon begat Josiah;",
        11: "and Josiah begat Jechoniah and his brethren, at the time of the carrying away to Babylon.",
        12: "And after the carrying away to Babylon, Jechoniah begat Shealtiel; and Shealtiel begat Zerubbabel;",
        13: "and Zerubbabel begat Abiud; and Abiud begat Eliakim; and Eliakim begat Azor;",
        14: "and Azor begat Sadoc; and Sadoc begat Achim; and Achim begat Eliud;",
        15: "and Eliud begat Eleazar; and Eleazar begat Matthan; and Matthan begat Jacob;",
        16: "and Jacob begat Joseph the husband of Mary, of whom was born Jesus, who is called Christ.",
        17: "So all the generations from Abraham unto David are fourteen generations; and from David unto the carrying away to Babylon fourteen generations; and from the carrying away to Babylon unto the Christ fourteen generations.",
        18: "Now the birth of Jesus Christ was on this wise: When his mother Mary had been betrothed to Joseph, before they came together she was found with child of the Holy Spirit.",
        19: "And Joseph her husband, being a righteous man, and not willing to make her a public example, was minded to put her away privily.",
        20: "But when he thought on these things, behold, an angel of the Lord appeared unto him in a dream, saying, Joseph, thou son of David, fear not to take unto thee Mary thy wife: for that which is conceived in her is of the Holy Spirit.",
        21: "And she shall bring forth a son; and thou shalt call his name Jesus; for it is he that shall save his people from their sins.",
        22: "Now all this is come to pass, that it might be fulfilled which was spoken by the Lord through the prophet, saying,",
        23: "Behold, the virgin shall be with child, and shall bring forth a son, And they shall call his name Immanuel; which is, being interpreted, God with us.",
        24: "And Joseph arose from his sleep, and did as the angel of the Lord commanded him, and took unto him his wife;",
        25: "and knew her not till she had brought forth a son: and he called his name Jesus.",
      },
      2: {
        1: "Now when Jesus was born in Bethlehem of Judaea in the days of Herod the king, behold, wise men from the east came to Jerusalem, saying,",
        2: "Where is he that is born King of the Jews? for we saw his star in the east, and are come to worship him.",
        3: "And when Herod the king heard it, he was troubled, and all Jerusalem with him.",
        4: "And gathering together all the chief priests and scribes of the people, he inquired of them where the Christ should be born.",
        5: "And they said unto him, In Bethlehem of Judaea: for thus it is written through the prophet,",
        6: "And thou Bethlehem, land of Judah, Art in no wise least among the princes of Judah: For out of thee shall come forth a governor, Who shall be shepherd of my people Israel.",
        7: "Then Herod privily called the wise men, and learned of them exactly what time the star appeared.",
        8: "And he sent them to Bethlehem, and said, Go and search out exactly concerning the young child; and when ye have found him, bring me word, that I also may come and worship him.",
        9: "And they, having heard the king, went their way; and lo, the star, which they saw in the east, went before them, till it came and stood over where the young child was.",
        10: "And when they saw the star, they rejoiced with exceeding great joy.",
        11: "And they came into the house and saw the young child with Mary his mother; and they fell down and worshipped him; and opening their treasures they offered unto him gifts, gold and frankincense and myrrh.",
        12: "And being warned of God in a dream that they should not return to Herod, they departed into their own country another way.",
        13: "Now when they were departed, behold, an angel of the Lord appeareth to Joseph in a dream, saying, Arise and take the young child and his mother, and flee into Egypt, and be thou there until I tell thee: for Herod will seek the young child to destroy him.",
        14: "And he arose and took the young child and his mother by night, and departed into Egypt;",
        15: "and was there until the death of Herod: that it might be fulfilled which was spoken by the Lord through the prophet, saying, Out of Egypt did I call my son.",
        16: "Then Herod, when he saw that he was mocked of the wise men, was exceeding wroth, and sent forth, and slew all the male children that were in Bethlehem, and in all the borders thereof, from two years old and under, according to the time which he had exactly learned of the wise men.",
        17: "Then was fulfilled that which was spoken through Jeremiah the prophet, saying,",
        18: "A voice was heard in Ramah, Weeping and great mourning, Rachel weeping for her children; And she would not be comforted, because they are not.",
        19: "But when Herod was dead, behold, an angel of the Lord appeareth in a dream to Joseph in Egypt, saying,",
        20: "Arise and take the young child and his mother, and go into the land of Israel: for they are dead that sought the young child's life.",
        21: "And he arose and took the young child and his mother, and came into the land of Israel.",
        22: "But when he heard that Archelaus was reigning over Judaea in the room of his father Herod, he was afraid to go thither; and being warned of God in a dream, he withdrew into the parts of Galilee,",
        23: "and came and dwelt in a city called Nazareth; that it might be fulfilled which was spoken through the prophets, that he should be called a Nazarene.",
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

   // [Rendering block begins here]
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
                          <button onClick={(e) => { e.stopPropagation(); toggleHighlight(currentBook, currentChapter, verse); }} className={`text-xs px-2 py-1 rounded ${isHighlighted ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 dark:bg-gray-600'}`}>
                            {isHighlighted ? 'Highlighted' : 'Highlight'}
                          </button>
                          {hasNote && <MessageCircle className="h-4 w-4 text-blue-600" />}
                          <button onClick={(e) => { e.stopPropagation(); getAIExplanation(currentBook, currentChapter, verse); }} className="text-xs px-2 py-1 rounded bg-purple-600 text-white hover:bg-purple-700">
                            <Lightbulb className="h-3 w-3 inline mr-1" /> AI
                          </button>
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
                  <button onClick={addInsightToNotes} className="flex items-center space-x-2 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                    <Plus className="h-4 w-4" /> <span>Add to Notes</span>
                  </button>
                )}
              </div>
              {loadingAI ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-sm">Analyzing scripture with AI...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiExplanation.verse && (
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      <p className="font-medium">{aiExplanation.verse}</p>
                      <p className="italic mt-1">"{aiExplanation.verseText}"</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-purple-600 mb-1">Explanation</h4>
                    <p className="text-sm">{aiExplanation.text}</p>
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
              <h3 className="font-semibold">
                Note for {selectedVerse?.book} {selectedVerse?.chapter}:{selectedVerse?.verse}
              </h3>
              <button onClick={() => setShowNoteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
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
