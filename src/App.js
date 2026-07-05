import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState({ text: '', author: '' });
  const [randomQuote, setRandomQuote] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [updatedQuote, setUpdatedQuote] = useState({ text: '', author: '' });

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    const response = await fetch('/quotes');
    const data = await response.json();
    setQuotes(data);
  };

  const handleInputChange = (e) => {
    setNewQuote({ ...newQuote, [e.target.name]: e.target.value });
  };

  const handleAddQuote = async (e) => {
    e.preventDefault();
    const response = await fetch('/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newQuote, id: Date.now() }), // Simple ID generation
    });
    const addedQuote = await response.json();
    setQuotes([...quotes, addedQuote]);
    setNewQuote({ text: '', author: '' });
  };

  const fetchRandomQuote = async () => {
    const response = await fetch('/quotes/random');
    const data = await response.json();
    setRandomQuote(data);
  };

  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
    setUpdatedQuote({ text: quote.text, author: quote.author });
  };

  const handleUpdateInputChange = (e) => {
    setUpdatedQuote({ ...updatedQuote, [e.target.name]: e.target.value });
  };

  const handleUpdateQuote = async (id) => {
    const response = await fetch(`/quotes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...updatedQuote, id: id }),
    });
    const updated = await response.json();
    setQuotes(quotes.map(q => (q.id === id ? updated : q)));
    setSelectedQuote(null);
  };

  const handleDeleteQuote = async (id) => {
    await fetch(`/quotes/${id}`, {
      method: 'DELETE',
    });
    setQuotes(quotes.filter(q => q.id !== id));
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote(null);
    }
  };

  return (
    <div className="App">
      <h1>Quote Generator</h1>

      <h2>Add New Quote</h2>
      <form onSubmit={handleAddQuote}>
        <input
          type="text"
          name="text"
          placeholder="Quote text"
          value={newQuote.text}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={newQuote.author}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Quote</button>
      </form>

      <h2>All Quotes</h2>
      <ul>
        {quotes.map((quote) => (
          <li key={quote.id}>
            {quote.text} - {quote.author}
            <button onClick={() => handleSelectQuote(quote)}>Edit</button>
            <button onClick={() => handleDeleteQuote(quote.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Random Quote</h2>
      <button onClick={fetchRandomQuote}>Get Random Quote</button>
      {randomQuote && (
        <div>
          <p>"{randomQuote.text}"</p>
          <p>- {randomQuote.author}</p>
        </div>
      )}

      {selectedQuote && (
        <div>
          <h2>Edit Quote</h2>
          <input
            type="text"
            name="text"
            value={updatedQuote.text}
            onChange={handleUpdateInputChange}
          />
          <input
            type="text"
            name="author"
            value={updatedQuote.author}
            onChange={handleUpdateInputChange}
          />
          <button onClick={() => handleUpdateQuote(selectedQuote.id)}>Save Changes</button>
          <button onClick={() => setSelectedQuote(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;
