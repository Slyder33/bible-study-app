import React, { useState } from ‘react’;
export default function BibleApp() {
const [currentBook, setCurrentBook] = useState(‘Matthew’);
const [currentChapter, setCurrentChapter] = useState(1);
const [darkMode, setDarkMode] = useState(false);
const [notes, setNotes] = useState({});
