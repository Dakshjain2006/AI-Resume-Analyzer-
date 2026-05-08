/* ═══════════════════════════════════════════════
   ResumeIQ — Client-Side JavaScript
   ═══════════════════════════════════════════════ */

let currentMode = 'review';
let spinInt;
let uploadedText = '';

// ═══════════════════════════════════════
// File Upload & Drag-Drop
// ═══════════════════════════════════════
const uploadZone = document.getElementById('upload-zone');
const fileInput  = document.getElementById('file-input');

uploadZone.addEventListener('click', () => {
  if (!uploadZone.classList.contains('has-file')) fileInput.click();
});

uploadZone.addEventListener('dragover',  e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', () => { if (fileInput.files.length) handleFile(fileInput.files[0]); });

document.getElementById('file-remove').addEventListener('click', e => {
  e.stopPropagation();
  clearFile();
});

async function handleFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'pdf') {
    try {
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        text += tc.items.map(it => it.str).join(' ') + '\n';
      }
      uploadedText = text.trim();
    } catch { uploadedText = '[Error reading PDF]'; }
  } else {
    uploadedText = await file.text();
  }
  showFileInfo(file.name);
  document.getElementById('resume-input').value = uploadedText;
  updateCharCounter();
}

function showFileInfo(name) {
  document.getElementById('file-name').textContent = name;
  document.getElementById('file-info').style.display = 'flex';
  uploadZone.querySelector('.upload-icon').style.display = 'none';
  uploadZone.querySelector('.upload-title').style.display = 'none';
  uploadZone.querySelector('.upload-sub').style.display = 'none';
  uploadZone.classList.add('has-file');
}

function clearFile() {
  uploadedText = '';
  fileInput.value = '';
  document.getElementById('file-info').style.display = 'none';
  uploadZone.querySelector('.upload-icon').style.display = '';
  uploadZone.querySelector('.upload-title').style.display = '';
  uploadZone.querySelector('.upload-sub').style.display = '';
  uploadZone.classList.remove('has-file');
}

// ═══════════════════════════════════════
// JD Toggle
// ═══════════════════════════════════════
function toggleJD() {
  const wrap = document.getElementById('jd-wrap');
  const btn = document.getElementById('jd-toggle');
  const open = wrap.style.display === 'none';
  wrap.style.display = open ? 'block' : 'none';
  btn.classList.toggle('open', open);
}

// ═══════════════════════════════════════
// Char Counter
// ═══════════════════════════════════════
function updateCharCounter() {
  const len = document.getElementById('resume-input').value.length;
  document.getElementById('char-counter').textContent = len.toLocaleString() + ' chars';
}

// ═══════════════════════════════════════
// Mode Toggle
// ═══════════════════════════════════════
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('mode-' + mode).classList.add('active');
}

// ═══════════════════════════════════════
// Loading State
// ═══════════════════════════════════════
const spinMsgs = {
  review:  ['Reading your resume…','Evaluating sections…','Scoring content quality…','Preparing feedback…'],
  ats:     ['Scanning for ATS issues…','Checking keyword density…','Evaluating formatting…','Generating report…'],
  improve: ['Analyzing bullet points…','Finding weak phrases…','Crafting improvements…','Polishing suggestions…']
};

function startLoading() {
  document.getElementById('empty-state').style.display = 'none';
  document.getElementById('result-area').style.display = 'none';
  document.getElementById('error-banner').style.display = 'none';
  document.getElementById('loading-state').classList.add('show');
  let i = 0;
  const msgs = spinMsgs[currentMode] || spinMsgs.review;
  const el = document.getElementById('spin-txt');
  el.textContent = msgs[0];
  spinInt = setInterval(() => { i = (i+1) % msgs.length; el.textContent = msgs[i]; }, 1300);
  document.getElementById('out-dot').className = 'out-dot';
  document.getElementById('out-status').textContent = 'Analyzing…';
}

function stopLoading() {
  clearInterval(spinInt);
  document.getElementById('loading-state').classList.remove('show');
}

// ═══════════════════════════════════════
// Prompts
// ═══════════════════════════════════════
function buildPrompt(resume, jd) {
  const jdPart = jd ? `\n\nJob Description:\n\`\`\`\n${jd}\n\`\`\`\n` : '';

  const map = {
    review: `You are a senior career coach and resume reviewer. Analyze this resume thoroughly.${jdPart}

Resume:
\`\`\`
${resume}
\`\`\`

Return ONLY valid JSON (no markdown fences):
{"overall_score":85,"sections":{"formatting":{"score":80,"feedback":"..."},"experience":{"score":90,"feedback":"..."},"skills":{"score":75,"feedback":"..."},"education":{"score":85,"feedback":"..."},"impact":{"score":70,"feedback":"..."}},"strengths":["strength 1","strength 2","strength 3"],"weaknesses":["weakness 1","weakness 2","weakness 3"],"summary":"2-3 sentence overall assessment"}`,

    ats: `You are an ATS (Applicant Tracking System) expert. Analyze this resume for ATS compatibility.${jdPart}

Resume:
\`\`\`
${resume}
\`\`\`

Return ONLY valid JSON:
{"ats_score":75,"keyword_score":80,"formatting_score":70,"parsing_issues":["issue 1","issue 2"],"missing_keywords":["keyword 1","keyword 2","keyword 3"],"found_keywords":["keyword 1","keyword 2"],"formatting_tips":["tip 1","tip 2"],"ats_summary":"2-3 sentence ATS assessment"}`,

    improve: `You are an expert resume writer. Analyze this resume and provide specific improvements.${jdPart}

Resume:
\`\`\`
${resume}
\`\`\`

Return ONLY valid JSON:
{"weak_bullets":[{"original":"original bullet text","improved":"improved version","reason":"why this is better"}],"missing_sections":["section 1","section 2"],"power_words":["word1","word2","word3","word4","word5"],"action_items":["specific actionable item 1","item 2","item 3","item 4"],"overall_tip":"one key piece of advice"}`
  };

  return map[currentMode];
}

// ═══════════════════════════════════════
// Renderers
// ═══════════════════════════════════════
function scoreColor(s) {
  if (s >= 80) return '#34d399';
  if (s >= 60) return '#facc15';
  return '#f87171';
}

function renderScoreRing(score, label) {
  const r = 38, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = scoreColor(score);
  return `<div class="score-ring-wrap">
    <div class="score-ring">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r="${r}" class="score-ring-bg"/>
        <circle cx="45" cy="45" r="${r}" class="score-ring-fill" stroke="${color}" stroke-dasharray="${c}" stroke-dashoffset="${offset}"/>
      </svg>
      <div class="score-ring-text" style="color:${color}">${score}</div>
    </div>
    <div class="score-label"><strong>${label}</strong>out of 100</div>
  </div>`;
}

function renderMeter(score, label) {
  const color = scoreColor(score);
  return `<div style="margin-bottom:12px;">
    <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:2px;">
      <span style="color:var(--text-secondary)">${label}</span><span style="color:${color};font-weight:600">${score}/100</span>
    </div>
    <div class="meter"><div class="meter-fill" style="width:${score}%;background:${color}"></div></div>
  </div>`;
}

function renderReview(d) {
  const s = d.sections || {};
  return `
    <div class="result-block">${renderScoreRing(d.overall_score || 0, 'Overall Score')}
      <div class="block-body">${d.summary || ''}</div>
    </div>
    <div class="result-block">
      <div class="block-title"><span>📊</span> Section Scores</div>
      ${Object.entries(s).map(([k,v]) => renderMeter(v.score, k.charAt(0).toUpperCase()+k.slice(1)) + `<div style="font-size:0.82rem;color:var(--text-muted);margin:-6px 0 14px;">${v.feedback}</div>`).join('')}
    </div>
    <div class="result-block">
      <div class="block-title"><span>💪</span> Strengths</div>
      ${(d.strengths||[]).map(s => `<div class="step"><div class="step-num" style="background:rgba(52,211,153,0.12);color:var(--accent)">✓</div><div class="step-text">${s}</div></div>`).join('')}
    </div>
    <div class="result-block">
      <div class="block-title"><span>⚠️</span> Weaknesses</div>
      ${(d.weaknesses||[]).map(s => `<div class="step"><div class="step-num" style="background:rgba(248,113,113,0.12);color:var(--accent-red)">!</div><div class="step-text">${s}</div></div>`).join('')}
    </div>`;
}

function renderATS(d) {
  return `
    <div class="result-block">${renderScoreRing(d.ats_score || 0, 'ATS Score')}
      <div class="block-body">${d.ats_summary || ''}</div>
    </div>
    <div class="result-block">
      <div class="block-title"><span>📈</span> Score Breakdown</div>
      ${renderMeter(d.keyword_score || 0, 'Keyword Match')}
      ${renderMeter(d.formatting_score || 0, 'Formatting')}
    </div>
    <div class="result-block">
      <div class="block-title"><span>✅</span> Found Keywords</div>
      <div class="tag-row">${(d.found_keywords||[]).map(k => `<span class="tag">${k}</span>`).join('')}</div>
    </div>
    <div class="result-block">
      <div class="block-title"><span>❌</span> Missing Keywords</div>
      <div class="tag-row">${(d.missing_keywords||[]).map(k => `<span class="tag tag-red">${k}</span>`).join('')}</div>
    </div>
    <div class="result-block">
      <div class="block-title"><span>🔧</span> Parsing Issues</div>
      ${(d.parsing_issues||[]).map(s => `<div class="step"><div class="step-num" style="background:rgba(250,204,21,0.12);color:var(--accent-yellow)">▲</div><div class="step-text">${s}</div></div>`).join('')}
    </div>
    <div class="result-block">
      <div class="block-title"><span>💡</span> Formatting Tips</div>
      ${(d.formatting_tips||[]).map(s => `<div class="step"><div class="step-num" style="background:rgba(96,165,250,0.12);color:var(--accent-blue)">→</div><div class="step-text">${s}</div></div>`).join('')}
    </div>`;
}

function renderImprove(d) {
  return `
    <div class="result-block">
      <div class="block-title"><span>💡</span> Key Advice</div>
      <div class="block-body">${d.overall_tip || ''}</div>
    </div>
    <div class="result-block">
      <div class="block-title"><span>✏️</span> Bullet Point Improvements</div>
      ${(d.weak_bullets||[]).map(b => `
        <div style="margin-bottom:16px;padding:12px;background:rgba(255,255,255,0.02);border:1px solid var(--glass-border);border-radius:8px;">
          <div style="font-size:0.78rem;color:var(--accent-red);font-weight:600;margin-bottom:4px;">BEFORE</div>
          <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">${escHtml(b.original)}</div>
          <div style="font-size:0.78rem;color:var(--accent);font-weight:600;margin-bottom:4px;">AFTER</div>
          <div style="font-size:0.85rem;color:var(--text-primary);margin-bottom:6px;">${escHtml(b.improved)}</div>
          <div style="font-size:0.78rem;color:var(--accent-blue);font-style:italic;">↳ ${b.reason}</div>
        </div>`).join('')}
    </div>
    <div class="result-block">
      <div class="block-title"><span>⚡</span> Power Words to Use</div>
      <div class="tag-row">${(d.power_words||[]).map(w => `<span class="tag tag-blue">${w}</span>`).join('')}</div>
    </div>
    ${(d.missing_sections||[]).length ? `<div class="result-block">
      <div class="block-title"><span>📋</span> Missing Sections</div>
      ${d.missing_sections.map(s => `<div class="step"><div class="step-num" style="background:rgba(250,204,21,0.12);color:var(--accent-yellow)">+</div><div class="step-text">${s}</div></div>`).join('')}
    </div>` : ''}
    <div class="result-block">
      <div class="block-title"><span>🎯</span> Action Items</div>
      ${(d.action_items||[]).map((s,i) => `<div class="step"><div class="step-num">${i+1}</div><div class="step-text">${s}</div></div>`).join('')}
    </div>`;
}

function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ═══════════════════════════════════════
// Main API Call
// ═══════════════════════════════════════
async function analyzeResume() {
  const resume = document.getElementById('resume-input').value.trim();
  if (!resume) { shakeBtn(); return; }
  const jd = document.getElementById('jd-input').value.trim();
  document.getElementById('analyze-btn').disabled = true;
  startLoading();

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: buildPrompt(resume.slice(0, 4000), jd.slice(0, 1500)) }]
      })
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

    let raw = '';
    for (const b of (data.content || [])) if (b.type === 'text') raw += b.text;
    raw = raw.replace(/```json|```/gi, '').trim();
    const s = raw.indexOf('{'), e = raw.lastIndexOf('}');
    if (s < 0 || e < 0) throw new Error('Invalid JSON in response');
    const parsed = JSON.parse(raw.slice(s, e + 1));

    stopLoading();
    const ra = document.getElementById('result-area');
    ra.innerHTML = currentMode === 'review' ? renderReview(parsed)
                 : currentMode === 'ats'    ? renderATS(parsed)
                 :                            renderImprove(parsed);
    ra.style.display = 'block';
    document.getElementById('out-dot').className = 'out-dot active';
    document.getElementById('out-status').textContent = `${currentMode} complete`;
  } catch (err) {
    stopLoading();
    const eb = document.getElementById('error-banner');
    eb.textContent = '⚠ ' + err.message;
    eb.style.display = 'block';
    document.getElementById('out-status').textContent = 'Error';
  }
  document.getElementById('analyze-btn').disabled = false;
}

function shakeBtn() {
  const btn = document.getElementById('analyze-btn');
  btn.style.animation = 'shake 0.4s ease';
  setTimeout(() => btn.style.animation = '', 400);
}

// ═══════════════════════════════════════
// Keyboard Shortcut
// ═══════════════════════════════════════
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); analyzeResume(); }
});

// ═══════════════════════════════════════
// Init
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('resume-input').addEventListener('input', updateCharCounter);
  updateCharCounter();
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').style.background =
      window.scrollY > 20 ? 'rgba(8,15,10,0.92)' : 'rgba(8,15,10,0.7)';
  });
});
