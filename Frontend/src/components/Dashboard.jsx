import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function Dashboard({ userEmail }) {
  const [file, setFile] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- ఫైల్ సెలెక్ట్ చేసినప్పుడు హ్యాండిల్ చేయడానికి ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // --- 🚀 BACKEND SCAN ANALYSIS ROUTE INTEGRATION ---
  const runDiagnostics = async () => {
    if (!file) return alert("Please select a medical scan file first!");
    
    setIsAnalyzing(true);
    setScanResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // బ్యాకెండ్ ఆటో-సేవ్ కోసం ఈమెయిల్ ని క్వెరీ పారామీటర్ కింద పంపుతున్నాం
      const currentEmail = userEmail || "client@gmail.com";
      const response = await fetch(`http://127.0.0.1:8000/api/v1/analyze-scan?email=${encodeURIComponent(currentEmail)}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Server communication break.");
      const data = await response.json();
      
      // 1.5 సెకన్లు స్మూత్ లోడర్ యానిమేషన్ కనిపించాక రిజల్ట్ సెట్ అవుతుంది
      setTimeout(() => {
        setScanResult({
          condition: data.condition,
          confidence: data.confidence
        });
        setIsAnalyzing(false);
      }, 1500);

    } catch (error) {
      console.error(error);
      alert("Failed to connect with Medical AI Engine. Check if backend is running.");
      setIsAnalyzing(false);
    }
  };

  // --- 📄 PREMIUM PDF GENERATOR FUNCTION ---
  const downloadPDFReport = () => {
    if (!scanResult) return;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Header Branding
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("HEART DISEASE AI PORTAL", 15, 18);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Clinical Intelligence & Diagnostics System", 15, 25);
    doc.text(`Report Generated On: ${new Date().toLocaleString()}`, 15, 32);

    // Patient Profile Box
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 50, 180, 25, 'FD');
    doc.setTextColor(51, 65, 85);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("PATIENT METRICS SUMMARY", 20, 57);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Authorized Identity/Email: ${userEmail || 'client@gmail.com'}`, 20, 64);
    doc.text("Execution Channel: Local Server Instance (PostgreSQL Stack)", 20, 70);

    // Diagnostic Results
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(1);
    doc.line(15, 85, 195, 85);
    doc.setTextColor(15, 23, 42);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("AI DIAGNOSTIC REPORT RESULTS", 15, 95);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Detected Condition:", 15, 108);
    
    // Condition ని బట్టి టెక్స్ట్ కలర్ మార్చడం
    const isCardio = scanResult.condition.includes("Cardiomegaly");
    if (isCardio) doc.setTextColor(220, 38, 38); // Red
    else doc.setTextColor(16, 185, 129); // Green
    
    doc.setFontSize(12);
    doc.text(scanResult.condition, 55, 108);

    doc.setTextColor(15, 23, 42);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("AI Confidence Score:", 15, 118);
    doc.setTextColor(16, 185, 129);
    doc.text(scanResult.confidence, 55, 118);

    // Clinical Recommendations
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, 130, 195, 130);
    doc.setTextColor(15, 23, 42);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.text("PREVENTIVE CLINICAL SAFETY MATRICES", 15, 140);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    
    let protocols = [
      "1. Limit daily sodium intake thresholds strictly below 2,300 mg.",
      "2. Perform continuous outpatient ambulatory ECG or Echocardiography confirmation tracking.",
      "3. Engage in 30 minutes of low-impact cardiovascular monitoring exercise sessions daily.",
      "4. Immediately triage sudden substernal tightness or acute chest pain to the nearest clinical ward."
    ];

    let yPos = 150;
    protocols.forEach(line => {
      doc.text(line, 15, yPos);
      yPos += 8;
    });

    // Footer Signature
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 250, 195, 250);
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(9);
    doc.text("This is an AI-generated synthesis log. Final validation requires clinical correlation by a certified Medical Doctor.", 15, 258);
    doc.setFont("Helvetica", "bold");
    doc.text("BioGPT Engine Verified", 155, 265);

    doc.save(`Clinical_Report_${userEmail || 'Patient'}.pdf`);
  };

  // కండిషన్ ని బట్టి గ్లో కలర్స్ అప్లై చేయడానికి హెల్పర్ వేరియబుల్స్
  const isCardiomegaly = scanResult?.condition?.includes("Cardiomegaly");

  return (
     <div className="w-full h-full">
      
      {/* LEFT COLUMN: MEDICAL SCAN EVALUATION ENGINE */}
     <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-300 shadow-xl">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              Medical Scan Evaluation Engine
            </h3>
            <span className="text-xs px-2.5 py-1 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700">Role: Patient</span>
          </div>

          {/* Drag & Drop Area Box */}
          <label className="group block border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 bg-zinc-950/60 rounded-xl p-8 text-center cursor-pointer transition-all duration-200">
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            <span className="text-zinc-400 group-hover:text-emerald-400 block text-sm font-medium transition-colors">
              {file ? file.name : "Click to select or drop medical scan image"}
            </span>
            <span className="text-xs text-zinc-600 block mt-1">(Supports JPG, PNG cardiac scan formats)</span>
          </label>

          {/* Run Button */}
          <button
            onClick={runDiagnostics}
            disabled={isAnalyzing || !file}
            className={`w-full mt-4 font-semibold py-3 px-4 rounded-xl text-sm transition-all duration-200 ${
              isAnalyzing || !file
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/20 text-white cursor-pointer active:scale-[0.99]"
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing Medical Matrix...
              </span>
            ) : "Run Diagnostics Engine"}
          </button>
        </div>

        {/* --- PREMIUM DYNAMIC NEON GLOW RESULT BOX --- */}
        {scanResult && (
          <div className={`mt-6 p-6 rounded-xl border transition-all duration-500 bg-zinc-950 shadow-2xl ${
            isCardiomegaly 
              ? "border-red-500/40 shadow-red-500/5 ring-1 ring-red-500/20 animate-[pulse_3s_infinite]" 
              : "border-emerald-500/40 shadow-emerald-500/5 ring-1 ring-emerald-500/20"
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">AI Analytical Diagnostic Results</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/60">
                <span className="text-[11px] text-zinc-500 block mb-0.5">Condition Label</span>
                <span className={`text-sm font-bold block ${isCardiomegaly ? "text-red-400" : "text-emerald-400"}`}>
                  {scanResult.condition}
                </span>
              </div>
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/60">
                <span className="text-[11px] text-zinc-500 block mb-0.5">Confidence Metric</span>
                <span className={`text-sm font-bold block ${isCardiomegaly ? "text-red-400" : "text-emerald-400"}`}>
                  {scanResult.confidence}
                </span>
              </div>
            </div>

            {/* PDF Generate Button inside the glowing results box */}
            <button
              onClick={downloadPDFReport}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-medium py-2.5 px-4 rounded-xl text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              📥 Download PDF Clinical Report
            </button>
          </div>
        )}
      </div>

      
    </div>
  );
}