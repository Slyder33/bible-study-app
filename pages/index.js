import React, { useState } from "react";

export default function BibleApp() {
  const [currentBook, setCurrentBook] = useState("Matthew");
  const [currentChapter, setCurrentChapter] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState({});

  const bibleData = {
    Matthew: {
      1: {
        1: "The book of the generation of Jesus Christ, the son of David, the son of Abraham.",
        16: "and Jacob begat Joseph the husband of Mary, of whom was born Jesus, who is called Christ.",
        23: "Behold, the virgin shall be with child, and shall bring forth a son, And they shall call his name Immanuel; which is, being interpreted, God with us.",
      },
    },
  };

  const handleNoteChange = (verse, note) => {
    setNotes((prev) => ({ ...prev, [verse]: note }));
  };

  const currentChapterData = bibleData[currentBook]?.[currentChapter] || {};

  return (
    <div
      className={`min-h-screen p-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">The Book of Facts</h1>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          {currentBook} Chapter {currentChapter}
        </h2>

        {Object.entries(currentChapterData).map(([verse, text]) => (
          <div key={verse} className="mb-4 p-4 border rounded">
            <span className="font-bold text-blue-600">{verse}. </span>
            <span>{text}</span>
            <textarea
              placeholder="Add your note..."
              className="w-full mt-2 p-2 border rounded"
              onChange={(e) =>
                handleNoteChange(
                  `${currentBook}_${currentChapter}_${verse}`,
                  e.target.value
                )
              }
            />
          </div>
        ))}
      </main>
    </div>
  );
}
