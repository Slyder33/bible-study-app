export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Only POST allowed');

  const { prompt } = req.body;
  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const json = await completion.json();
    const text = json.choices?.[0]?.message?.content || 'No explanation available.';
    
    // Optional dummy breakdown
    res.status(200).json({
      explanation: text,
      greek: 'N/A',
      context: 'N/A',
      crossRef: 'N/A',
      commentary: 'N/A',
      application: 'N/A',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI service failed.' });
  }
}
