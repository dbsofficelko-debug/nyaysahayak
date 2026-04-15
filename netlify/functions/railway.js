const RAILWAY = 'https://nyaysahayak-api-production.up.railway.app';

exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  try {
    const path = event.path.replace('/.netlify/functions/railway', '') || '/';
    const qs   = event.rawQuery ? '?' + event.rawQuery : '';
    const url  = `${RAILWAY}${path}${qs}`;

    const resp = await fetch(url, {
      method:  event.httpMethod,
      headers: { 'Content-Type': 'application/json' },
      body:    event.body || undefined
    });

    const text = await resp.text();

    return {
      statusCode: resp.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: text
    };

  } catch (err) {
    return {
      statusCode: 502,
      headers: CORS,
      body: JSON.stringify({ error: 'Railway proxy error: ' + err.message })
    };
  }
};
