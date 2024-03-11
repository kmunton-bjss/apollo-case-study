'use client'
import React, {useState} from "react"
import styles from "./page.module.css";

export default function Home() {
  const [lens, setLens] = useState('Software / Hardware Engineering')
  const [caseStudy, setCaseStudy] = useState("")

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:5000/case-study?lens=${encodeURI(lens)}`)
    const json = await res.json()
    setCaseStudy(json["text"])
  }

  const handleReset = () => {
    setCaseStudy("")
  }
  return (
    <main className={styles.main}>
      <h1>Create Apollo Case Study</h1>
      <div>
        <div style={{display: "flex", justifyContent: "space-evenly", height: "25vh", flexDirection: "column"}}>
          <p style={{textAlign: "center"}}>Select a lens for the case study</p>
          <select
            value={lens}
            onChange={(e) => {
              setLens(e.target.value);
            }}
            style={{paddingInline: "50px", paddingBlock: "10px"}}
          >
            <option value="Software / Hardware Engineering">Software / Hardware Engineering</option>
            <option value="Project Management">Project Management</option>
            <option value="General Management">General Management</option>
            <option value="Finance / Financial Controller">Finance / Financial Controller</option>
          </select>

          <button style={{paddingInline: "50px", paddingBlock: "10px"}} onClick={handleSubmit}>submit</button>
        </div>
    </div>
    <div id="caseStudy">{caseStudy}</div>
    {caseStudy && <button style={{paddingInline: "50px", paddingBlock: "10px"}} onClick={handleReset}>Reset</button>}
    </main>
  );
}
