import { useState, useRef, useEffect } from "react";

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

async function callGroq(sys, user) {
  const r = await fetch(GROQ_URL, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` }, body: JSON.stringify({ model: MODEL, messages: [{ role: "system", content: sys }, { role: "user", content: user }], temperature: 0.4, max_tokens: 1200 }) });
  const d = await r.json(); return d.choices?.[0]?.message?.content || "Error";
}

const SL = [
  { id: "applied", label: "Applied", icon: "📝", req: true, desc: "Application received" },
  { id: "resume", label: "Resume Review", icon: "🔍", req: false, desc: "HR screens your resume" },
  { id: "aptitude", label: "Aptitude Test", icon: "🧮", req: false, desc: "Logical & quantitative" },
  { id: "assignment", label: "Assignment", icon: "💻", req: false, desc: "Take-home project" },
  { id: "tech1", label: "Technical Round 1", icon: "⚙️", req: false, desc: "Coding / System design" },
  { id: "tech2", label: "Technical Round 2", icon: "⚙️", req: false, desc: "Advanced discussion" },
  { id: "managerial", label: "Managerial", icon: "👔", req: false, desc: "Hiring manager talk" },
  { id: "hr", label: "HR Round", icon: "🤝", req: false, desc: "Culture fit & salary" },
  { id: "f2f", label: "Face to Face", icon: "🧑‍💻", req: false, desc: "On-site / video" },
  { id: "case", label: "Case Study", icon: "📊", req: false, desc: "Business / technical case" },
  { id: "offer", label: "Offer", icon: "🎉", req: true, desc: "Job offer extended" },
];

const PRESETS = {
  startup: { label: "⚡ Startup", stages: ["applied", "resume", "tech1", "offer"] },
  standard: { label: "🏢 Standard Tech", stages: ["applied", "resume", "assignment", "tech1", "hr", "offer"] },
  enterprise: { label: "🏦 Enterprise", stages: ["applied", "resume", "aptitude", "assignment", "tech1", "tech2", "managerial", "hr", "offer"] },
  consulting: { label: "💼 Consulting", stages: ["applied", "resume", "aptitude", "case", "f2f", "hr", "offer"] },
};

const RECS = {
  1: { name: "Kavitha Rangan", role: "Senior Talent Partner", company: "NexaLogic Technologies", avatar: "KR", bg: "#0a66c2", rr: 72, pending: 4, total: 52, replied: 48, shift: "Mon–Fri · 9AM–6PM", lastActive: "Today, 2:14 PM", verified: true, filter: "AI + Manual" },
  2: { name: "Aryan Mehta", role: "Talent Acquisition Lead", company: "Vortex Systems", avatar: "AM", bg: "#7c3aed", rr: 45, pending: 14, total: 76, replied: 62, shift: "Mon–Fri · 10AM–7PM", lastActive: "3 days ago", verified: true, filter: "Manual" },
  3: { name: "Deepa Krishnan", role: "HR Manager", company: "Luminary Consulting", avatar: "DK", bg: "#059669", rr: 88, pending: 2, total: 41, replied: 39, shift: "Mon–Fri · 9AM–5:30PM", lastActive: "Today, 11:45 AM", verified: true, filter: "AI Screening" },
};

function activityStatus(rec) {
  const h = new Date().getHours(); const ok = h >= 9 && h < 18;
  const recent = rec.lastActive.includes("Today") || rec.lastActive.includes("min") || rec.lastActive.includes("hour");
  if (ok && recent) return { label: "Actively screening", color: "#16a34a", dot: "#16a34a", pulse: true };
  if (ok) return { label: "Within shift hours", color: "#d97706", dot: "#d97706", pulse: false };
  return { label: "Outside shift hours", color: "#9ca3af", dot: "#9ca3af", pulse: false };
}

const JOBS = [
  { id: 1, title: "AI Engineer", company: "NexaLogic Technologies", companyBio: "Series B · 200–500 employees · AI/ML Infrastructure", location: "Bengaluru", type: "Full-time", remote: "Hybrid", salary: "₹12–18 LPA", exp: "2–4 years", posted: "2 days ago", applicants: 142, logo: "NL", logoColor: "#0a66c2", tags: ["LangChain", "Python", "RAG", "MCP", "AWS"], ghostRisk: "Low", recId: 1, pipeline: ["applied", "resume", "assignment", "tech1", "hr", "offer"], candStage: 2, rejected: false, notes: { 2: "Build a RAG pipeline using FAISS + LangChain. Share your GitHub link within 3 days." }, jd: `NexaLogic Technologies is building the next generation of AI infrastructure for enterprises across Southeast Asia.\n\nKey Responsibilities:\n• Design and implement agentic AI systems using LangChain and LlamaIndex\n• Build production RAG pipelines with FAISS and vector databases\n• Integrate Anthropic Claude and OpenAI APIs into scalable backend services\n• Develop MCP-pattern tool-use infrastructure connecting LLMs to enterprise data\n• Deploy and monitor AI services on AWS (SageMaker, Lambda, EC2, CloudWatch)\n• Collaborate with product and data teams on AI feature delivery\n\nRequired Skills:\n• 2–4 years of AI/ML engineering experience in production\n• Strong Python proficiency — FastAPI, Django, or Flask\n• Hands-on LangChain, LlamaIndex, or similar agentic frameworks\n• End-to-end RAG pipeline development and evaluation\n• AWS experience — certification preferred\n• Strong SQL and PostgreSQL knowledge\n\nNice to Have:\n• AWS Certified ML Engineer\n• Experience with MCP server architecture\n• Voice AI or multimodal AI experience\n• Open-source AI project contributions` },
  { id: 2, title: "Senior GenAI Developer", company: "Luminary Consulting", companyBio: "Founded 2015 · 500–1000 employees · AI Strategy & Transformation", location: "Bengaluru", type: "Full-time", remote: "Hybrid", salary: "₹18–28 LPA", exp: "3–6 years", posted: "5 days ago", applicants: 312, logo: "LC", logoColor: "#059669", tags: ["LangGraph", "Claude API", "RAG", "Python", "TypeScript"], ghostRisk: "High", recId: 3, pipeline: ["applied", "resume", "assignment", "tech1", "f2f", "offer"], candStage: 1, rejected: false, notes: {}, jd: `Luminary Consulting builds AI transformation solutions for Fortune 500 clients globally.\n\nKey Responsibilities:\n• Build agentic systems that plan, call tools, and recover from failures in production\n• Design end-to-end RAG pipelines over real client data\n• Build evaluation harnesses — shipping AI without an eval loop is shipping a guess\n• Make architecture decisions: model choice, context strategy, memory, cost/latency trade-offs\n• Lead client technical discussions and workshops\n\nRequired:\n• 3–6 years of engineering experience\n• At least one production AI system shipped\n• LangChain, LangGraph, or equivalent agent frameworks\n• Strong Python or TypeScript\n• Cloud deployment (AWS, GCP, Vercel)` },
  { id: 3, title: "Full Stack Developer", company: "Vortex Systems", companyBio: "Pre-Series A · 50–200 employees · B2B SaaS Platform", location: "Bengaluru", type: "Full-time", remote: "Onsite", salary: "₹8–14 LPA", exp: "1–3 years", posted: "1 day ago", applicants: 89, logo: "VS", logoColor: "#7c3aed", tags: ["React", "Node.js", "MongoDB", "TypeScript", "PostgreSQL"], ghostRisk: "Medium", recId: 2, pipeline: ["applied", "resume", "aptitude", "tech1", "tech2", "hr", "offer"], candStage: 0, rejected: false, notes: {}, jd: `Vortex Systems is building the next generation hiring intelligence platform used by 10M+ professionals.\n\nKey Responsibilities:\n• Develop and maintain React.js frontend applications with high performance\n• Build scalable Node.js/Express backend services and REST APIs\n• Design and optimise PostgreSQL and MongoDB database schemas\n• Implement CI/CD pipelines and ensure production stability\n\nRequired Skills:\n• React.js and Node.js/Express proficiency\n• TypeScript and JavaScript (ES6+)\n• PostgreSQL, MongoDB, and Redis experience\n• REST API design and testing\n• Docker and basic cloud deployment` },
  { id: 4, title: "Python Developer", company: "Arcana Data", companyBio: "Series A · 100–300 employees · Data Security & AI", location: "Bengaluru", type: "Full-time", remote: "Remote", salary: "₹6–10 LPA", exp: "2–3 years", posted: "3 days ago", applicants: 67, logo: "AD", logoColor: "#dc2626", tags: ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis"], ghostRisk: "Low", recId: 1, pipeline: ["applied", "resume", "tech1", "hr", "offer"], candStage: 0, rejected: false, notes: {}, jd: `Arcana Data builds enterprise data security infrastructure trusted by Fortune 100 companies.\n\nKey Responsibilities:\n• Design and maintain scalable Python applications and microservices\n• Build RESTful APIs using FastAPI with high performance standards\n• Work with PostgreSQL and MongoDB for data-intensive applications\n• Implement security best practices across all services\n\nRequired Skills:\n• 2+ years of professional Python experience\n• FastAPI, Flask, or Django in production\n• PostgreSQL and MongoDB\n• Docker containerisation and CI/CD\n• Git and collaborative development` },
  { id: 5, title: "ML Engineer", company: "VisionPulse AI", companyBio: "Seed · 20–50 employees · Computer Vision & Safety", location: "Bengaluru", type: "Full-time", remote: "Hybrid", salary: "₹10–16 LPA", exp: "0–2 years", posted: "1 week ago", applicants: 201, logo: "VP", logoColor: "#0891b2", tags: ["PyTorch", "OpenCV", "Computer Vision", "Claude API", "AWS"], ghostRisk: "Medium", recId: 3, pipeline: ["applied", "resume", "assignment", "tech1", "offer"], candStage: 0, rejected: false, notes: {}, jd: `VisionPulse AI is the leader in AI-driven safety and telematics for fleet management.\n\nKey Responsibilities:\n• Develop ML/DL models end-to-end — problem formulation to deployment\n• Implement and debug DL models using PyTorch and TensorFlow\n• Optimise models for cloud and edge deployment with ONNX/TensorRT\n• Use GenAI tools and LLM APIs (Claude, OpenAI) for workflow automation\n• Process large-scale field data for continuous model improvement\n\nRequired:\n• 0–2 years ML/DL experience\n• PyTorch hands-on experience\n• Strong Python and computer vision basics\n• AWS SageMaker or equivalent cloud ML\n• Daily use of Claude Code or GitHub Copilot preferred` },
];

const APPLIED_IDS = new Set([1, 2]);
const SAVED_IDS = new Set([3]);

const NOTIFS_DATA = [
  { id: 1, icon: "📋", text: "NexaLogic Technologies moved your application to Assignment stage", time: "2 hours ago", read: false },
  { id: 2, icon: "💬", text: "Kavitha Rangan sent you a message about the AI Engineer role", time: "Yesterday", read: false },
  { id: 3, icon: "🔍", text: "Luminary Consulting viewed your profile for Senior GenAI Developer", time: "2 days ago", read: true },
  { id: 4, icon: "⚠️", text: "TruthHire Alert: Vortex Systems has 45% response rate — 14 pending", time: "3 days ago", read: true },
  { id: 5, icon: "💡", text: "New match: ML Engineer at VisionPulse AI — 84% semantic match", time: "4 days ago", read: true },
];

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return <div style={{ position: "fixed", bottom: 24, right: 24, background: "#0f172a", color: "#fff", padding: "14px 20px", borderRadius: 12, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 28px rgba(0,0,0,.2)", zIndex: 1000, display: "flex", alignItems: "center", gap: 10, animation: "slideIn .3s ease" }}>✓ {msg}</div>;
}

function ProfilePage() {
  const skills = ["Python · Expert", "LangChain · Advanced", "AWS · Certified", "FastAPI · Advanced", "RAG/FAISS · Advanced", "React · Intermediate", "Docker · Intermediate", "Claude API · Advanced"];
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 }}>
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ height: 80, background: "linear-gradient(135deg,#0a66c2,#7c3aed)" }} />
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#0a66c2,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 28, color: "#fff", margin: "-40px auto 0", border: "4px solid #fff", boxShadow: "0 3px 12px rgba(0,0,0,.15)" }}>NB</div>
            <div style={{ padding: "12px 20px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>Nikhil BT</div>
              <div style={{ fontSize: 13, color: "#374151", marginBottom: 2 }}>AI/ML Engineer</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>📍 Bengaluru, India</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 600, color: "#15803d" }}>✅ AWS Certified ML Engineer</div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}><span>Profile strength</span><span style={{ color: "#0a66c2", fontWeight: 700 }}>78%</span></div>
                <div style={{ height: 7, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}><div style={{ height: 7, borderRadius: 4, background: "linear-gradient(90deg,#0a66c2,#2563eb)", width: "78%" }} /></div>
              </div>
            </div>
            <div style={{ padding: "16px 20px", borderTop: "1px solid #f0f0f0" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Top Skills</div>
              {skills.map(s => <span key={s} style={{ display: "inline-flex", alignItems: "center", background: "#eff6ff", color: "#0a66c2", fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 9, margin: "3px" }}>{s.split(" · ")[0]}<span style={{ fontSize: 10, color: "#9ca3af", marginLeft: 4 }}>· {s.split(" · ")[1]}</span></span>)}
            </div>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Quick Stats</div>
            {[["📋 Applications", "2 active"], ["👁️ Profile views", "142 this month"], ["⭐ Saved jobs", "1 job"], ["🎯 Avg match score", "82% semantic"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}><span style={{ color: "#374151" }}>{k}</span><strong style={{ color: "#0a66c2" }}>{v}</strong></div>
            ))}
          </div>
        </div>
        <div>
          {[{title: "About", content: <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75 }}>AWS Certified Machine Learning Engineer with 2+ years of experience building production AI systems. Specialised in LangChain RAG pipelines, agentic AI, Claude API integrations, and AWS SageMaker deployments.<div style={{ display: "flex", gap: 12, marginTop: 12 }}>{[["🌐 Portfolio", "https://nikhil-portfolio-theta-steel.vercel.app"], ["⚙️ GitHub", "https://github.com/nikhilbt1997"], ["💼 LinkedIn", "https://linkedin.com/in/nikhil-bt"]].map(([l, h]) => <a key={l} href={h} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#0a66c2", fontWeight: 600 }}>{l}</a>)}</div></p>}, {title: "Experience", content: <div style={{ display: "flex", gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 10, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>💻</div><div><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Software Engineer — Freelance</div><div style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>DCSIPL, Chennai</div><div style={{ fontSize: 11, color: "#9ca3af" }}>Nov 2023 – Nov 2025 · 2 years</div><div style={{ fontSize: 12, color: "#64748b", marginTop: 5, lineHeight: 1.65 }}>Built AI systems including LangChain RAG pipelines, FAISS vector search, Claude API integrations, and AWS SageMaker deployments. Delivered 10+ production AI projects.</div></div></div>}, {title: "Education", content: <div style={{ display: "flex", gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 10, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎓</div><div><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Bachelor of Computer Applications (BCA)</div><div style={{ fontSize: 12, color: "#374151" }}>North East Christian University</div><div style={{ fontSize: 11, color: "#9ca3af" }}>2018 – 2021</div></div></div>}, {title: "Certifications", content: <div style={{ display: "flex", gap: 12 }}><div style={{ fontSize: 24 }}>🏅</div><div><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>AWS Certified Machine Learning Engineer — Associate</div><div style={{ fontSize: 12, color: "#9ca3af" }}>Amazon Web Services · 2026</div></div></div>}].map(({title, content}) => (
            <div key={title} className="card" style={{ padding: 22, marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>{title}</div>
              {content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',system-ui,sans-serif;background:#f4f2ee;color:#1c1c1c;-webkit-font-smoothing:antialiased}
a{text-decoration:none}
::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#f0f0f0}::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}

/* ── NAV ── */
.nav{background:#fff;border-bottom:1px solid #e2e8f0;height:64px;padding:0 32px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200;box-shadow:0 1px 8px rgba(0,0,0,.07)}
.nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;flex-shrink:0}
.logo-mark{width:38px;height:38px;background:linear-gradient(135deg,#0a66c2,#2563eb);border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;color:#fff;box-shadow:0 2px 8px rgba(10,102,194,.3)}
.logo-name{font-size:21px;font-weight:800;background:linear-gradient(135deg,#0a66c2,#2563eb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-.4px}
.nav-center{display:flex;align-items:center;gap:2px;flex:1;justify-content:center}
.nav-search-bar{display:flex;align-items:center;gap:9px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:28px;padding:8px 18px;width:280px;transition:all .25s;margin-right:16px}
.nav-search-bar:focus-within{background:#fff;border-color:#0a66c2;box-shadow:0 0 0 3px rgba(10,102,194,.08);width:340px}
.nav-search-bar input{border:none;background:none;font-size:13.5px;font-family:inherit;outline:none;width:100%;color:#1e293b}
.nav-search-bar input::placeholder{color:#94a3b8}
.nav-tab{font-size:13px;font-weight:500;color:#64748b;border:none;background:none;cursor:pointer;padding:9px 14px;border-radius:9px;font-family:inherit;transition:all .15s;display:flex;align-items:center;gap:6px;white-space:nowrap;border-bottom:2px solid transparent}
.nav-tab:hover{color:#0a66c2;background:#eff6ff}
.nav-tab.on{color:#0a66c2;font-weight:600;border-bottom-color:#0a66c2;background:#f0f7ff}
.nav-tab-badge{background:#0a66c2;color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;margin-left:2px}
.nav-right{display:flex;align-items:center;gap:10px;flex-shrink:0}
.nav-notif-btn{position:relative;width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:50%;cursor:pointer;font-size:18px;background:none;border:none;transition:background .15s;color:#475569}
.nav-notif-btn:hover{background:#f1f5f9}
.nav-notif-badge{position:absolute;top:3px;right:3px;width:18px;height:18px;background:#ef4444;border-radius:50%;font-size:10px;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;border:2px solid #fff}
.nav-user{display:flex;align-items:center;gap:8px;padding:5px 14px 5px 6px;border:1.5px solid #e2e8f0;border-radius:28px;cursor:pointer;background:#fff;transition:all .2s}
.nav-user:hover{border-color:#0a66c2;background:#f0f7ff}
.nav-user-av{width:30px;height:30px;background:linear-gradient(135deg,#0a66c2,#2563eb);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:11px}
.nav-user-name{font-size:13px;font-weight:600;color:#0f172a}
.nb{padding:9px 20px;border-radius:22px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s;border:none;white-space:nowrap}
.nb.p{background:linear-gradient(135deg,#0a66c2,#2563eb);color:#fff;box-shadow:0 2px 10px rgba(10,102,194,.25)}
.nb.p:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(10,102,194,.35)}
.nb.s{background:#fff;color:#0a66c2;border:1.5px solid #0a66c2}
.nb.s:hover{background:#eff6ff}
/* keep old classes working for backward compat */
.logo{display:flex;align-items:center;gap:9px;cursor:pointer}
.nav-search-wrap{display:flex;align-items:center;gap:9px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:28px;padding:8px 18px;width:300px;transition:all .25s}
.nav-search-wrap:focus-within{background:#fff;border-color:#0a66c2;box-shadow:0 0 0 3px rgba(10,102,194,.08);width:360px}
.nav-search-wrap input{border:none;background:none;font-size:13.5px;font-family:inherit;outline:none;width:100%;color:#1e293b}
.nl{font-size:13px;font-weight:500;color:#64748b;border:none;background:none;cursor:pointer;padding:9px 14px;border-radius:9px;font-family:inherit;transition:all .15s;display:flex;align-items:center;gap:6px;white-space:nowrap}
.nl:hover,.nl.on{color:#0a66c2;background:#f0f7ff;font-weight:600}

/* ── LAYOUT ── */
.wrap{max-width:1200px;margin:0 auto;padding:24px 28px}
.back{display:inline-flex;align-items:center;gap:7px;font-size:14px;color:#0a66c2;cursor:pointer;background:none;border:none;font-family:inherit;font-weight:500;padding:6px 0;margin-bottom:18px;transition:gap .15s}
.back:hover{gap:10px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:none;border-radius:24px;font-family:inherit;font-weight:600;cursor:pointer;transition:all .2s}
.btn.pri{background:linear-gradient(135deg,#0a66c2,#2563eb);color:#fff;box-shadow:0 3px 12px rgba(10,102,194,.25);padding:10px 24px;font-size:14px}
.btn.pri:hover{transform:translateY(-1px);box-shadow:0 5px 18px rgba(10,102,194,.4)}
.btn.pri:disabled{opacity:.55;cursor:not-allowed;transform:none}
.btn.sec{background:#fff;color:#0a66c2;border:1.5px solid #0a66c2;padding:10px 22px;font-size:14px}
.btn.sec:hover{background:#eff6ff}
.btn.sm.pri{padding:8px 18px;font-size:13px}
.btn.sm.sec{padding:8px 18px;font-size:13px}
.btn.sm.green{background:linear-gradient(135deg,#059669,#047857);color:#fff;box-shadow:0 2px 8px rgba(5,150,105,.25);padding:8px 16px;font-size:13px;border-radius:20px}
.btn.sm.red{background:#fff;color:#dc2626;border:1.5px solid #dc2626;padding:8px 16px;font-size:13px;border-radius:20px}
.btn.sm.ghost{background:#f8f9fa;color:#444;border:1.5px solid #e0e0e0;padding:8px 16px;font-size:13px;border-radius:20px}
.card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.04)}
.pill{display:inline-flex;align-items:center;gap:5px;border-radius:100px;font-size:11px;font-weight:600;padding:4px 11px}
.pill.green{background:#dcfce7;color:#15803d}
.pill.amber{background:#fef9c3;color:#a16207}
.pill.red{background:#fee2e2;color:#b91c1c}
.pill.blue{background:#dbeafe;color:#1d4ed8}
.pill.gray{background:#f3f4f6;color:#6b7280}
.pill.purple{background:#ede9fe;color:#6d28d9}
.tag{background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:500;padding:4px 12px;border-radius:10px;display:inline-block}
.divider{border:none;border-top:1px solid #f0f0f0;margin:16px 0}

/* ── LANDING HERO ── */
.hero{background:linear-gradient(135deg,#eff6ff 0%,#f5f3ff 50%,#fdf2f8 100%);border-bottom:1px solid #e8e8e8;padding:72px 28px 64px}
.hero-inner{max-width:680px;margin:0 auto;text-align:center}
.hero-chip{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1.5px solid #bfdbfe;border-radius:100px;padding:7px 18px;font-size:12px;font-weight:600;color:#1d4ed8;margin-bottom:28px;box-shadow:0 2px 8px rgba(37,99,235,.08)}
.hero h1{font-size:48px;font-weight:800;line-height:1.1;letter-spacing:-1px;margin-bottom:18px;color:#0f172a}
.hero h1 span{background:linear-gradient(135deg,#0a66c2,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:17px;color:#64748b;line-height:1.75;margin-bottom:36px;max-width:540px;margin-left:auto;margin-right:auto}
.hero-btns{display:flex;justify-content:center;gap:14px;margin-bottom:52px}
.hero-stats{display:flex;justify-content:center;gap:48px}
.hero-stat-num{font-size:32px;font-weight:800;color:#0a66c2;display:block}
.hero-stat-label{font-size:13px;color:#94a3b8;margin-top:2px}

/* ── FEATURES ── */
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:48px}
.feat-card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:26px;cursor:pointer;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,.03)}
.feat-card:hover{border-color:#0a66c2;box-shadow:0 8px 28px rgba(10,102,194,.12);transform:translateY(-3px)}
.feat-card-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px}
.feat-card h3{font-size:15px;font-weight:700;margin-bottom:7px;color:#0f172a}
.feat-card p{font-size:13px;color:#64748b;line-height:1.65}
.feat-badge{display:inline-block;margin-top:12px;font-size:10px;font-weight:700;letter-spacing:.04em;color:#0a66c2;text-transform:uppercase}

/* ── JOBS PAGE ── */
.jobs-layout{display:grid;grid-template-columns:260px 1fr;gap:20px;align-items:start}
.filter-sidebar{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:20px;position:sticky;top:80px;box-shadow:0 2px 8px rgba(0,0,0,.03)}
.filter-sidebar h3{font-size:14px;font-weight:700;margin-bottom:14px;color:#0f172a}
.filter-group{margin-bottom:20px}
.filter-group-title{font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.filter-opt{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;cursor:pointer;transition:background .15s;font-size:13px;color:#374151;font-weight:500;border:none;background:none;width:100%;text-align:left;font-family:inherit}
.filter-opt:hover{background:#f8f9fa}
.filter-opt.active{background:#eff6ff;color:#0a66c2}
.filter-opt input[type=checkbox]{accent-color:#0a66c2;width:15px;height:15px}
.clear-filters{font-size:12px;color:#0a66c2;cursor:pointer;background:none;border:none;font-family:inherit;font-weight:600;padding:0;margin-top:4px}
.jobs-main{}
.jobs-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.jobs-header h2{font-size:20px;font-weight:700;color:#0f172a}
.jobs-header-right{display:flex;align-items:center;gap:10px}
.sort-select{border:1.5px solid #e0e0e0;border-radius:8px;padding:7px 12px;font-size:13px;font-family:inherit;cursor:pointer;background:#fff;color:#374151;outline:none}
.jobs-list{display:flex;flex-direction:column;gap:10px}
.job-card{background:#fff;border:1.5px solid #e8e8e8;border-radius:14px;padding:20px 22px;cursor:pointer;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,.03)}
.job-card:hover{border-color:#0a66c2;box-shadow:0 8px 28px rgba(10,102,194,.1);transform:translateY(-2px)}
.job-card.applied-card{border-left:4px solid #0a66c2}
.jc-top{display:flex;gap:14px;align-items:flex-start}
.jc-logo{width:52px;height:52px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:#fff;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,.12)}
.jc-body{flex:1}
.jc-title{font-size:16px;font-weight:700;color:#0f172a;margin-bottom:2px}
.jc-company{font-size:13px;font-weight:500;color:#374151;margin-bottom:6px}
.jc-meta{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:#6b7280;margin-bottom:10px;align-items:center}
.jc-pipeline{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;align-items:center}
.jc-pipeline-chip{background:#f1f5f9;color:#475569;font-size:10px;padding:3px 8px;border-radius:8px;font-weight:500;display:flex;align-items:center;gap:3px}
.jc-tags{display:flex;gap:6px;flex-wrap:wrap}
.jc-tag{background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:500;padding:3px 10px;border-radius:9px}
.jc-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0;min-width:130px}
.jc-salary{font-size:14px;font-weight:700;color:#0f172a}
.jc-exp{font-size:12px;color:#6b7280}
.applied-badge{background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:600;padding:4px 10px;border-radius:8px}
.activity-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:4px}
.pulse{animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}

/* ── JOB DETAIL ── */
.jd-layout{display:grid;grid-template-columns:1fr 420px;gap:18px;align-items:start}
.jd-card{}
.jd-header{padding:24px;border-bottom:1px solid #f0f0f0}
.jd-logo-row{display:flex;gap:14px;align-items:flex-start;margin-bottom:18px}
.jd-logo{width:60px;height:60px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;color:#fff;box-shadow:0 3px 12px rgba(0,0,0,.15);flex-shrink:0}
.jd-logo-text{}
.jd-title{font-size:24px;font-weight:800;color:#0f172a;margin-bottom:3px;letter-spacing:-.3px}
.jd-company{font-size:14px;font-weight:600;color:#374151;margin-bottom:2px}
.jd-company-bio{font-size:12px;color:#9ca3af}
.jd-meta{display:flex;gap:16px;flex-wrap:wrap;margin:14px 0;font-size:13px;color:#374151}
.jd-meta span{display:flex;align-items:center;gap:5px}
.jd-tags{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:16px}
.jd-actions{display:flex;gap:10px;align-items:center}
.jd-applied-state{display:flex;align-items:center;gap:8px;background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:10px;padding:10px 16px;font-size:13px;font-weight:600;color:#1d4ed8}
.jd-body{padding:24px}
.jd-section-title{font-size:14px;font-weight:700;color:#0f172a;margin-bottom:10px}
.jd-pipeline-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:22px;align-items:center}
.pip-chip{background:#eff6ff;border:1px solid #bfdbfe;border-radius:20px;padding:5px 12px;font-size:12px;font-weight:600;color:#1d4ed8;display:flex;align-items:center;gap:5px}
.pip-arrow{color:#bfdbfe;font-size:14px}
.jd-text{font-size:13.5px;color:#374151;line-height:1.85;white-space:pre-wrap}
.jd-similar{padding:20px;border-top:1px solid #f0f0f0}
.jd-similar-title{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:12px}
.similar-item{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;cursor:pointer;transition:background .15s}
.similar-item:hover{background:#f8f9fa}
.similar-logo{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#fff;flex-shrink:0}
.similar-info{}
.similar-title{font-size:13px;font-weight:600;color:#0f172a}
.similar-company{font-size:12px;color:#6b7280}

/* ── MQ STRIP ── */
.mq-strip{background:linear-gradient(135deg,#eff6ff,#f5f3ff);border:1px solid #bfdbfe;border-radius:14px;padding:18px 22px}
.mq-strip-h{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:4px}
.mq-strip-sub{font-size:12px;color:#64748b;margin-bottom:14px}
.mq-btns{display:flex;gap:8px;flex-wrap:wrap}
.mq-btn{background:#fff;border:1.5px solid #bfdbfe;border-radius:20px;padding:8px 15px;font-size:13px;font-weight:600;cursor:pointer;color:#0a66c2;font-family:inherit;display:flex;align-items:center;gap:6px;transition:all .15s;box-shadow:0 1px 4px rgba(0,0,0,.04)}
.mq-btn:hover{background:#eff6ff;border-color:#0a66c2;box-shadow:0 3px 10px rgba(10,102,194,.12)}

/* ── RECRUITER CARD ── */
.rc-wrap{}
.rc-top{display:flex;gap:13px;align-items:flex-start}
.rc-av{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;flex-shrink:0}
.rc-info{}
.rc-name-row{display:flex;align-items:center;gap:7px;margin-bottom:3px}
.rc-name{font-size:15px;font-weight:700;color:#0f172a}
.rc-v{background:#0a66c2;color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px}
.rc-role{font-size:12px;color:#374151;font-weight:500;margin-bottom:2px}
.rc-sub{font-size:11px;color:#9ca3af;line-height:1.5;margin-bottom:12px}
.rc-msg-btn{background:#fff;border:1.5px solid #0a66c2;color:#0a66c2;border-radius:20px;padding:8px 20px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
.rc-msg-btn:hover{background:#eff6ff}
.rc-stats-row{display:flex;gap:12px;margin-top:14px;padding-top:14px;border-top:1px solid #f0f0f0}
.rc-stat{flex:1;text-align:center;background:#f8f9fa;border-radius:10px;padding:10px}
.rc-stat-num{font-size:18px;font-weight:800;color:#0a66c2}
.rc-stat-label{font-size:10px;color:#9ca3af;margin-top:2px}
.rc-activity-row{display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid #f0f0f0}
.rc-activity-label{font-size:12px;color:#6b7280;font-weight:500}
.rc-rr-wrap{margin-top:12px}
.rc-rr-header{display:flex;justify-content:space-between;margin-bottom:5px}
.rc-rr-label{font-size:11px;color:#6b7280;font-weight:500}
.rc-rr-pct{font-size:12px;font-weight:700}
.rc-rr-track{height:7px;background:#f0f0f0;border-radius:4px;overflow:hidden}
.rc-rr-fill{height:7px;border-radius:4px}
.rc-rr-green{background:linear-gradient(90deg,#22c55e,#16a34a)}
.rc-rr-amber{background:linear-gradient(90deg,#f59e0b,#d97706)}
.rc-rr-red{background:linear-gradient(90deg,#ef4444,#dc2626)}
.rc-pending-note{margin-top:10px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px 13px;font-size:12px;color:#78350f;line-height:1.6}

/* ── TRACKER ── */
.tracker-tagline{font-size:12px;font-weight:600;color:#0a66c2;margin-bottom:14px;display:flex;align-items:center;gap:6px}
.tr-scroll{overflow-x:auto;padding-bottom:6px}
.tr-inner{position:relative;min-width:max-content}
.tr-line{position:absolute;top:24px;left:30px;right:30px;height:3px;background:#e5e7eb;z-index:0;border-radius:2px}
.tr-fill{position:absolute;top:24px;left:30px;height:3px;background:linear-gradient(90deg,#0a66c2,#2563eb);z-index:1;transition:width .6s cubic-bezier(.4,0,.2,1);border-radius:2px}
.tr-steps{display:flex;z-index:2;position:relative}
.tr-step{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:86px;padding:0 4px}
.tr-dot{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:2.5px solid #e5e7eb;background:#fff;transition:all .3s;position:relative;z-index:2;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.tr-dot.done{background:linear-gradient(135deg,#0a66c2,#2563eb);border-color:transparent;font-size:16px;box-shadow:0 3px 12px rgba(10,102,194,.3)}
.tr-dot.current{background:#fff;border-color:#0a66c2;box-shadow:0 0 0 5px rgba(10,102,194,.1),0 3px 12px rgba(10,102,194,.15)}
.tr-dot.pending{opacity:.45}
.tr-dot.rej{background:linear-gradient(135deg,#ef4444,#dc2626);border-color:transparent;font-size:16px}
.tr-label{font-size:10px;font-weight:600;text-align:center;color:#9ca3af;max-width:78px;line-height:1.3}
.tr-label.done{color:#1d4ed8}
.tr-label.current{color:#0a66c2;font-weight:700}
.tr-label.rej{color:#b91c1c;font-weight:700}
.tr-sub{font-size:9px;color:#d1d5db;text-align:center;max-width:78px}
.tr-sub.done{color:#93c5fd}
.tr-sub.current{color:#60a5fa}
.stage-note{margin-top:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:12px 14px;font-size:12px;color:#78350f;line-height:1.6}
.stage-note strong{color:#92400e}
.tracker-footer{display:flex;gap:20px;margin-top:12px;padding-top:10px;border-top:1px solid #f0f0f0;font-size:11px;color:#9ca3af}
.tracker-footer strong{color:#0a66c2}

/* ── TRUTH PANEL ── */
.truth-panel{background:#fff;border:1.5px solid #bfdbfe;border-radius:18px;overflow:hidden;position:sticky;top:76px;box-shadow:0 8px 40px rgba(10,102,194,.12)}
.tp-hdr{background:linear-gradient(135deg,#0a66c2 0%,#1d4ed8 55%,#2563eb 100%);padding:20px 20px 0}
.tp-hdr-row{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.tp-icon{width:42px;height:42px;background:rgba(255,255,255,.18);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;border:1px solid rgba(255,255,255,.2)}
.tp-hdr-text{}
.tp-title{font-size:17px;font-weight:800;color:#fff;letter-spacing:-.2px}
.tp-subtitle{font-size:12px;color:#93c5fd;margin-top:1px}
.tp-tabs{display:flex;background:rgba(0,0,0,.2);border-radius:10px 10px 0 0;overflow:hidden;margin:0 -0px}
.tp-tab{flex:1;padding:13px 6px;text-align:center;font-size:12px;font-weight:600;cursor:pointer;color:rgba(255,255,255,.6);border:none;background:transparent;font-family:inherit;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:5px;border-bottom:3px solid transparent}
.tp-tab:hover{color:rgba(255,255,255,.9);background:rgba(255,255,255,.07)}
.tp-tab.active{color:#fff;background:rgba(255,255,255,.15);border-bottom-color:#fff}
.tp-body{padding:18px}

/* ── TRUTH FORM ── */
.tf-note{background:#fffbeb;border:1px solid #fde68a;border-radius:9px;padding:11px 13px;font-size:12px;color:#78350f;line-height:1.6;margin-bottom:14px}
.tf-note strong{color:#b45309}
.tf-label{font-size:11px;font-weight:700;color:#374151;margin-bottom:5px;display:block;letter-spacing:.02em;text-transform:uppercase}
.tf-input{width:100%;border:1.5px solid #e5e7eb;border-radius:10px;padding:10px 13px;font-size:13px;font-family:inherit;color:#0f172a;background:#fafafa;margin-bottom:12px;transition:all .2s;outline:none}
.tf-input:focus{border-color:#0a66c2;background:#fff;box-shadow:0 0 0 3px rgba(10,102,194,.08)}
textarea.tf-input{resize:vertical}
.tf-btn{width:100%;background:linear-gradient(135deg,#0a66c2,#2563eb);color:#fff;border:none;border-radius:10px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px;transition:all .2s;box-shadow:0 4px 14px rgba(10,102,194,.3);letter-spacing:.01em}
.tf-btn:hover{box-shadow:0 6px 20px rgba(10,102,194,.4);transform:translateY(-1px)}
.tf-btn:disabled{opacity:.55;cursor:not-allowed;transform:none}
.spinner{width:16px;height:16px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.upload-zone{border:2px dashed #bfdbfe;border-radius:12px;padding:22px 16px;text-align:center;cursor:pointer;background:#f8fbff;transition:all .2s;margin-bottom:12px;position:relative}
.upload-zone:hover{border-color:#0a66c2;background:#eff6ff}
.upload-zone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.upload-icon-wrap{width:44px;height:44px;background:#dbeafe;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;margin:0 auto 10px}
.upload-main{font-size:13px;font-weight:600;color:#0a66c2;margin-bottom:3px}
.upload-sub{font-size:11px;color:#9ca3af}
.file-ok{display:flex;align-items:center;gap:9px;padding:10px 14px;background:#f0fdf4;border:1.5px solid #86efac;border-radius:10px;margin-bottom:12px;font-size:13px;color:#15803d;font-weight:600}
.or-divider{display:flex;align-items:center;gap:10px;margin:10px 0;font-size:11px;color:#9ca3af;font-weight:500}
.or-divider::before,.or-divider::after{content:'';flex:1;height:1px;background:#e5e7eb}

/* ── RESULTS ── */
.r-card{border-radius:10px;padding:13px 14px;margin-bottom:10px;border:1px solid}
.r-card.info{background:#f0f7ff;border-color:#bfdbfe}
.r-card.info h4{color:#1d4ed8}
.r-card.warn{background:#fffbeb;border-color:#fde68a}
.r-card.warn h4{color:#b45309}
.r-card.danger{background:#fff1f2;border-color:#fecdd3}
.r-card.danger h4{color:#be123c}
.r-card.success{background:#f0fdf4;border-color:#bbf7d0}
.r-card.success h4{color:#15803d}
.r-card h4{font-size:12px;font-weight:700;margin-bottom:6px}
.r-card p{font-size:12.5px;color:#374151;line-height:1.65}
.r-list{list-style:none;display:flex;flex-direction:column;gap:5px;margin-bottom:10px}
.r-list li{font-size:12.5px;color:#374151;padding:8px 12px;background:#f8f9fa;border-radius:8px;line-height:1.55;border:1px solid #f0f0f0}
.r-section{margin-bottom:12px}
.r-section h4{font-size:12px;font-weight:700;margin-bottom:7px}
.r-section.green h4{color:#15803d}
.r-section.red h4{color:#be123c}
.score-center{text-align:center;padding:16px 0 10px}
.score-ring{width:84px;height:84px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 10px;box-shadow:0 4px 16px rgba(0,0,0,.1)}
.score-ring .n{font-size:27px;font-weight:800;line-height:1}
.score-ring .p{font-size:11px;font-weight:500}
.sc-green{background:#f0fdf4;color:#15803d;border:2.5px solid #22c55e}
.sc-amber{background:#fffbeb;color:#d97706;border:2.5px solid #f59e0b}
.sc-red{background:#fff1f2;color:#be123c;border:2.5px solid #ef4444}
.verdict{font-size:13px;color:#374151;text-align:center;line-height:1.65;margin-bottom:14px;padding:0 4px}
.ghost-center{text-align:center;padding:16px 0 10px}
.ghost-pct{font-size:54px;font-weight:800;line-height:1;letter-spacing:-2px}
.ghost-badge{display:inline-block;padding:5px 18px;border-radius:20px;font-size:12px;font-weight:700;margin-top:8px;margin-bottom:14px}
.ghost-low{background:#dcfce7;color:#15803d}
.ghost-med{background:#fef9c3;color:#a16207}
.ghost-high{background:#fee2e2;color:#b91c1c}
.signal-list{list-style:none;display:flex;flex-direction:column;gap:5px;margin-bottom:12px}
.signal-list li{font-size:12.5px;color:#374151;padding:8px 12px;background:#f8f9fa;border-radius:8px;border-left:3px solid #0a66c2;line-height:1.55}
blockquote{background:#f0fdf4;border-left:3px solid #22c55e;border-radius:0 8px 8px 0;padding:10px 14px;font-size:12.5px;color:#0f172a;line-height:1.65;font-style:italic;margin-top:10px}
.err{background:#fff1f2;border:1px solid #fecdd3;border-radius:9px;padding:12px;color:#be123c;font-size:12.5px}

/* ── PIPELINE BUILDER ── */
.pb-wrap{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:24px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.pb-title{font-size:17px;font-weight:700;color:#0f172a;margin-bottom:5px}
.pb-sub{font-size:13px;color:#64748b;margin-bottom:20px;line-height:1.6}
.pb-presets{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
.pb-preset{border:1.5px solid #e0e0e0;border-radius:10px;padding:9px 15px;font-size:12px;font-weight:600;cursor:pointer;color:#374151;background:#fff;font-family:inherit;transition:all .15s}
.pb-preset:hover,.pb-preset.on{background:#eff6ff;border-color:#0a66c2;color:#0a66c2}
.pb-stage-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-bottom:18px}
.pb-stage{border:1.5px solid #e5e7eb;border-radius:10px;padding:11px 13px;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:9px;background:#fafafa}
.pb-stage:hover{border-color:#0a66c2;background:#eff6ff}
.pb-stage.on{background:#eff6ff;border-color:#0a66c2}
.pb-stage.locked{opacity:.5;cursor:not-allowed}
.pb-stage-icon{font-size:20px;flex-shrink:0}
.pb-stage-name{font-size:12.5px;font-weight:600;color:#0f172a}
.pb-stage-desc{font-size:11px;color:#9ca3af;margin-top:1px}
.pb-current{background:#f0f7ff;border:1px solid #bfdbfe;border-radius:12px;padding:14px;margin-bottom:16px}
.pb-current-title{font-size:12px;font-weight:700;color:#1d4ed8;margin-bottom:10px}
.pb-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.pb-chip{display:flex;align-items:center;gap:6px;background:#fff;border:1.5px solid #bfdbfe;border-radius:20px;padding:5px 12px;font-size:12px;font-weight:500;color:#0f172a}
.pb-chip.req{background:#eff6ff;border-color:#0a66c2;color:#0a66c2}
.pb-chip-rm{cursor:pointer;color:#dc2626;font-size:14px;line-height:1}
.pb-chip-arrow{color:#bfdbfe;font-size:12px}
.pb-save{background:linear-gradient(135deg,#0a66c2,#2563eb);color:#fff;border:none;border-radius:10px;padding:11px 26px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 3px 12px rgba(10,102,194,.25)}

/* ── RECRUITER DASHBOARD ── */
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px}
.dash-card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:22px;box-shadow:0 2px 8px rgba(0,0,0,.03)}
.dash-card h3{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #f0f0f0}
.kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
.kpi{background:#f8f9fa;border:1px solid #e8e8e8;border-radius:12px;padding:14px;text-align:center}
.kpi-num{font-size:26px;font-weight:800;color:#0a66c2}
.kpi-label{font-size:10px;color:#9ca3af;margin-top:3px;font-weight:500;line-height:1.3}
.cand-row{display:flex;align-items:center;gap:11px;padding:12px 0;border-bottom:1px solid #f8f9fa}
.cand-row:last-child{border-bottom:none}
.cand-av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#0a66c2,#2563eb);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0}
.cand-info{flex:1}
.cand-name{font-size:13px;font-weight:700;color:#0f172a}
.cand-sub{font-size:11px;color:#9ca3af}
.stage-pill{font-size:11px;font-weight:600;padding:3px 10px;border-radius:10px;white-space:nowrap}
.update-select{border:1.5px solid #e0e0e0;border-radius:8px;padding:6px 10px;font-size:12px;font-family:inherit;cursor:pointer;background:#fff;color:#374151;outline:none;transition:border-color .15s}
.update-select:focus{border-color:#0a66c2}
.info-box{background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:11px 14px;font-size:12px;color:#1e40af;line-height:1.65;margin-top:12px}
.warn-box{background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:11px 14px;font-size:12px;color:#78350f;line-height:1.65;margin-top:12px}
.success-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:11px 14px;font-size:12px;color:#15803d;line-height:1.65;margin-top:12px}

/* ── MY APPLICATIONS ── */
.my-apps-list{display:flex;flex-direction:column;gap:10px}
.my-app-card{background:#fff;border:1.5px solid #e8e8e8;border-radius:14px;padding:18px 20px;display:flex;gap:14px;align-items:flex-start;box-shadow:0 2px 8px rgba(0,0,0,.03)}
.my-app-card.with-status{border-left:4px solid #0a66c2}
.mini-tracker{display:flex;gap:0;align-items:center;margin-top:12px;overflow-x:auto}
.mini-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;border:2px solid #e5e7eb;background:#fff;flex-shrink:0}
.mini-dot.done{background:#0a66c2;border-color:#0a66c2;color:#fff;font-size:10px}
.mini-dot.current{border-color:#0a66c2;background:#eff6ff}
.mini-dot.pending{opacity:.4}
.mini-line{flex:1;height:2px;background:#e5e7eb;min-width:16px}
.mini-line.done{background:#0a66c2}

/* ── NOTIFICATIONS ── */
.notif-dropdown{position:absolute;top:60px;right:70px;width:360px;background:#fff;border:1px solid #e8e8e8;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.12);z-index:300;overflow:hidden}
.notif-hdr{padding:16px 20px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between}
.notif-hdr h3{font-size:15px;font-weight:700}
.notif-mark{font-size:12px;color:#0a66c2;cursor:pointer;font-weight:600;background:none;border:none;font-family:inherit}
.notif-item{display:flex;gap:11px;padding:14px 20px;border-bottom:1px solid #f8f9fa;cursor:pointer;transition:background .15s}
.notif-item:hover{background:#f8f9fa}
.notif-item.unread{background:#f0f7ff}
.notif-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;background:#f0f0f0}
.notif-text{flex:1;font-size:13px;color:#374151;line-height:1.55}
.notif-text strong{color:#0f172a}
.notif-time{font-size:11px;color:#9ca3af;margin-top:3px}
.notif-unread-dot{width:8px;height:8px;background:#0a66c2;border-radius:50%;flex-shrink:0;margin-top:4px}

/* ── FOOTER ── */
.footer{background:#fff;border-top:1px solid #e8e8e8;padding:28px;text-align:center;font-size:13px;color:#9ca3af;margin-top:40px}

@media(max-width:1024px){.jobs-layout{grid-template-columns:1fr}.filter-sidebar{display:none}.jd-layout{grid-template-columns:1fr}.truth-panel{position:static}.dash-grid{grid-template-columns:1fr}}
@media(max-width:768px){.hero h1{font-size:34px}.feat-grid{grid-template-columns:1fr}.hero-stats{flex-wrap:wrap;gap:24px}.nav-search{display:none}}
`;

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function ResumeUpload({ onText }) {
  const [name, setName] = useState(""); const [text, setText] = useState(""); const ref = useRef();
  async function hf(f) { if (!f) return; setName(f.name); const t = await f.text(); setText(t); onText(t); }
  return (
    <div>
      {!name ? (
        <div className="upload-zone" onClick={() => ref.current?.click()}>
          <input ref={ref} type="file" accept=".pdf,.doc,.docx,.txt" onChange={e => hf(e.target.files[0])} />
          <div className="upload-icon-wrap">📄</div>
          <div className="upload-main">Click to upload resume</div>
          <div className="upload-sub">PDF · DOC · DOCX · TXT supported</div>
        </div>
      ) : (
        <div className="file-ok">
          <span style={{ fontSize: 18 }}>📄</span><span style={{ flex: 1 }}>{name}</span>
          <span style={{ cursor: "pointer", color: "#dc2626", fontSize: 16 }} onClick={() => { setName(""); setText(""); onText(""); }}>✕</span>
        </div>
      )}
      <div className="or-divider">or paste text</div>
      <textarea className="tf-input" rows={5} value={text} onChange={e => { setText(e.target.value); onText(e.target.value); }} placeholder="Paste your resume content here..." />
    </div>
  );
}

function PipelineBuilder({ init, onSave, onCancel }) {
  const [ids, setIds] = useState(init || ["applied", "resume", "tech1", "hr", "offer"]);
  const [preset, setPreset] = useState(null);
  function applyPreset(k) { setIds([...PRESETS[k].stages]); setPreset(k); }
  function toggle(id) {
    const s = SL.find(x => x.id === id); if (s?.req) return;
    if (ids.includes(id)) { setIds(ids.filter(i => i !== id)); } else { const n = [...ids]; const oi = n.indexOf("offer"); if (oi >= 0) n.splice(oi, 0, id); else n.push(id); setIds(n); }
    setPreset(null);
  }
  function move(id, d) {
    const i = ids.indexOf(id); if (d === -1 && i <= 0) return; if (d === 1 && i >= ids.length - 1) return;
    const sa = SL.find(x => x.id === ids[i]); const nb = SL.find(x => x.id === ids[i + d]);
    if (sa?.req || nb?.req) return;
    const n = [...ids]; [n[i], n[i + d]] = [n[i + d], n[i]]; setIds(n);
  }
  return (
    <div className="pb-wrap">
      <div className="pb-title">🔧 Customise Hiring Pipeline</div>
      <div className="pb-sub">Define the exact screening stages for this role. Candidates see every step upfront and track their live progress through it.</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>Quick presets</div>
      <div className="pb-presets">{Object.entries(PRESETS).map(([k, v]) => <button key={k} className={`pb-preset ${preset === k ? "on" : ""}`} onClick={() => applyPreset(k)}>{v.label}</button>)}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>Select stages</div>
      <div className="pb-stage-grid">
        {SL.map(s => (
          <div key={s.id} className={`pb-stage ${ids.includes(s.id) ? "on" : ""} ${s.req ? "locked" : ""}`} onClick={() => toggle(s.id)}>
            <span className="pb-stage-icon">{s.icon}</span>
            <div><div className="pb-stage-name">{s.label}{s.req ? " *" : ""}</div><div className="pb-stage-desc">{s.desc}</div></div>
            {ids.includes(s.id) && !s.req && <span style={{ marginLeft: "auto", color: "#0a66c2", fontSize: 15 }}>✓</span>}
          </div>
        ))}
      </div>
      <div className="pb-current">
        <div className="pb-current-title">Pipeline preview — {ids.length} stages</div>
        <div className="pb-chips">
          {ids.map((id, i) => { const s = SL.find(x => x.id === id); if (!s) return null; return (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {i > 0 && <span className="pb-chip-arrow">→</span>}
              <div className={`pb-chip ${s.req ? "req" : ""}`}>
                {s.icon} {s.label}
                {!s.req && <span style={{ display: "flex", gap: 2, marginLeft: 4 }}>
                  <span style={{ cursor: "pointer", color: "#aaa", fontSize: 12 }} onClick={() => move(id, -1)}>◀</span>
                  <span style={{ cursor: "pointer", color: "#aaa", fontSize: 12 }} onClick={() => move(id, 1)}>▶</span>
                  <span className="pb-chip-rm" onClick={() => toggle(id)}>✕</span>
                </span>}
              </div>
            </div>
          ); })}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="pb-save" onClick={() => onSave(ids)}>Save Pipeline</button>
        <button className="btn sm ghost" style={{ borderRadius: 10 }} onClick={onCancel}>Cancel</button>
      </div>
      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>* Applied and Offer are required stages and cannot be removed. You can edit this pipeline anytime after posting.</div>
    </div>
  );
}

function StatusTracker({ pipeline, candStage, rejected, notes }) {
  const stages = pipeline.map(id => SL.find(s => s.id === id)).filter(Boolean);
  const total = stages.length;
  const pct = candStage <= 0 ? 0 : (candStage / (total - 1)) * 100;
  const current = stages[candStage];
  return (
    <div>
      <div className="tracker-tagline"><span>📡</span> Your progress updates the moment the recruiter acts</div>
      <div className="tr-scroll">
        <div className="tr-inner" style={{ minWidth: `${Math.max(total * 86, 440)}px` }}>
          <div className="tr-line" style={{ left: 38, right: 38 }} />
          <div className="tr-fill" style={{ left: 38, width: `calc(${pct}% - 38px)` }} />
          <div className="tr-steps">
            {stages.map((s, i) => {
              const done = i < candStage; const cur = i === candStage && !rejected; const rej = rejected && i === candStage;
              return (
                <div key={s.id} className="tr-step">
                  <div className={`tr-dot ${done ? "done" : cur ? "current" : rej ? "rej" : "pending"}`}>
                    {done ? <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>✓</span> : rej ? <span style={{ color: "#fff" }}>✕</span> : s.icon}
                  </div>
                  <span className={`tr-label ${done ? "done" : cur ? "current" : rej ? "rej" : ""}`}>{s.label}</span>
                  <span className={`tr-sub ${done ? "done" : cur ? "current" : ""}`}>{done ? "✓ Cleared" : cur ? "← Current" : rej ? "✕" : ""}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {notes[candStage] && <div className="stage-note"><strong>📝 Note from recruiter ({current?.label}):</strong> {notes[candStage]}</div>}
      <div className="tracker-footer">
        <span>Now: <strong>{rejected ? "Application Closed" : current?.label}</strong></span>
        <span>Progress: <strong>{candStage + 1} / {total}</strong></span>
        <span>Updated by: <strong>Recruiter</strong></span>
      </div>
    </div>
  );
}

function RecruiterCard({ rec }) {
  const rr = rec.rr; const bc = rr >= 75 ? "rc-rr-green" : rr >= 50 ? "rc-rr-amber" : "rc-rr-red"; const rc = rr >= 75 ? "#15803d" : rr >= 50 ? "#d97706" : "#b91c1c";
  const act = activityStatus(rec);
  return (
    <div>
      <div className="rc-top">
        <div className="rc-av" style={{ background: rec.bg, width: 52, height: 52, fontSize: 18 }}>{rec.avatar}</div>
        <div style={{ flex: 1 }}>
          <div className="rc-name-row"><span className="rc-name">{rec.name}</span>{rec.verified && <span className="rc-v">✓ 1st</span>}</div>
          <div className="rc-role">{rec.role}</div>
          <div className="rc-sub">{rec.company}</div>
          <button className="rc-msg-btn">Message</button>
        </div>
      </div>
      <div className="rc-stats-row">
        <div className="rc-stat"><div className="rc-stat-num" style={{ color: rc }}>{rr}%</div><div className="rc-stat-label">Response Rate</div></div>
        <div className="rc-stat"><div className="rc-stat-num">{rec.replied}</div><div className="rc-stat-label">Replied</div></div>
        <div className="rc-stat"><div className="rc-stat-num" style={{ color: rec.pending > 5 ? "#b91c1c" : "#0f172a" }}>{rec.pending}</div><div className="rc-stat-label">Pending</div></div>
      </div>
      <div className="rc-activity-row">
        <span className="rc-activity-label">Screening status</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: act.color, display: "flex", alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: act.dot, display: "inline-block", marginRight: 5, animation: act.pulse ? "pulse 2s infinite" : "none" }} />{act.label}
        </span>
      </div>
      <div className="rc-activity-row">
        <span className="rc-activity-label">Shift schedule</span>
        <span style={{ fontSize: 12, color: "#374151" }}>{rec.shift}</span>
      </div>
      <div className="rc-activity-row">
        <span className="rc-activity-label">Filtering method</span>
        <span style={{ fontSize: 11, fontWeight: 600, background: "#eff6ff", color: "#0a66c2", padding: "3px 10px", borderRadius: 10 }}>⚡ {rec.filter}</span>
      </div>
      <div className="rc-rr-wrap">
        <div className="rc-rr-header"><span className="rc-rr-label">Public Response Score</span><span className="rc-rr-pct" style={{ color: rc }}>{rr}%</span></div>
        <div className="rc-rr-track"><div className={`rc-rr-fill ${bc}`} style={{ width: `${rr}%` }} /></div>
      </div>
      {rec.pending > 0 && (
        <div className="rc-pending-note">
          <strong>⚠️ {rec.pending} applications pending a response</strong> — based on platform activity data. This reflects cases where candidates completed their part and are awaiting an update. Circumstances vary.
        </div>
      )}
    </div>
  );
}

function MatchTool({ job }) {
  const [resume, setResume] = useState(""); const [result, setResult] = useState(null); const [loading, setLoading] = useState(false);
  async function run() {
    if (!resume.trim()) return; setLoading(true); setResult(null);
    const sys = `Expert technical recruiter. Deep semantic analysis — not keyword matching. Return ONLY valid JSON: {"score":0-100,"verdict":"one honest sentence","strengths":["s1","s2","s3"],"gaps":["g1","g2","g3"],"recruiter_thought":"honest private thought","keyword_score":0-100,"why_differs":"brief explanation"}`;
    try { const r = await callGroq(sys, `JD:\n${job.jd}\n\nRESUME:\n${resume}`); setResult(JSON.parse(r.replace(/```json|```/g, "").trim())); } catch { setResult({ error: "Could not parse. Try again." }); }
    setLoading(false);
  }
  const sc = result ? (result.score >= 70 ? "sc-green" : result.score >= 50 ? "sc-amber" : "sc-red") : "";
  return (
    <div>
      <div className="tf-note"><strong>Not keywords.</strong> We reason about whether your actual experience maps to what they genuinely need — not word frequency or ATS tricks.</div>
      <ResumeUpload onText={t => setResume(t)} />
      <button className="tf-btn" onClick={run} disabled={loading || !resume.trim()}>{loading && <span className="spinner" />}{loading ? "Analysing semantically..." : "⚖️ Get Honest Match Score"}</button>
      {result && !result.error && (<>
        <div className="score-center">
          <div className={`score-ring ${sc}`}><span className="n">{result.score}</span><span className="p">/100</span></div>
          <div className="verdict">{result.verdict}</div>
        </div>
        <div className="r-card info"><h4>💡 Keyword {result.keyword_score}% vs Semantic {result.score}%</h4><p>{result.why_differs}</p></div>
        <div className="r-section green"><h4>✅ Genuine Strengths</h4><ul className="r-list">{result.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
        <div className="r-section red"><h4>⚠️ Real Gaps</h4><ul className="r-list">{result.gaps?.map((g, i) => <li key={i}>{g}</li>)}</ul></div>
        <div className="r-card warn"><h4>💬 What the recruiter is thinking</h4><p>{result.recruiter_thought}</p></div>
      </>)}
      {result?.error && <div className="err">{result.error}</div>}
    </div>
  );
}

function GhostTool({ job, rec }) {
  const [date, setDate] = useState(""); const [comms, setComms] = useState(""); const [stage, setStage] = useState("applied"); const [result, setResult] = useState(null); const [loading, setLoading] = useState(false);
  const act = activityStatus(rec);
  async function run() {
    setLoading(true); setResult(null);
    const days = date ? Math.floor((new Date() - new Date(date)) / 86400000) : "unknown";
    const sys = `Honest job search advisor. Return ONLY valid JSON: {"ghost_probability":0-100,"status":"Almost certainly ghosted|Likely ghosted|Possibly still active|Too early to tell|Strong progress signals","what_happened":"2 honest sentences","signals":["s1","s2","s3"],"action":"specific advice","follow_up":"exact follow-up message or empty string","move_on":true/false}`;
    try { const r = await callGroq(sys, `Company: ${job.company}\nRole: ${job.title}\nApplied: ${date} (${days} days ago)\nStage: ${stage}\nLast comms: ${comms || "None"}\nRecruiter RR: ${rec.rr}%\nPending: ${rec.pending}\nStatus: ${act.label}`); setResult(JSON.parse(r.replace(/```json|```/g, "").trim())); } catch { setResult({ error: "Could not parse. Try again." }); }
    setLoading(false);
  }
  const gc = result ? (result.ghost_probability >= 70 ? "#b91c1c" : result.ghost_probability >= 40 ? "#d97706" : "#15803d") : "#0a66c2";
  const gbc = result ? (result.ghost_probability >= 70 ? "ghost-high" : result.ghost_probability >= 40 ? "ghost-med" : "ghost-low") : "";
  return (
    <div>
      <div className="tf-note"><strong>Stop guessing.</strong> We analyse recruiter activity, shift schedules, and your timeline to tell you honestly what is likely happening with your application.</div>
      <div className="r-card info" style={{ marginBottom: 14 }}><h4>Recruiter signal for this role</h4><p>Response score: <strong style={{ color: rec.rr >= 75 ? "#15803d" : "#d97706" }}>{rec.rr}%</strong> · Pending replies: <strong>{rec.pending}</strong> · Currently: <strong>{act.label}</strong></p></div>
      <label className="tf-label">Date applied</label><input type="date" className="tf-input" value={date} onChange={e => setDate(e.target.value)} />
      <label className="tf-label">Stage reached</label>
      <select className="tf-input" value={stage} onChange={e => setStage(e.target.value)}>
        <option value="applied">Applied — no response yet</option><option value="screening">Screening call done</option><option value="assignment">Assignment submitted</option><option value="interview">Interview completed</option><option value="final">Final round done</option>
      </select>
      <label className="tf-label">Last communication</label><input className="tf-input" value={comms} onChange={e => setComms(e.target.value)} placeholder="What was said, and when?" />
      <button className="tf-btn" onClick={run} disabled={loading}>{loading && <span className="spinner" />}{loading ? "Analysing signals..." : "👻 Check Application Status"}</button>
      {result && !result.error && (<>
        <div className="ghost-center"><div className="ghost-pct" style={{ color: gc }}>{result.ghost_probability}%</div><div style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 8px" }}>Silence probability</div><div className={`ghost-badge ${gbc}`}>{result.status}</div></div>
        <div className="r-card info"><h4>🔍 What probably happened</h4><p>{result.what_happened}</p></div>
        <ul className="signal-list" style={{ marginBottom: 12 }}>{result.signals?.map((s, i) => <li key={i}>{s}</li>)}</ul>
        <div className={`r-card ${result.move_on ? "danger" : "success"}`}><h4>{result.move_on ? "🚶 Honest advice" : "📨 Recommended action"}</h4><p>{result.action}</p>{!result.move_on && result.follow_up && <blockquote>{result.follow_up}</blockquote>}</div>
      </>)}
      {result?.error && <div className="err">{result.error}</div>}
    </div>
  );
}

function FeedbackTool({ job }) {
  const [resume, setResume] = useState(""); const [stage, setStage] = useState("resume"); const [sub, setSub] = useState(""); const [result, setResult] = useState(null); const [loading, setLoading] = useState(false);
  async function run() {
    setLoading(true); setResult(null);
    const sys = `Simulate the honest internal recruiter debrief. Return ONLY valid JSON: {"internal_verdict":"what the hiring manager said in the room","real_reasons":["r1","r2","r3"],"what_they_liked":["l1","l2"],"what_killed_it":"the single deciding factor","fix_this":"specific actionable change","who_got_hired":"description of profile that likely got the role","keep_this":"one genuine strength worth continuing"}`;
    try { const r = await callGroq(sys, `JD:\n${job.jd}\n\nRESUME:\n${resume || "Not provided"}\n\nSTAGE: ${stage}\n${sub ? `\nSUBMISSION:\n${sub}` : ""}`); setResult(JSON.parse(r.replace(/```json|```/g, "").trim())); } catch { setResult({ error: "Could not parse. Try again." }); }
    setLoading(false);
  }
  return (
    <div>
      <div className="tf-note"><strong>The debrief you were never in.</strong> What the hiring team actually said when they decided not to move forward — reconstructed from the JD and your profile.</div>
      <ResumeUpload onText={t => setResume(t)} />
      <label className="tf-label">Stage you reached</label>
      <select className="tf-input" value={stage} onChange={e => setStage(e.target.value)}>
        <option value="resume">Resume screening</option><option value="screening">Phone / video screening</option><option value="assignment">Assignment submitted</option><option value="interview">Technical interview</option><option value="final">Final round</option>
      </select>
      {(stage === "assignment" || stage === "interview") && (<><label className="tf-label">Your submission (optional — improves accuracy)</label><textarea className="tf-input" rows={4} value={sub} onChange={e => setSub(e.target.value)} placeholder="Paste your assignment or describe what you covered..." /></>)}
      <button className="tf-btn" onClick={run} disabled={loading}>{loading && <span className="spinner" />}{loading ? "Reconstructing debrief..." : "🔮 Simulate Recruiter Feedback"}</button>
      {result && !result.error && (<>
        <div className="r-card danger"><h4>🎙️ Internal verdict</h4><p>"{result.internal_verdict}"</p></div>
        <div className="r-card danger"><h4>💀 What killed it</h4><p>{result.what_killed_it}</p></div>
        <div className="r-section red" style={{ marginBottom: 12 }}><h4>❌ Real reasons</h4><ul className="r-list">{result.real_reasons?.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
        <div className="r-section green" style={{ marginBottom: 12 }}><h4>✅ What they liked</h4><ul className="r-list">{result.what_they_liked?.map((w, i) => <li key={i}>{w}</li>)}</ul></div>
        <div className="r-card info"><h4>🎯 Fix this one thing</h4><p>{result.fix_this}</p></div>
        <div className="r-card warn"><h4>👤 Who got hired instead</h4><p>{result.who_got_hired}</p></div>
        <div className="r-card success"><h4>💪 Keep doing this</h4><p>{result.keep_this}</p></div>
      </>)}
      {result?.error && <div className="err">{result.error}</div>}
    </div>
  );
}

function JobDetail({ job, allJobs, onBack, onSelect, appliedIds, onApply }) {
  const [tab, setTab] = useState("match");
  const rec = RECS[job.recId];
  const stages = job.pipeline.map(id => SL.find(s => s.id === id)).filter(Boolean);
  const isApplied = appliedIds.has(job.id);
  const similar = allJobs.filter(j => j.id !== job.id && (j.tags.some(t => job.tags.includes(t)) || j.company === job.company)).slice(0, 3);
  return (
    <>
      <div style={{ background: "#f4f2ee", padding: "10px 28px", maxWidth: 1200, margin: "0 auto" }}>
        <button className="back" onClick={onBack}>← Back to Jobs</button>
      </div>
      <div className="wrap" style={{ paddingTop: 0 }}>
        <div className="jd-layout">
          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="jd-header">
                <div className="jd-logo-row">
                  <div className="jd-logo" style={{ background: job.logoColor }}>{job.logo}</div>
                  <div className="jd-logo-text">
                    <div className="jd-title">{job.title}</div>
                    <div className="jd-company">{job.company}</div>
                    <div className="jd-company-bio">{job.companyBio}</div>
                  </div>
                </div>
                <div className="jd-meta">
                  <span>📍 {job.location}</span><span>💼 {job.type}</span><span>🏠 {job.remote}</span>
                  <span>💰 {job.salary}</span><span>🎓 {job.exp}</span><span>🕐 {job.posted}</span>
                  <span>👥 {job.applicants} applicants</span>
                </div>
                <div className="jd-tags">{job.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                <div className="jd-actions">
                  {isApplied ? (
                    <div className="jd-applied-state"><span>✅</span> You've applied · <span style={{ fontWeight: 400, color: "#374151" }}>Tracking your progress below</span></div>
                  ) : (
                    <>
                      <button className="btn pri" onClick={() => onApply(job.id)}>Apply Now</button>
                      <button className="btn sec">Save Job</button>
                      <button className="btn sec" style={{ padding: "10px 14px" }}>⋯</button>
                    </>
                  )}
                </div>
              </div>
              <div className="jd-body">
                <div className="jd-section-title">Hiring Pipeline for This Role</div>
                <div className="jd-pipeline-row">
                  {stages.map((s, i) => (<div key={s.id} style={{ display: "flex", alignItems: "center", gap: 7 }}>{i > 0 && <span className="pip-arrow">→</span>}<span className="pip-chip">{s.icon} {s.label}</span></div>))}
                </div>
                <div className="jd-section-title">About the Role</div>
                <div className="jd-text">{job.jd}</div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 14, padding: 20 }}>
              <div className="mq-strip-h">How your profile fits this role</div>
              <div className="mq-strip-sub">TruthHire gives you honest AI analysis — not ATS optimisation tricks</div>
              <div className="mq-btns" style={{ marginTop: 12 }}>
                <button className="mq-btn" onClick={() => setTab("match")}>✦ Match Score</button>
                <button className="mq-btn" onClick={() => setTab("feedback")}>✦ Feedback Simulator</button>
                <button className="mq-btn" onClick={() => setTab("ghost")}>✦ Ghost Risk</button>
              </div>
            </div>

            <div className="card" style={{ padding: 20, marginBottom: 14 }}>
              <div className="jd-section-title" style={{ marginBottom: 14 }}>Connect with the hiring team</div>
              <RecruiterCard rec={rec} />
            </div>

            {isApplied && (
              <div className="card" style={{ padding: 20, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div className="jd-section-title" style={{ margin: 0 }}>Application Progress</div>
                  <span className="pill blue">Step {job.candStage + 1} of {stages.length}</span>
                </div>
                <StatusTracker pipeline={job.pipeline} candStage={job.candStage} rejected={job.rejected} notes={job.notes} />
              </div>
            )}

            {similar.length > 0 && (
              <div className="card">
                <div className="jd-similar">
                  <div className="jd-similar-title">Similar Jobs You Might Like</div>
                  {similar.map(j => (
                    <div key={j.id} className="similar-item" onClick={() => onSelect(j)}>
                      <div className="similar-logo" style={{ background: j.logoColor }}>{j.logo}</div>
                      <div className="similar-info">
                        <div className="similar-title">{j.title}</div>
                        <div className="similar-company">{j.company} · {j.salary}</div>
                      </div>
                      <span className={`pill ${j.ghostRisk === "Low" ? "green" : j.ghostRisk === "Medium" ? "amber" : "red"}`}>{j.ghostRisk} ghost risk</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="truth-panel">
              <div className="tp-hdr">
                <div className="tp-hdr-row">
                  <div className="tp-icon">⚖️</div>
                  <div className="tp-hdr-text"><div className="tp-title">TruthHire Analysis</div><div className="tp-subtitle">AI tools that tell you what job portals won't</div></div>
                </div>
                <div className="tp-tabs">
                  <button className={`tp-tab ${tab === "match" ? "active" : ""}`} onClick={() => setTab("match")}>⚖️ Match Score</button>
                  <button className={`tp-tab ${tab === "ghost" ? "active" : ""}`} onClick={() => setTab("ghost")}>👻 Ghost Risk</button>
                  <button className={`tp-tab ${tab === "feedback" ? "active" : ""}`} onClick={() => setTab("feedback")}>🔮 Feedback</button>
                </div>
              </div>
              <div className="tp-body">
                {tab === "match" && <MatchTool job={job} />}
                {tab === "ghost" && <GhostTool job={job} rec={rec} />}
                {tab === "feedback" && <FeedbackTool job={job} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function JobsFeed({ jobs, onSelect, appliedIds }) {
  const [filter, setFilter] = useState("All"); const [remote, setRemote] = useState("All"); const [sort, setSort] = useState("recent"); const [search, setSearch] = useState("");
  const typeFilters = ["All", "AI/ML", "Full Stack", "Python", "GenAI", "Computer Vision"];
  const remoteFilters = ["All", "Remote", "Hybrid", "Onsite"];
  let filtered = jobs;
  if (search) filtered = filtered.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || j.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
  if (filter !== "All") filtered = filtered.filter(j => j.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())) || j.title.toLowerCase().includes(filter.toLowerCase()));
  if (remote !== "All") filtered = filtered.filter(j => j.remote === remote);
  if (sort === "salary") filtered = [...filtered].sort((a, b) => parseInt(b.salary) - parseInt(a.salary));
  return (
    <div className="wrap">
      <div className="jobs-layout">
        <div className="filter-sidebar">
          <h3>Filters</h3>
          <div className="filter-group">
            <div className="filter-group-title">Job Type</div>
            {typeFilters.map(f => <button key={f} className={`filter-opt ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>)}
          </div>
          <div className="filter-group">
            <div className="filter-group-title">Work Mode</div>
            {remoteFilters.map(r => <button key={r} className={`filter-opt ${remote === r ? "active" : ""}`} onClick={() => setRemote(r)}>{r}</button>)}
          </div>
          <div className="filter-group">
            <div className="filter-group-title">Ghost Risk</div>
            {["Low", "Medium", "High"].map(g => <button key={g} className="filter-opt">{g === "Low" ? "🟢" : g === "Medium" ? "🟡" : "🔴"} {g} Risk</button>)}
          </div>
          {(filter !== "All" || remote !== "All") && <button className="clear-filters" onClick={() => { setFilter("All"); setRemote("All"); }}>Clear all filters</button>}
        </div>
        <div className="jobs-main">
          <div className="jobs-header">
            <div><h2 style={{ fontSize: 20, fontWeight: 700 }}>{filtered.length} Jobs for You</h2><p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>Every job includes honest AI analysis</p></div>
            <div className="jobs-header-right">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", width: 180 }} />
              <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}><option value="recent">Most Recent</option><option value="salary">Highest Salary</option></select>
            </div>
          </div>
          <div className="jobs-list">
            {filtered.map(job => {
              const rec = RECS[job.recId]; const act = activityStatus(rec); const applied = appliedIds.has(job.id);
              const stages = job.pipeline.map(id => SL.find(s => s.id === id)).filter(Boolean);
              return (
                <div key={job.id} className={`job-card ${applied ? "applied-card" : ""}`} onClick={() => onSelect(job)}>
                  <div className="jc-top">
                    <div className="jc-logo" style={{ background: job.logoColor }}>{job.logo}</div>
                    <div className="jc-body">
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <div className="jc-title">{job.title}</div>
                          <div className="jc-company">{job.company} · <span style={{ color: "#9ca3af", fontWeight: 400 }}>{job.companyBio.split("·")[0].trim()}</span></div>
                        </div>
                        <div className="jc-right">
                          <div className="jc-salary">{job.salary}</div>
                          <div className="jc-exp" style={{ color: "#9ca3af" }}>{job.exp}</div>
                          <span className={`pill ${job.ghostRisk === "Low" ? "green" : job.ghostRisk === "Medium" ? "amber" : "red"}`}>👻 {job.ghostRisk} Ghost Risk</span>
                          {applied && <span className="applied-badge">✓ Applied</span>}
                        </div>
                      </div>
                      <div className="jc-meta">
                        <span>📍 {job.location}</span><span style={{ background: job.remote === "Remote" ? "#dcfce7" : job.remote === "Hybrid" ? "#dbeafe" : "#f3f4f6", color: job.remote === "Remote" ? "#15803d" : job.remote === "Hybrid" ? "#1d4ed8" : "#6b7280", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>{job.remote}</span>
                        <span>🕐 {job.posted}</span><span>👥 {job.applicants}</span>
                        <span style={{ color: act.color, fontWeight: 600 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: act.dot, display: "inline-block", marginRight: 4 }} />{act.label}</span>
                        <span style={{ color: rec.rr >= 75 ? "#15803d" : "#d97706", fontWeight: 600 }}>📊 {rec.rr}% RR</span>
                      </div>
                      <div className="jc-pipeline">
                        <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginRight: 4 }}>PIPELINE:</span>
                        {stages.map((s, i) => (<span key={s.id} style={{ display: "flex", alignItems: "center", gap: 3 }}>{i > 0 && <span style={{ color: "#d1d5db", fontSize: 10 }}>›</span>}<span className="jc-pipeline-chip">{s.icon} {s.label}</span></span>))}
                      </div>
                      <div className="jc-tags">{job.tags.map(t => <span key={t} className="jc-tag">{t}</span>)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MyApplications({ jobs, appliedIds, onSelect }) {
  const applied = jobs.filter(j => appliedIds.has(j.id));
  return (
    <div className="wrap">
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: "#0f172a" }}>My Applications</h2>
      <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 20 }}>{applied.length} active applications · Track your live progress</p>
      <div className="my-apps-list">
        {applied.map(job => {
          const stages = job.pipeline.map(id => SL.find(s => s.id === id)).filter(Boolean);
          return (
            <div key={job.id} className="my-app-card with-status" style={{ cursor: "pointer" }} onClick={() => onSelect(job)}>
              <div className="jc-logo" style={{ background: job.logoColor, width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: "#fff", flexShrink: 0 }}>{job.logo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div><div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{job.title}</div><div style={{ fontSize: 13, color: "#374151" }}>{job.company} · {job.salary}</div></div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span className="pill blue">Step {job.candStage + 1} of {stages.length}</span>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>Current: {stages[job.candStage]?.label}</span>
                  </div>
                </div>
                <div className="mini-tracker" style={{ marginTop: 12 }}>
                  {stages.map((s, i) => (<div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < stages.length - 1 ? "1" : "none" }}>
                    <div className={`mini-dot ${i < job.candStage ? "done" : i === job.candStage ? "current" : "pending"}`} style={{ fontSize: i < job.candStage ? 12 : 14 }}>{i < job.candStage ? "✓" : s.icon}</div>
                    {i < stages.length - 1 && <div className={`mini-line ${i < job.candStage ? "done" : ""}`} />}
                  </div>))}
                </div>
                {job.notes[job.candStage] && <div style={{ marginTop: 10, fontSize: 12, color: "#92400e", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px" }}>📝 {job.notes[job.candStage]}</div>}
              </div>
            </div>
          );
        })}
        {applied.length === 0 && <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}><div style={{ fontSize: 48, marginBottom: 12 }}>📭</div><div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No applications yet</div><div style={{ fontSize: 14 }}>Browse jobs and apply to start tracking your progress</div></div>}
      </div>
    </div>
  );
}

const NOTIFS = [
  { id: 1, icon: "📋", text: <><strong>NexaLogic Technologies</strong> moved your application to <strong>Assignment stage</strong></>, time: "2 hours ago", read: false },
  { id: 2, icon: "💬", text: <><strong>Kavitha Rangan</strong> sent you a message about the AI Engineer role</>, time: "Yesterday", read: false },
  { id: 3, icon: "🔍", text: <><strong>Luminary Consulting</strong> viewed your profile for Senior GenAI Developer</>, time: "2 days ago", read: true },
  { id: 4, icon: "⚠️", text: <><strong>TruthHire Alert:</strong> Vortex Systems has a 45% response rate — 14 applications pending</>, time: "3 days ago", read: true },
];

function RecruiterDashboard({ jobs, setJobs, onBack }) {
  const [selId, setSelId] = useState(jobs[0].id); const [showBuilder, setShowBuilder] = useState(false);
  const [cands, setCands] = useState([
    { id: 1, name: "Rohan Pillai", av: "RP", stage: 2, rej: false },
    { id: 2, name: "Meera Iyer", av: "MI", stage: 1, rej: false },
    { id: 3, name: "Aditya Shah", av: "AS", stage: 0, rej: false },
    { id: 4, name: "Tanvi Nair", av: "TN", stage: 3, rej: false },
    { id: 5, name: "Karan Bose", av: "KB", stage: 2, rej: true },
  ]);
  const rec = RECS[1]; const rr = rec.rr; const bc = rr >= 75 ? "rc-rr-green" : rr >= 50 ? "rc-rr-amber" : "rc-rr-red"; const rc2 = rr >= 75 ? "#15803d" : rr >= 50 ? "#d97706" : "#b91c1c";
  const act = activityStatus(rec);
  const selJob = jobs.find(j => j.id === selId);
  const stages = selJob ? selJob.pipeline.map(id => SL.find(s => s.id === id)).filter(Boolean) : [];
  function stagePillCls(l = "") { const lo = l.toLowerCase(); if (lo.includes("applied")) return "pill blue"; if (lo.includes("screen") || lo.includes("review")) return "pill amber"; if (lo.includes("assign") || lo.includes("case")) return "pill purple"; if (lo.includes("tech") || lo.includes("f2f") || lo.includes("face") || lo.includes("manager")) return "pill green"; if (lo.includes("offer")) return "pill green"; if (lo.includes("reject")) return "pill red"; if (lo.includes("hr")) return "pill gray"; return "pill gray"; }
  return (
    <div className="wrap">
      <button className="back" onClick={onBack}>← Back to Jobs</button>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-.3px" }}>Recruiter Dashboard</h2><p style={{ fontSize: 14, color: "#9ca3af", marginTop: 3 }}>Manage your pipeline, track performance, and build trust with candidates</p></div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: rec.bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>{rec.avatar}</div>
          <div><div style={{ fontSize: 15, fontWeight: 700 }}>{rec.name}</div><div style={{ fontSize: 12, color: "#9ca3af" }}>{rec.role}</div></div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <h3>Reputation Score</h3>
          <div className="kpi-grid">
            <div className="kpi"><div className="kpi-num" style={{ color: rc2 }}>{rr}%</div><div className="kpi-label">Response Rate</div></div>
            <div className="kpi"><div className="kpi-num">{rec.replied}</div><div className="kpi-label">Replied</div></div>
            <div className="kpi"><div className="kpi-num" style={{ color: rec.pending > 5 ? "#b91c1c" : "#0f172a" }}>{rec.pending}</div><div className="kpi-label">Pending</div></div>
          </div>
          <div className="rc-rr-wrap">
            <div className="rc-rr-header"><span className="rc-rr-label">Public Response Score (visible to candidates)</span><span className="rc-rr-pct" style={{ color: rc2 }}>{rr}%</span></div>
            <div className="rc-rr-track"><div className={`rc-rr-fill ${bc}`} style={{ width: `${rr}%` }} /></div>
          </div>
          <div className="warn-box">⚠️ {rec.pending} applications pending a response. Responding promptly improves your score and prevents automatic tracking flags.</div>
          <div className="success-box">✅ Your response score is auto-calculated from your platform activity and shift schedule — no manual control. Stay active during your shift to maintain a high score.</div>
        </div>

        <div className="dash-card">
          <h3>Screening Activity</h3>
          <div style={{ background: act.dot === "#16a34a" ? "#f0fdf4" : "#f8f9fa", border: `1px solid ${act.dot === "#16a34a" ? "#bbf7d0" : "#e5e7eb"}`, borderRadius: 12, padding: "14px 16px", marginBottom: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: act.dot, display: "block", flexShrink: 0, marginTop: 3, animation: act.pulse ? "pulse 2s infinite" : "none" }} />
            <div><div style={{ fontSize: 14, fontWeight: 700, color: act.color }}>{act.label}</div><div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>Auto-calculated from shift ({rec.shift}) and recent login. Cannot be manually set.</div></div>
          </div>
          <div style={{ fontSize: 13, color: "#374151", display: "flex", flexDirection: "column", gap: 6 }}>
            <div>📊 Total applications: <strong>{rec.total}</strong></div>
            <div>✅ Replied: <strong>{rec.replied}</strong></div>
            <div style={{ color: "#b91c1c" }}>⏳ Pending: <strong>{rec.pending}</strong></div>
            <div>🕐 Last active: <strong>{rec.lastActivity}</strong></div>
          </div>
          <div className="info-box">⚡ AI pre-screened all applications and shortlisted candidates based on semantic match. Shortlist ready for your review.</div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>Select Job to Manage</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{jobs.map(j => <button key={j.id} className={`pb-preset ${selId === j.id ? "on" : ""}`} onClick={() => setSelId(j.id)}>{j.title} · {j.company}</button>)}</div>
      </div>

      {selJob && (<>
        {showBuilder ? (
          <PipelineBuilder init={selJob.pipeline} onSave={p => { setJobs(prev => prev.map(j => j.id === selId ? { ...j, pipeline: p } : j)); setShowBuilder(false); }} onCancel={() => setShowBuilder(false)} />
        ) : (
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Hiring Pipeline — {selJob.title}</div>
              <button className="btn sec" style={{ padding: "7px 16px", fontSize: 13, borderRadius: 20 }} onClick={() => setShowBuilder(true)}>✏️ Edit Pipeline</button>
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>{stages.map((s, i) => (<div key={s.id} style={{ display: "flex", alignItems: "center", gap: 7 }}>{i > 0 && <span style={{ color: "#bfdbfe", fontSize: 14 }}>→</span>}<span className="pip-chip">{s.icon} {s.label}</span></div>))}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Candidates see this pipeline in real time. Changes here update their tracker automatically.</div>
          </div>
        )}

        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>Candidate Pipeline — {selJob.title} ({cands.length} candidates)</div>
          {cands.map(c => {
            const sl = c.rej ? "Rejected" : stages[c.stage]?.label || "Applied";
            return (
              <div key={c.id} className="cand-row">
                <div className="cand-av">{c.av}</div>
                <div className="cand-info"><div className="cand-name">{c.name}</div><div className="cand-sub">{c.rej ? "Application closed" : `Currently: ${sl}`}</div></div>
                <span className={stagePillCls(sl)}>{sl}</span>
                <select className="update-select" value={c.rej ? "rej" : c.stage} onChange={e => { const v = e.target.value; setCands(p => p.map(x => x.id === c.id ? { ...x, stage: v === "rej" ? x.stage : parseInt(v), rej: v === "rej" } : x)); }}>
                  {stages.map((s, i) => <option key={i} value={i}>{s.icon} {s.label}</option>)}
                  <option value="rej">❌ Reject</option>
                </select>
              </div>
            );
          })}
          <div className="info-box">Updating a stage here instantly updates the candidate's application tracker. Transparency builds trust.</div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>Pending Assignment Reviews</div>
          <div className="cand-row">
            <div className="cand-av">RP</div>
            <div className="cand-info"><div className="cand-name">Rohan Pillai</div><div className="cand-sub">RAG pipeline implementation · GitHub repo · Submitted 1 day ago</div></div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn sm green" onClick={() => setCands(p => p.map(c => c.id === 1 ? { ...c, stage: 3 } : c))}>✓ Move to {stages[3]?.label || "Interview"}</button>
              <button className="btn sm red" onClick={() => setCands(p => p.map(c => c.id === 1 ? { ...c, rej: true } : c))}>✕ Reject</button>
            </div>
          </div>
          <div className="warn-box">⚠️ Respond within 5 days of submission. Delays are tracked and reflected in your public response score.</div>
        </div>
      </>)}
    </div>
  );
}

function Landing({ onBrowse, onRecruiter }) {
  return (<>
    <div className="hero">
      <div className="hero-inner">
        <div className="hero-chip">🔍 The hiring transparency platform</div>
        <h1>Job hunting is broken.<br /><span>TruthHire</span> fixes it.</h1>
        <p>You apply. You wait. You hear nothing. TruthHire gives every candidate honest AI analysis, live application tracking, and holds recruiters publicly accountable.</p>
        <div className="hero-btns"><button className="btn pri" style={{ fontSize: 16, padding: "13px 34px" }} onClick={onBrowse}>Browse Jobs →</button><button className="btn sec" style={{ fontSize: 16, padding: "13px 30px" }} onClick={onRecruiter}>Recruiter Login</button></div>
        <div className="hero-stats">
          {[["78%","Applications get zero response"],["43%","Jobs filled before closing"],["0","Portals that tell you the truth"],["11","Pipeline stage types available"]].map(([n, l]) => (<div key={n} style={{ textAlign: "center" }}><span className="hero-stat-num">{n}</span><div className="hero-stat-label">{l}</div></div>))}
        </div>
      </div>
    </div>
    <div className="wrap">
      <div style={{ textAlign: "center", margin: "48px 0 24px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-.5px" }}>Everything you need. Built into every job.</h2>
        <p style={{ fontSize: 16, color: "#64748b", marginTop: 8, maxWidth: 520, margin: "8px auto 0" }}>No premium tier. Every AI tool is free for every candidate on every job listing.</p>
      </div>
      <div className="feat-grid" style={{ marginTop: 28 }}>
        {[["📡","#eff6ff","Live Application Tracker","See exactly where you stand. Every stage defined by the company. Updated the moment the recruiter acts — not when they remember to email."],["⚖️","#f5f3ff","Honest Match Engine","Semantic reasoning about your real experience — not keyword frequency. Know if you're actually a fit before investing hours applying."],["👻","#fff7ed","Ghost Detector","Based on real recruiter activity, shift schedules, and response history. Know whether to wait or move on — with a specific follow-up message if needed."],["🔮","#fdf2f8","Feedback Simulator","Reconstruct the debrief you were never invited to. What the team actually said. What killed your application. What to fix next time."],["📊","#f0fdf4","Recruiter Accountability","Auto-calculated response score, pending reply count, and shift schedule — all visible to candidates before they apply."],["🔧","#f8faff","Custom Pipelines","Every company defines their own rounds. Candidates see every step upfront. No more wondering how many rounds are left."]].map(([icon, bg, title, desc]) => (
          <div key={title} className="feat-card" onClick={onBrowse}>
            <div className="feat-card-icon" style={{ background: bg }}>{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
            <div className="feat-badge">→ See it live</div>
          </div>
        ))}
      </div>
    </div>
  </>);
}

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("landing");
  const [jobs, setJobs] = useState(JOBS);
  const [selJob, setSelJob] = useState(null);
  const [appliedIds, setAppliedIds] = useState(APPLIED_IDS);
  const [savedIds, setSavedIds] = useState(SAVED_IDS);
  const [showNotif, setShowNotif] = useState(false);
  const [notifsRead, setNotifsRead] = useState(false);
  const [notifs] = useState(NOTIFS_DATA);
  const [toast, setToast] = useState(null);
  const unread = notifsRead ? 0 : notifs.filter(n => !n.read).length;

  function goto(p) { setPage(p); window.scrollTo(0, 0); }
  function selectJob(job) { const fresh = jobs.find(j => j.id === job.id); setSelJob(fresh); goto("detail"); }
  function applyJob(id) { setAppliedIds(prev => new Set([...prev, id])); }
  function toggleSave(id) { setSavedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); }
  function showToast(msg) { setToast(msg); }

  // Pass extra props down to JobsFeed, JobDetail, MyApplications, RecruiterDashboard
  const jobFeedProps = { jobs, onSelect: selectJob, appliedIds, savedIds, onSave: toggleSave, showToast };
  const jobDetailProps = selJob ? { job: selJob, allJobs: jobs, onBack: () => goto("jobs"), onSelect: selectJob, appliedIds, savedIds, onApply: applyJob, onSave: toggleSave, showToast } : null;
  const myAppsProps = { jobs, appliedIds, savedIds, onSelect: selectJob, onSave: toggleSave, showToast };
  const recDashProps = { jobs, setJobs, onBack: () => goto("jobs"), showToast };

  return (
    <>
      <style>{CSS}</style>
      <style>{`
        @keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        .notif-dropdown{position:absolute;top:50px;right:0;width:380px;background:#fff;border:1px solid #e8e8e8;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.12);z-index:500;overflow:hidden}
        .notif-hdr{padding:16px 20px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between}
        .notif-hdr h3{font-size:16px;font-weight:700}
        .notif-mark{font-size:12px;color:#0a66c2;cursor:pointer;font-weight:600;background:none;border:none;font-family:inherit}
        .notif-item{display:flex;gap:11px;padding:14px 20px;border-bottom:1px solid #f8f9fa;cursor:pointer;transition:background .15s}
        .notif-item:hover{background:#f8f9fa}.notif-item.unread{background:#f0f7ff}
        .notif-av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;background:#f5f5f5}
        .notif-text{font-size:13px;color:#374151;line-height:1.55;flex:1}
        .notif-time{font-size:11px;color:#9ca3af;margin-top:3px}
        .notif-unread-dot{width:8px;height:8px;background:#0a66c2;border-radius:50%;flex-shrink:0;margin-top:5px}
        .jd-apply-state{display:flex;align-items:center;gap:8px;background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:10px;padding:11px 18px;font-size:14px;font-weight:600;color:#1d4ed8}
        .save-btn-active{background:#fff8e1;border:1.5px solid #fde68a;color:#b45309}
        .comp-about-box{padding:20px 24px;border-top:1px solid #f0f0f0;background:#fafbfc}
        .comp-about-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px}
        .comp-stat{text-align:center;background:#fff;border:1px solid #e8e8e8;border-radius:10px;padding:14px}
        .comp-stat-num{font-size:18px;font-weight:700;color:#0a66c2}
        .comp-stat-label{font-size:11px;color:#9ca3af;margin-top:2px}
        .remote-Remote{background:#dcfce7;color:#15803d;font-size:11px;font-weight:600;padding:2px 8px;border-radius:6px}
        .remote-Hybrid{background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:600;padding:2px 8px;border-radius:6px}
        .remote-Onsite{background:#f3f4f6;color:#6b7280;font-size:11px;font-weight:600;padding:2px 8px;border-radius:6px}
        .jc-applied-pill{background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:600;padding:3px 10px;border-radius:10px}
        .jc-saved-pill{background:#fef9c3;color:#a16207;font-size:11px;font-weight:600;padding:3px 10px;border-radius:10px}
        .filter-sidebar{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:20px;position:sticky;top:76px;box-shadow:0 2px 8px rgba(0,0,0,.03)}
        .filter-sidebar h3{font-size:14px;font-weight:700;color:#0f172a;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between}
        .clear-filters{font-size:12px;color:#0a66c2;cursor:pointer;font-weight:600;background:none;border:none;font-family:inherit}
        .filter-group{margin-bottom:18px}
        .filter-group-label{font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
        .filter-opt{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:9px;cursor:pointer;transition:background .15s;font-size:13px;color:#374151;font-weight:500;border:none;background:none;width:100%;text-align:left;font-family:inherit}
        .filter-opt:hover{background:#f8f9fa}.filter-opt.on{background:#eff6ff;color:#0a66c2;font-weight:600}
        .jobs-layout-grid{display:grid;grid-template-columns:230px 1fr;gap:20px;align-items:start}
        .my-app-card{background:#fff;border:1.5px solid #e8e8e8;border-radius:14px;padding:18px 20px;display:flex;gap:14px;align-items:flex-start;box-shadow:0 2px 8px rgba(0,0,0,.03);margin-bottom:10px;cursor:pointer;transition:all .2s;border-left:4px solid #0a66c2}
        .my-app-card:hover{border-color:#0a66c2;box-shadow:0 6px 20px rgba(10,102,194,.1)}
        .mini-tr{display:flex;align-items:center;margin-top:12px;overflow-x:auto}
        .mini-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;border:2px solid #e5e7eb;background:#fff;flex-shrink:0}
        .mini-dot.done{background:linear-gradient(135deg,#0a66c2,#2563eb);border-color:transparent;color:#fff}
        .mini-dot.cur{border-color:#0a66c2;color:#0a66c2;background:#eff6ff}
        .mini-dot.pend{opacity:.35}
        .mini-line{height:2px;background:#e5e7eb;flex:1;min-width:14px}
        .mini-line.done{background:#0a66c2}
        .empty-state{text-align:center;padding:60px 20px;color:#9ca3af}
        .post-job-form{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.04);margin-bottom:16px}
        .pjf-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .pjf-label{font-size:12px;font-weight:600;color:#374151;margin-bottom:5px;display:block}
        .pjf-input{width:100%;border:1.5px solid #e5e7eb;border-radius:9px;padding:10px 13px;font-size:13px;font-family:inherit;color:#0f172a;background:#fafafa;outline:none;transition:all .2s}
        .pjf-input:focus{border-color:#0a66c2;background:#fff;box-shadow:0 0 0 3px rgba(10,102,194,.08)}
        textarea.pjf-input{resize:vertical}
        .cand-score-chip{font-size:11px;font-weight:700;background:#eff6ff;color:#0a66c2;padding:3px 8px;border-radius:8px}
      `}</style>

      <nav className="nav">
        <div className="nav-logo" onClick={() => goto("landing")}>
          <div className="logo-mark">T</div>
          <span className="logo-name">TruthHire</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center", gap: 4 }}>
          <div className="nav-search-bar">
            <span style={{ fontSize: 14, color: "#94a3b8" }}>🔍</span>
            <input placeholder="Search jobs, companies, skills..." onKeyDown={e => { if (e.key === "Enter") goto("jobs"); }} />
          </div>
          <button className={`nav-tab ${page === "jobs" ? "on" : ""}`} onClick={() => goto("jobs")}>Jobs</button>
          <button className={`nav-tab ${page === "apps" ? "on" : ""}`} onClick={() => goto("apps")}>
            My Applications
            {appliedIds.size > 0 && <span className="nav-tab-badge">{appliedIds.size}</span>}
          </button>
          <button className={`nav-tab ${page === "profile" ? "on" : ""}`} onClick={() => goto("profile")}>Profile</button>
          <button className={`nav-tab ${page === "recruiter" ? "on" : ""}`} onClick={() => goto("recruiter")}>Recruiters</button>
        </div>

        <div className="nav-right">
          <div style={{ position: "relative" }}>
            <button className="nav-notif-btn" onClick={() => { setShowNotif(!showNotif); setNotifsRead(true); }}>
              🔔
              {unread > 0 && <span className="nav-notif-badge">{unread}</span>}
            </button>
            {showNotif && (
              <div className="notif-dropdown">
                <div className="notif-hdr"><h3>Notifications</h3><button className="notif-mark" onClick={() => { setNotifsRead(true); setShowNotif(false); }}>Mark all read</button></div>
                {notifs.map(n => (
                  <div key={n.id} className={`notif-item ${!notifsRead && !n.read ? "unread" : ""}`}>
                    <div className="notif-av">{n.icon}</div>
                    <div style={{ flex: 1 }}><div className="notif-text">{n.text}</div><div className="notif-time">{n.time}</div></div>
                    {!notifsRead && !n.read && <div className="notif-unread-dot" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="nav-user" onClick={() => goto("profile")}>
            <div className="nav-user-av">NB</div>
            <span className="nav-user-name">Nikhil BT</span>
          </div>

          <button className="nb s" onClick={() => goto("recruiter")}>Recruiter Login</button>
          <button className="nb p" onClick={() => goto("jobs")}>Browse Jobs</button>
        </div>
      </nav>

      {page === "landing" && <Landing onBrowse={() => goto("jobs")} onRecruiter={() => goto("recruiter")} />}
      {page === "jobs" && <JobsFeedV2 {...jobFeedProps} />}
      {page === "detail" && selJob && <JobDetailV2 {...jobDetailProps} />}
      {page === "apps" && <MyApplicationsV2 {...myAppsProps} />}
      {page === "profile" && <ProfilePage />}
      {page === "recruiter" && <RecruiterDashboardV2 {...recDashProps} />}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <div className="footer">TruthHire · Built for the Softway AI Challenge · Nikhil BT · AWS Certified ML Engineer · Bengaluru · 2026</div>
    </>
  );
}

// ── ENHANCED JOBS FEED with filters, search, sort, save ──
function JobsFeedV2({ jobs, onSelect, appliedIds, savedIds, onSave, showToast }) {
  const [filter, setFilter] = useState("All"); const [remote, setRemote] = useState("All"); const [ghost, setGhost] = useState("All"); const [search, setSearch] = useState(""); const [sort, setSort] = useState("recent"); const [salaryMax, setSalaryMax] = useState(30);
  function salaryNum(s) { const m = s.match(/\d+/); return m ? parseInt(m[0]) : 0; }
  let filtered = jobs;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.tags.some(t => t.toLowerCase().includes(q)) ||
      j.jd.toLowerCase().includes(q)
    );
  }
  if (filter !== "All") filtered = filtered.filter(j =>
    j.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())) ||
    j.title.toLowerCase().includes(filter.toLowerCase())
  );
  if (remote !== "All") filtered = filtered.filter(j => j.remote === remote);
  if (ghost !== "All") filtered = filtered.filter(j => j.ghostRisk === ghost);
  filtered = filtered.filter(j => salaryNum(j.salary) <= salaryMax);
  if (sort === "salary") filtered = [...filtered].sort((a, b) => salaryNum(b.salary) - salaryNum(a.salary));
  if (sort === "applicants") filtered = [...filtered].sort((a, b) => a.applicants - b.applicants);
  const hasFilters = filter !== "All" || remote !== "All" || ghost !== "All";
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 28px" }}>
      <div className="jobs-layout-grid">
        <div className="filter-sidebar">
          <h3>Filters <button className="clear-filters" onClick={() => { setFilter("All"); setRemote("All"); setGhost("All"); setSalaryMax(30); }} style={{ display: hasFilters ? "block" : "none" }}>Clear all</button></h3>
          <div className="filter-group">
            <div className="filter-group-label">Domain</div>
            {["All", "AI/ML", "Full Stack", "Python", "GenAI"].map(f => <button key={f} className={`filter-opt ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>{f}</button>)}
          </div>
          <div className="filter-group">
            <div className="filter-group-label">Work Mode</div>
            {["All", "Remote", "Hybrid", "Onsite"].map(r => <button key={r} className={`filter-opt ${remote === r ? "on" : ""}`} onClick={() => setRemote(r)}>{r}</button>)}
          </div>
          <div className="filter-group">
            <div className="filter-group-label">Ghost Risk</div>
            {["All", "Low", "Medium", "High"].map(g => <button key={g} className={`filter-opt ${ghost === g ? "on" : ""}`} onClick={() => setGhost(g)}>{g === "Low" ? "🟢 Low" : g === "Medium" ? "🟡 Medium" : g === "High" ? "🔴 High" : "All"}</button>)}
          </div>
          <div className="filter-group">
            <div className="filter-group-label">Max Salary</div>
            <input type="range" min={5} max={30} step={1} value={salaryMax} onChange={e => setSalaryMax(+e.target.value)} style={{ width: "100%", accentColor: "#0a66c2", marginTop: 6 }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", marginTop: 4 }}><span>₹5 LPA</span><span>₹{salaryMax} LPA</span></div>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{filtered.length} Jobs for You</div><div style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>Every job includes honest AI analysis — free</div></div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles, skills..." style={{ border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", width: 200 }} />
              <select style={{ border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff" }} value={sort} onChange={e => setSort(e.target.value)}>
                <option value="recent">Most Recent</option><option value="salary">Highest Salary</option><option value="applicants">Fewest Applicants</option>
              </select>
            </div>
          </div>
          {filtered.length === 0 ? <div className="empty-state"><div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div><div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 8 }}>No jobs found</div><div style={{ fontSize: 14 }}>Try adjusting your filters</div></div> : filtered.map(job => {
            const rec = RECS[job.recId]; const act = activityStatus(rec); const applied = appliedIds.has(job.id); const saved = savedIds.has(job.id);
            const stages = job.pipeline.map(id => SL.find(s => s.id === id)).filter(Boolean);
            return (
              <div key={job.id} className={`job-card ${applied ? "applied" : saved ? "saved-card" : ""}`} onClick={() => onSelect(job)}>
                <div className="jc-top">
                  <div className="jc-logo" style={{ background: job.logoColor }}>{job.logo}</div>
                  <div className="jc-body">
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div><div className="jc-title">{job.title}</div><div className="jc-company">{job.company} · <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: 12 }}>{job.companyBio.split("·")[0].trim()}</span></div></div>
                      <div className="jc-right">
                        <div className="jc-salary">{job.salary}</div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>{job.exp}</div>
                        <span className={`pill ${job.ghostRisk === "Low" ? "green" : job.ghostRisk === "Medium" ? "amber" : "red"}`}>👻 {job.ghostRisk} Risk</span>
                        {applied && <span className="jc-applied-pill">✓ Applied</span>}
                        {saved && !applied && <span className="jc-saved-pill">⭐ Saved</span>}
                      </div>
                    </div>
                    <div className="jc-meta">
                      <span>📍 {job.location}</span><span><span className={`remote-${job.remote}`}>{job.remote}</span></span>
                      <span>🕐 {job.posted}</span><span>👥 {job.applicants}</span><span>👁️ {job.views}</span>
                      <span style={{ color: act.color, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: act.dot, display: "inline-block", animation: act.pulse ? "pulse 2s infinite" : "none" }} />{act.label}</span>
                      <span style={{ color: rec.rr >= 75 ? "#15803d" : "#d97706", fontWeight: 600, fontSize: 12 }}>📊 {rec.rr}% RR</span>
                    </div>
                    <div className="jc-pipeline">{stages.map((s, i) => (<span key={s.id} style={{ display: "flex", alignItems: "center", gap: 3 }}>{i > 0 && <span style={{ color: "#d1d5db", fontSize: 10 }}>›</span>}<span className="pl-chip-sm">{s.icon} {s.label}</span></span>))}</div>
                    <div className="jc-tags">{job.tags.map(t => <span key={t} className="jc-tag">{t}</span>)}</div>
                    <div style={{ display: "flex", gap: 7, marginTop: 12, paddingTop: 12, borderTop: "1px solid #f8f9fa" }}>
                      {!applied && <button className="btn p sm" onClick={e => { e.stopPropagation(); onSelect(job); }}>Apply Now</button>}
                      <button className={`btn sm ${saved ? "save-btn-active" : "s"}`} onClick={e => { e.stopPropagation(); onSave(job.id); showToast(saved ? "Removed from saved" : "Job saved!"); }}>{saved ? "⭐ Saved" : "☆ Save"}</button>
                      <button className="btn g sm" onClick={e => { e.stopPropagation(); onSelect(job); }}>View Details →</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── ENHANCED JOB DETAIL with company about, similar jobs, save, apply state ──
function JobDetailV2({ job, allJobs, onBack, onSelect, appliedIds, savedIds, onApply, onSave, showToast }) {
  const [tab, setTab] = useState("match");
  const rec = RECS[job.recId];
  const stages = job.pipeline.map(id => SL.find(s => s.id === id)).filter(Boolean);
  const isApplied = appliedIds.has(job.id); const isSaved = savedIds.has(job.id);
  const similar = allJobs.filter(j => j.id !== job.id && j.tags.some(t => job.tags.includes(t))).slice(0, 3);
  return (<>
    <div style={{ background: "#f4f2ee", padding: "10px 28px", maxWidth: 1200, margin: "0 auto" }}><button className="back" onClick={onBack}>← Back to Jobs</button></div>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px 28px" }}>
      <div className="jd-layout">
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="jd-hdr">
              <div className="jd-logo-row">
                <div className="jd-logo" style={{ background: job.logoColor }}>{job.logo}</div>
                <div><div className="jd-title">{job.title}</div><div className="jd-company-name">{job.company}</div><div className="jd-company-bio">{job.companyBio}</div></div>
              </div>
              <div className="jd-meta">
                <span>📍 {job.location}</span><span><span className={`remote-${job.remote}`}>{job.remote}</span></span>
                <span>💰 {job.salary}</span><span>🎓 {job.exp}</span><span>🕐 {job.posted}</span>
                <span>👥 {job.applicants} applicants</span><span>👁️ {job.views} views</span>
              </div>
              <div className="jd-tags">{job.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              <div className="jd-actions">
                {isApplied ? <div className="jd-apply-state">✅ You've applied · <span style={{ fontWeight: 400, color: "#374151" }}>Tracking your progress below</span></div> : (
                  <>
                    <button className="btn p" onClick={() => { onApply(job.id); showToast("Application submitted!"); }}>Apply Now</button>
                    <button className={`btn ${isSaved ? "save-btn-active" : "s"}`} onClick={() => { onSave(job.id); showToast(isSaved ? "Removed from saved" : "Job saved!"); }}>{isSaved ? "⭐ Saved" : "☆ Save Job"}</button>
                    <button className="btn g" style={{ padding: "10px 14px", fontSize: 18, borderRadius: 10 }}>⋯</button>
                  </>
                )}
              </div>
            </div>
            <div className="jd-body">
              <div className="section-title">Hiring Pipeline for This Role</div>
              <div className="pip-row">{stages.map((s, i) => (<div key={s.id} style={{ display: "flex", alignItems: "center", gap: 7 }}>{i > 0 && <span className="pip-arrow">→</span>}<span className="pip-chip">{s.icon} {s.label}</span></div>))}</div>
              <div className="section-title">About the Role</div>
              <div className="jd-text">{job.jd}</div>
            </div>
            {job.companyAbout && (
              <div className="comp-about-box">
                <div className="section-title">About {job.company}</div>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, marginBottom: 14 }}>{job.companyAbout}</p>
                <div className="comp-about-grid">
                  <div className="comp-stat"><div className="comp-stat-num">{job.companySize}</div><div className="comp-stat-label">Employees</div></div>
                  <div className="comp-stat"><div className="comp-stat-num">{job.companyFounded}</div><div className="comp-stat-label">Founded</div></div>
                  <div className="comp-stat"><div className="comp-stat-num" style={{ fontSize: 14 }}>🌐</div><div className="comp-stat-label">{job.companyWebsite}</div></div>
                </div>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>How your profile fits this role</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>TruthHire gives you honest AI analysis — not ATS keyword tricks</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[["⚖️ Match Score", "match"], ["🔮 Feedback Simulator", "feedback"], ["👻 Ghost Risk", "ghost"]].map(([label, t]) => (
                <button key={t} className="mq-btn" onClick={() => setTab(t)}>✦ {label}</button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20, marginBottom: 14 }}>
            <div className="section-title">Connect with the hiring team</div>
            <RecruiterCard rec={rec} />
          </div>

          {isApplied && (
            <div className="card" style={{ padding: 20, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div className="section-title" style={{ margin: 0 }}>Application Progress</div>
                <span className="pill blue">Step {job.candStage + 1} of {stages.length}</span>
              </div>
              <StatusTracker pipeline={job.pipeline} candStage={job.candStage} rejected={job.rejected} notes={job.notes} />
            </div>
          )}

          {similar.length > 0 && (
            <div className="card">
              <div style={{ padding: 20 }}>
                <div className="section-title">Similar Jobs You Might Like</div>
                {similar.map(j => (
                  <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, cursor: "pointer", transition: "background .15s" }} onMouseEnter={e => e.currentTarget.style.background = "#f8f9fa"} onMouseLeave={e => e.currentTarget.style.background = ""} onClick={() => onSelect(j)}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: j.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff", flexShrink: 0 }}>{j.logo}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{j.title}</div><div style={{ fontSize: 12, color: "#9ca3af" }}>{j.company} · {j.salary}</div></div>
                    <span className={`pill ${j.ghostRisk === "Low" ? "green" : j.ghostRisk === "Medium" ? "amber" : "red"}`}>{j.ghostRisk} risk</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="truth-panel">
            <div className="tp-hdr">
              <div className="tp-hdr-row"><div className="tp-icon">⚖️</div><div><div className="tp-title">TruthHire Analysis</div><div className="tp-sub">AI tools that tell you what job portals won't</div></div></div>
              <div className="tp-tabs">
                <button className={`tp-tab ${tab === "match" ? "on" : ""}`} onClick={() => setTab("match")}>⚖️ Match Score</button>
                <button className={`tp-tab ${tab === "ghost" ? "on" : ""}`} onClick={() => setTab("ghost")}>👻 Ghost Risk</button>
                <button className={`tp-tab ${tab === "feedback" ? "on" : ""}`} onClick={() => setTab("feedback")}>🔮 Feedback</button>
              </div>
            </div>
            <div className="tp-body">
              {tab === "match" && <MatchTool job={job} />}
              {tab === "ghost" && <GhostTool job={job} rec={rec} />}
              {tab === "feedback" && <FeedbackTool job={job} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
}

// ── MY APPLICATIONS with applied + saved tabs ──
function MyApplicationsV2({ jobs, appliedIds, savedIds, onSelect, onSave, showToast }) {
  const [view, setView] = useState("applied");
  const applied = jobs.filter(j => appliedIds.has(j.id));
  const saved = jobs.filter(j => savedIds.has(j.id) && !appliedIds.has(j.id));
  const list = view === "applied" ? applied : saved;
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-.3px" }}>My Applications</h2><p style={{ fontSize: 14, color: "#9ca3af", marginTop: 3 }}>Track every application in real time</p></div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className={`btn sm ${view === "applied" ? "p" : "g"}`} onClick={() => setView("applied")}>Applied ({applied.length})</button>
          <button className={`btn sm ${view === "saved" ? "p" : "g"}`} onClick={() => setView("saved")}>Saved ({saved.length})</button>
        </div>
      </div>
      {list.length === 0 ? (
        <div className="empty-state"><div style={{ fontSize: 48, marginBottom: 12 }}>{view === "applied" ? "📭" : "⭐"}</div><div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 8 }}>{view === "applied" ? "No applications yet" : "No saved jobs"}</div><div style={{ fontSize: 14 }}>{view === "applied" ? "Browse jobs and apply to start tracking" : "Save jobs to review later"}</div></div>
      ) : list.map(job => {
        const stages = job.pipeline.map(id => SL.find(s => s.id === id)).filter(Boolean);
        return (
          <div key={job.id} className="my-app-card" onClick={() => onSelect(job)}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: job.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: "#fff", flexShrink: 0 }}>{job.logo}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{job.title}</div><div style={{ fontSize: 13, color: "#374151" }}>{job.company} · {job.salary}</div></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  {view === "applied" ? <><span className="pill blue">Step {job.candStage + 1} of {stages.length}</span><span style={{ fontSize: 12, color: "#9ca3af" }}>{stages[job.candStage]?.label}</span></> : <button className="btn red-o sm" onClick={e => { e.stopPropagation(); onSave(job.id); showToast("Removed from saved"); }}>Remove</button>}
                </div>
              </div>
              {view === "applied" && (
                <>
                  <div className="mini-tr">
                    {stages.map((s, i) => (<div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < stages.length - 1 ? "1" : "none" }}>
                      <div className={`mini-dot ${i < job.candStage ? "done" : i === job.candStage ? "cur" : "pend"}`}>{i < job.candStage ? "✓" : s.icon}</div>
                      {i < stages.length - 1 && <div className={`mini-line ${i < job.candStage ? "done" : ""}`} />}
                    </div>))}
                  </div>
                  {job.notes[job.candStage] && <div style={{ marginTop: 10, fontSize: 12, color: "#92400e", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px" }}>📝 {job.notes[job.candStage]}</div>}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── ENHANCED RECRUITER DASHBOARD with Post Job ──
function RecruiterDashboardV2({ jobs, setJobs, onBack, showToast }) {
  const [selId, setSelId] = useState(jobs[0].id); const [showBuilder, setShowBuilder] = useState(false); const [showPostJob, setShowPostJob] = useState(false);
  const [cands, setCands] = useState([
    { id: 1, name: "Rohan Pillai", av: "RP", stage: 2, rej: false, score: 87, exp: "3 yrs · LangChain, FastAPI", submitted: "Assignment submitted 1 day ago" },
    { id: 2, name: "Meera Iyer", av: "MI", stage: 1, rej: false, score: 72, exp: "2 yrs · Python, RAG", submitted: null },
    { id: 3, name: "Aditya Shah", av: "AS", stage: 0, rej: false, score: 65, exp: "1 yr · ML, AWS", submitted: null },
    { id: 4, name: "Tanvi Nair", av: "TN", stage: 3, rej: false, score: 91, exp: "4 yrs · LangGraph, Claude API", submitted: null },
    { id: 5, name: "Karan Bose", av: "KB", stage: 2, rej: true, score: 58, exp: "2 yrs · Python, Docker", submitted: null },
  ]);
  const [newJob, setNewJob] = useState({ title: "", company: "NexaLogic Technologies", location: "Bengaluru", type: "Full-time", remote: "Hybrid", salary: "", exp: "", jd: "" });
  const rec = RECS[1]; const rr = rec.rr; const bc = rr >= 75 ? "rr-green" : rr >= 50 ? "rr-amber" : "rr-red"; const rc = rr >= 75 ? "#15803d" : rr >= 50 ? "#d97706" : "#b91c1c";
  const act = activityStatus(rec);
  const selJob = jobs.find(j => j.id === selId);
  const stages = selJob ? selJob.pipeline.map(id => SL.find(s => s.id === id)).filter(Boolean) : [];
  function stagePillCls(l = "") { const lo = l.toLowerCase(); if (lo.includes("applied")) return "blue"; if (lo.includes("screen") || lo.includes("review")) return "amber"; if (lo.includes("assign") || lo.includes("case")) return "purple"; if (lo.includes("tech") || lo.includes("f2f") || lo.includes("manager")) return "green"; if (lo.includes("offer")) return "green"; if (lo.includes("reject")) return "red"; return "gray"; }
  function postJob() { if (!newJob.title || !newJob.salary) { showToast("Please fill required fields"); return; } showToast(`Job "${newJob.title}" posted successfully!`); setShowPostJob(false); setNewJob({ title: "", company: "NexaLogic Technologies", location: "Bengaluru", type: "Full-time", remote: "Hybrid", salary: "", exp: "", jd: "" }); }
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 28px" }}>
      <button className="back" onClick={onBack}>← Back to Jobs</button>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-.3px" }}>Recruiter Dashboard</h2><p style={{ fontSize: 14, color: "#9ca3af", marginTop: 3 }}>Manage your pipeline, track performance, build trust</p></div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn p sm" onClick={() => setShowPostJob(!showPostJob)}>+ Post New Job</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: rec.bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>{rec.avatar}</div><div><div style={{ fontSize: 15, fontWeight: 700 }}>{rec.name}</div><div style={{ fontSize: 12, color: "#9ca3af" }}>{rec.role}</div></div></div>
        </div>
      </div>

      {showPostJob && (
        <div className="post-job-form">
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>Post New Job</div>
          <div className="pjf-grid">
            {[["Job Title *", "title", "text"], ["Company", "company", "text"], ["Location", "location", "text"], ["Salary Range *", "salary", "text"], ["Experience", "exp", "text"], ["Work Mode", "remote", "select"]].map(([label, key, type]) => (
              <div key={key}><label className="pjf-label">{label}</label>
                {type === "select" ? <select className="pjf-input" value={newJob[key]} onChange={e => setNewJob(p => ({ ...p, [key]: e.target.value }))}><option>Hybrid</option><option>Remote</option><option>Onsite</option></select> : <input className="pjf-input" value={newJob[key]} onChange={e => setNewJob(p => ({ ...p, [key]: e.target.value }))} placeholder={label.replace(" *", "")} />}
              </div>
            ))}
            <div style={{ gridColumn: "1/-1" }}><label className="pjf-label">Job Description</label><textarea className="pjf-input" rows={5} value={newJob.jd} onChange={e => setNewJob(p => ({ ...p, jd: e.target.value }))} placeholder="Describe the role, responsibilities, and requirements..." /></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}><button className="btn p sm" onClick={postJob}>Post Job</button><button className="btn g sm" onClick={() => setShowPostJob(false)}>Cancel</button></div>
        </div>
      )}

      <div className="dash-grid">
        <div className="dash-card">
          <h3>Reputation Score <span style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af" }}>Visible to all</span></h3>
          <div className="kpi-row">
            <div className="kpi"><div className="kpi-num" style={{ color: rc }}>{rr}%</div><div className="kpi-label">Response Rate</div></div>
            <div className="kpi"><div className="kpi-num">{rec.replied}</div><div className="kpi-label">Replied</div></div>
            <div className="kpi"><div className="kpi-num" style={{ color: rec.pending > 5 ? "#b91c1c" : "#0f172a" }}>{rec.pending}</div><div className="kpi-label">Pending</div></div>
          </div>
          <div style={{ marginBottom: 5, display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 11, color: "#6b7280" }}>Public Response Score</span><span style={{ fontSize: 12, fontWeight: 700, color: rc }}>{rr}%</span></div>
          <div className="rr-track"><div className={`rr-fill ${bc}`} style={{ width: `${rr}%` }} /></div>
          <div className="warn-box">⚠️ {rec.pending} applications pending. Respond to improve your score.</div>
          <div className="success-box">✅ Score is auto-calculated from shift schedule + platform activity.</div>
        </div>
        <div className="dash-card">
          <h3>Screening Activity <span style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af" }}>Auto-calculated</span></h3>
          <div style={{ background: act.dot === "#16a34a" ? "#f0fdf4" : "#f8f9fa", border: `1px solid ${act.dot === "#16a34a" ? "#bbf7d0" : "#e5e7eb"}`, borderRadius: 12, padding: "14px 16px", marginBottom: 14, display: "flex", gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: act.dot, display: "block", flexShrink: 0, marginTop: 3, animation: act.pulse ? "pulse 2s infinite" : "none" }} />
            <div><div style={{ fontSize: 14, fontWeight: 700, color: act.color }}>{act.label}</div><div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>Based on shift ({rec.shift}) and login. Cannot be set manually.</div></div>
          </div>
          <div style={{ fontSize: 13, color: "#374151", display: "flex", flexDirection: "column", gap: 6 }}>
            {[["📊 Total", rec.total],["✅ Replied", rec.replied],["⏳ Pending", rec.pending],["🕐 Last active", rec.lastActive]].map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between" }}><span>{k}</span><strong style={{ color: k.includes("Pending") && rec.pending > 5 ? "#b91c1c" : "#0f172a" }}>{v}</strong></div>)}
          </div>
          <div className="info-box">⚡ AI pre-screened all applications and ranked by semantic match. Shortlist ready.</div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>Select Job</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{jobs.map(j => <button key={j.id} className={`pb-preset ${selId === j.id ? "on" : ""}`} onClick={() => setSelId(j.id)}>{j.title} · {j.company}</button>)}</div>
      </div>

      {selJob && (<>
        {showBuilder ? (
          <PipelineBuilder init={selJob.pipeline} onSave={p => { setJobs(prev => prev.map(j => j.id === selId ? { ...j, pipeline: p } : j)); setShowBuilder(false); showToast("Pipeline updated — candidate trackers updated automatically"); }} onCancel={() => setShowBuilder(false)} />
        ) : (
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Pipeline — {selJob.title}</div>
              <button className="btn s sm" onClick={() => setShowBuilder(true)}>✏️ Edit Pipeline</button>
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>{stages.map((s, i) => (<div key={s.id} style={{ display: "flex", alignItems: "center", gap: 7 }}>{i > 0 && <span style={{ color: "#bfdbfe" }}>→</span>}<span className="pip-chip">{s.icon} {s.label}</span></div>))}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Edit anytime — candidate trackers update automatically.</div>
          </div>
        )}

        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Candidate Pipeline</div>
            <span className="pill blue">{cands.length} candidates</span>
          </div>
          {cands.map(c => {
            const sl = c.rej ? "Rejected" : stages[c.stage]?.label || "Applied";
            return (
              <div key={c.id} className="cand-row">
                <div className="cand-av">{c.av}</div>
                <div className="cand-info"><div className="cand-name">{c.name}</div><div className="cand-sub">{c.exp}</div></div>
                <span className="cand-score-chip">AI: {c.score}%</span>
                <span className={`pill ${stagePillCls(sl)}`}>{sl}</span>
                <select className="update-select" value={c.rej ? "rej" : c.stage} onChange={e => { const v = e.target.value; setCands(p => p.map(x => x.id === c.id ? { ...x, stage: v === "rej" ? x.stage : parseInt(v), rej: v === "rej" } : x)); showToast(`${c.name} moved to ${v === "rej" ? "Rejected" : stages[parseInt(v)]?.label}`); }}>
                  {stages.map((s, i) => <option key={i} value={i}>{s.icon} {s.label}</option>)}
                  <option value="rej">❌ Reject</option>
                </select>
              </div>
            );
          })}
          <div className="info-box">Updating stage here instantly updates the candidate's application tracker.</div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>Assignment Reviews Pending</div>
          {cands.filter(c => c.submitted && !c.rej).map(c => (
            <div key={c.id} className="cand-row">
              <div className="cand-av">{c.av}</div>
              <div className="cand-info"><div className="cand-name">{c.name}</div><div className="cand-sub">{c.submitted}</div></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn green sm" onClick={() => { setCands(p => p.map(x => x.id === c.id ? { ...x, stage: c.stage + 1 } : x)); showToast(`${c.name} moved to ${stages[c.stage + 1]?.label}`); }}>✓ Move to {stages[c.stage + 1]?.label}</button>
                <button className="btn red-o sm" onClick={() => { setCands(p => p.map(x => x.id === c.id ? { ...x, rej: true } : x)); showToast(`${c.name} rejected`); }}>✕ Reject</button>
              </div>
            </div>
          ))}
          <div className="warn-box">⚠️ Respond within 5 days. Delays are tracked in your public response score.</div>
        </div>
      </>)}
    </div>
  );
}

// ── ADDITIONS MARKER (features 1-10 injected below App export) ──
