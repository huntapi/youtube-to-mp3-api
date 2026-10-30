// YouTube to MP3 API – Node.js example (Node 18+, ES module)
// Usage: HUNTAPI_API_KEY=your-key node audio_download.mjs

const headers = { "x-api-key": process.env.HUNTAPI_API_KEY, "Content-Type": "application/json" };

const params = new URLSearchParams({
  "query": "https://www.youtube.com/watch?v=Z5YP8kznWZs",
  "audio_quality": "320kbps",
  "audio_format": "mp3",
});
const response = await fetch(`https://api.huntapi.com/v1/audio/download?${params}`, { headers });
if (!response.ok) {
  console.error(`HTTP ${response.status}: ${await response.text()}`);
  process.exit(1);
}

const { job_id: jobId } = await response.json();
const done = new Set(["CompletedJob", "Error", "NotFound", "BadRequest"]);
let job;
do {
  await new Promise((r) => setTimeout(r, 5000));
  job = await (await fetch(`https://api.huntapi.com/v1/jobs/${jobId}`, { headers })).json();
  console.log(job.status, job.progress);
} while (!done.has(job.status));

console.log(JSON.stringify(job.result, null, 2));
