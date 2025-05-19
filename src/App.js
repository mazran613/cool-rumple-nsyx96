import React, { useState } from "react";

const groupedConditions = {
  "Cardiovascular Disease": [
    { id: "cad", label: "CAD / History MI" },
    { id: "arrhythmia", label: "Arrhythmia" },
    { id: "chf", label: "CHF" },
    { id: "valvular", label: "Valvular Disease" },
    { id: "pe", label: "Pulmonary Embolism" },
    { id: "phtn", label: "Pulmonary Hypertension" },
    { id: "pacemaker", label: "Pacemaker / ICD" },
    { id: "stroke", label: "Stroke / TIA" },
  ],
  "Pulmonary Disease": [
    { id: "copd", label: "COPD" },
    { id: "osa", label: "OSA" },
  ],
  "Renal Disease": [
    { id: "esrd", label: "ESRD" },
    { id: "ckd", label: "CKD" },
  ],
  "Other Comorbidities": [
    { id: "htn", label: "Hypertension" },
    { id: "dm", label: "Diabetes" },
    { id: "liver", label: "Liver Disease" },
    { id: "alcohol", label: "Alcohol Abuse" },
    { id: "bleeding", label: "Bleeding Disorder" },
    { id: "anemia", label: "Anemia" },
    { id: "menstruating", label: "Menstruating Female" },
  ],
  "Pre-Op Medications": [
    { id: "glp1", label: "GLP-1 Agonists" },
    { id: "sglt2", label: "SGLT-2 Inhibitors" },
    { id: "anticoagulants", label: "Anticoagulants" },
    { id: "diuretics", label: "Diuretics / ACEi / ARBs" },
    { id: "digoxin", label: "Digoxin" },
    { id: "chemotherapy", label: "Chemotherapy" },
  ],
};

const surgicalSpecialties = {
  ENT: {
    low: [
      "Tonsillectomy +/- Adenoidectomy",
      "Septoplasty",
      "Myringotomy with or without tubes",
      "Inspire Implant",
      "Cochlear Implant",
      "Rhinoplasty",
      "Dental Procedures",
      "Thyroidectomy",
      "Laryngeal biopsy",
      "Endoscopic sinus surgery",
    ],
    high: ["Laryngectomy", "Neck dissection / large mass excision"],
  },
  "General Surgery": {
    low: [
      "Lumpectomy",
      "Hemorrhoidectomy",
      "Port Insertion",
      "Appendectomy",
      "Inguinal Hernia Repair",
      "Umbilical Hernia Repair",
      "Lap chole",
      "EUA",
    ],
    high: [
      "Mastectomy with flap",
      "Colectomy",
      "Small bowel resection",
      "Gastrectomy",
      "Pancreatectomy",
      "Hepatectomy",
      "Open chole",
      "Large open ventral hernia repair",
      "Adrenalectomy",
      "Abdominal mass resection",
    ],
  },
  Gynecology: {
    low: [
      "D&C",
      "Hysteroscopy",
      "Diagnostic laparoscopy",
      "Transvaginal pelvic floor repair",
      "Endometrial ablation",
      "Tubal ligation",
      "Laparoscopic endometriosis",
    ],
    high: [
      "Hysterectomy",
      "Laparotomy with pelvic dissection",
      "Abdominal pelvic floor surgery",
      "Abdominal myomectomy",
    ],
  },
  Ophthalmology: {
    low: [
      "Cataract surgery",
      "Pterygium excision",
      "Glaucoma laser treatment",
      "Strabismus surgery",
      "Blepharoplasty",
    ],
    high: [],
  },
  "Orthopedic Surgery": {
    low: [
      "Carpal tunnel release",
      "Knee arthroscopy",
      "Trigger finger release",
      "Routine hardware removal",
    ],
    high: [
      "Total hip arthroplasty",
      "Total knee arthroplasty",
      "Hardware removal with infection",
    ],
  },
  Neurosurgery: {
    low: [
      "Spine surgery 1-2 level",
      "DBS generator placement",
      "Spinal cord stimulator placement",
    ],
    high: [
      "Craniotomy",
      "Pituitary surgery",
      "Spine surgery greater than 2 levels",
      "DBS fiduciary leads",
    ],
  },
  "Plastic Surgery": {
    low: [
      "Cosmetic breast surgery",
      "Tendon surgery",
      "Reduction mammoplasty",
      "Simple skin excision",
      "Scar revision",
    ],
    high: [
      "Free flap reconstruction",
      "DIEP flap",
      "Panniculectomy",
      "Abdominoplasty",
    ],
  },
  "Thoracic Surgery": {
    low: ["Bronchoscopy"],
    high: [
      "Ebus with biopsy",
      "Mediastinoscopy",
      "Hiatal hernia repair",
      "Esophagectomy",
      "Thoracotomy",
      "VATS",
      "Lung resection",
    ],
  },
  "Vascular Surgery": {
    low: ["AV fistula", "Vascular access", "Vein stripping", "Angioplasty"],
    high: [
      "Amputation",
      "EVAR",
      "Carotid surgery",
      "Peripheral bypass",
      "Open aortic surgery",
    ],
  },
  Urology: {
    low: [
      "Cystoscopy",
      "Ureteroscopy",
      "Orchiopexy",
      "Hydrocelectomy",
      "Varicocelectomy",
      "Circumcision",
    ],
    high: ["TURP", "Prostatectomy", "Bladder resection", "Kidney resection"],
  },
  "Pain Procedures": {
    low: [
      "Intrathecal pain pump",
      "Spinal cord stimulator trial",
      "Spinal cord stimulator implant",
      "Epidural steroid injections",
      "Facet injections",
      "Trigger point injections",
    ],
    high: [],
  },
};

export default function App() {
  const [selectedConditions, setSelectedConditions] = useState({});
  const [specialty, setSpecialty] = useState("");
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [output, setOutput] = useState("");

  const toggleCondition = (id) => {
    setSelectedConditions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const generateRecommendations = () => {
    const recs = new Set();
    const c = selectedConditions;

    const hasMajorCardiac =
      c.cad || c.arrhythmia || c.chf || c.valvular || c.pe || c.phtn;
    if (hasMajorCardiac) {
      recs.add("- EKG within 6 months");
      recs.add(
        "- Cardiac Evaluation within 12 months for stable disease or within 30 days for unstable disease"
      );
      recs.add("- Echocardiogram within 12 months");
      recs.add("- CBC within 30 days");
      recs.add("- BMP within 30 days");
    }
    if (c.pacemaker) {
      if (!hasMajorCardiac) {
        recs.add("- EKG, Cardiac Eval");
      }
      recs.add("- CBC within 30 days");
      recs.add("- BMP within 30 days");
      recs.add("- Obtain interrogation report within 12 months");
    }
    if (c.cad) {
      recs.add("- Delay surgery 2 months post-ACS, 12 months if DES placed");
    }
    if (c.stroke) {
      recs.add("- EKG within 6 months");
      recs.add("- Delay surgery 6–9 months post acute event");
      recs.add(
        "- Consider neurology consult within 30 days for CVA within past 12 months"
      );
      recs.add(
        "- Consider cardiac evaluation within 30 days for CVA within past 12 months, poor functional status or high-risk surgery"
      );
    }
    if (c.copd) {
      recs.add("- EKG within 6 months");
      recs.add(
        "- Pulmonary consult and chest X-ray if recent acute changes or symptoms of active lower respiratory infection"
      );
    }
    if (c.osa) {
      recs.add("- EKG within 6 months");
      recs.add(
        "- Encourage patient to bring CPAP device to hospital on day of surgery"
      );
    }
    if (c.esrd || c.ckd) {
      recs.add("- CBC within 30 days");
      recs.add("- BMP within 30 days");
      if (c.esrd) {
        recs.add("- Potassium AM of surgery");
      }
    }
    if (c.htn || c.dm || c.ckd || c.esrd) {
      recs.add("- EKG within 6 months");
    }
    if (c.htn) {
      recs.add(
        "- Continue antihypertensives (except hold ACE-i/ARB day of surgery)"
      );
    }
    if (c.dm) {
      recs.add("- BMP within 30 days");
      recs.add("- Hold oral anti-hyperglycemic meds day of surgery");
      recs.add("- POC glucose AM of surgery");
    }
    if (c.liver || c.alcohol) {
      recs.add("- CBC within 30 days");
      recs.add("- BMP within 30 days");
      recs.add("- LFTs within 30 days");
      recs.add("- Coags within 30 days");
    }
    if (c.bleeding) {
      recs.add("- CBC within 30 days");
      recs.add("- Coags within 30 days");
    }
    if (c.anemia) {
      recs.add("- CBC within 30 days");
    }
    if (c.menstruating) {
      recs.add("- HCG within 7 days of surgery");
    }
    if (c.glp1) {
      recs.add("- Hold GLP-1 agonist 1 week prior");
      recs.add("  - If not held: clear liquids day before, NPO after midnight");
      recs.add("  - No ERAS beverages the morning of surgery");
    }
    if (c.sglt2) {
      recs.add("- Hold SGLT-2 inhibitor 3 days prior to surgery");
    }
    if (c.anticoagulants) {
      recs.add("- Review anticoagulation plan and timing of last dose");
      recs.add("- Coags within 30 days");
    }
    if (c.diuretics) {
      recs.add("- BMP within 30 days");
      recs.add("- Evaluate volume status preoperatively");
    }
    if (c.digoxin) {
      recs.add("- EKG within 6 months");
      recs.add("- BMP within 30 days");
      recs.add("- Consider checking digoxin level");
    }
    if (c.chemotherapy) {
      recs.add("- Coordinate with oncology");
      recs.add("- CBC within 30 days");
      recs.add(
        "- Echocardiogram within 12 months if doxorubicin administered as part of regimen"
      );
    }

    if (selectedProcedures.length > 0) {
      selectedProcedures.forEach((proc) =>
        recs.add(`- Selected Procedure: ${proc}`)
      );
      const isHighRisk = selectedProcedures.some((proc) =>
        surgicalSpecialties[specialty]?.high.includes(proc)
      );
      if (isHighRisk) {
        recs.add("- EKG within 6 months");
        recs.add("- CBC within 30 days");
        if (specialty === "Vascular Surgery") {
          recs.add("- BMP within 30 days");
        }
        recs.add("- This is considered a high-risk procedure");
      } else {
        recs.add(
          "- This is a low-risk procedure: minimal testing needed unless comorbidities present"
        );
      }
    }

    const finalOutput = Array.from(recs);
    finalOutput.unshift("- H&P within 30 days");
    setOutput(finalOutput.join("\n"));
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: 900,
        margin: "auto",
        padding: 20,
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        Holy Cross Preoperative Laboratory and Diagnostic Testing Tool
      </h1>

      <section
        style={{
          border: "1px solid #ccc",
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        {Object.entries(groupedConditions).map(([section, items]) => (
          <div key={section} style={{ marginBottom: 20 }}>
            <h2
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: 5,
                marginBottom: 10,
              }}
            >
              {section}
            </h2>
            {items.map(({ id, label }) => (
              <label
                key={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 6,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!selectedConditions[id]}
                  onChange={() => toggleCondition(id)}
                  style={{ marginRight: 8 }}
                />
                {label}
              </label>
            ))}
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 20 }}>
        <label
          htmlFor="specialty"
          style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
        >
          Select Surgical Specialty:
        </label>
        <select
          id="specialty"
          value={specialty}
          onChange={(e) => {
            setSpecialty(e.target.value);
            setSelectedProcedures([]);
          }}
          style={{ width: "100%", padding: 8, fontSize: 16 }}
        >
          <option value="">-- Choose a specialty --</option>
          {Object.keys(surgicalSpecialties).map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </section>

      {specialty && (
        <section style={{ display: "flex", gap: 40, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: "green", marginBottom: 10 }}>
              Low-Risk Procedures
            </h3>
            {surgicalSpecialties[specialty].low.map((proc) => (
              <label
                key={proc}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 6,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedProcedures.includes(proc)}
                  onChange={() =>
                    setSelectedProcedures((prev) =>
                      prev.includes(proc)
                        ? prev.filter((p) => p !== proc)
                        : [...prev, proc]
                    )
                  }
                  style={{ marginRight: 8 }}
                />
                {proc}
              </label>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: "red", marginBottom: 10 }}>
              High-Risk Procedures
            </h3>
            {surgicalSpecialties[specialty].high.map((proc) => (
              <label
                key={proc}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 6,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedProcedures.includes(proc)}
                  onChange={() =>
                    setSelectedProcedures((prev) =>
                      prev.includes(proc)
                        ? prev.filter((p) => p !== proc)
                        : [...prev, proc]
                    )
                  }
                  style={{ marginRight: 8 }}
                />
                {proc}
              </label>
            ))}
          </div>
        </section>
      )}

      <button
        onClick={generateRecommendations}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer",
          borderRadius: 5,
        }}
      >
        Generate Recommendations
      </button>

      {output && (
        <section
          style={{
            marginTop: 20,
            whiteSpace: "pre-wrap",
            border: "1px solid #ccc",
            padding: 15,
            borderRadius: 8,
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Recommendations:</h2>
          <div>{output}</div>
        </section>
      )}
    </div>
  );
}
