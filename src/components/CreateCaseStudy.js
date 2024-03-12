import React, {useState, useEffect} from 'react'
import BarLoader from "react-spinners/BarLoader";

const CreateCaseStudy = ({ setCaseStudyString, baseUrl}) => {
  const [lens, setLens] = useState('Software / Hardware Engineering')
  const [caseStudy, setCaseStudy] = useState("")
  const [loadingCaseStudy, setLoadingCaseStudy] = useState(false)
  const [disableCreate, setDisableCreate] = useState(false)

  const handleCreateCaseStudy = async () => {
    setDisableCreate(true)
    setLoadingCaseStudy(true)
    try {
      const res = await fetch(`${baseUrl}/case-study?lens=${encodeURI(lens)}`)
      const json = await res.json()
      setCaseStudy(json)
      setCaseStudyString(json["introduction"] + " " + json["goal"] + " " + json["solution"] + " " + json["conclusion"])
    } catch {
      setDisableCreate(false)
      setLoadingCaseStudy(false)
      console.log("error fetching case study")
    }
  }

  const handleResetCreate = () => {
    setCaseStudy("")
    setDisableCreate(false)
  }

  useEffect(() => {
    if (caseStudy) {
      setLoadingCaseStudy(false)
    }
  }, [caseStudy])

  return (
    <>
      <h1 style={{textAlign: "center"}}>Apollo Case Study</h1>
        <div>
          <div style={{display: "flex", justifyContent: "space-evenly", height: "25vh", flexDirection: "column", alignContent: "center"}}>
            <p style={{textAlign: "center"}}>Select a lens for the case study</p>
            <select
              value={lens}
              onChange={(e) => {
                setLens(e.target.value);
              }}
              style={{paddingInline: "50px", paddingBlock: "10px"}}
              disabled={disableCreate}
            >
              <option value="Software / Hardware Engineering">Software / Hardware Engineering</option>
              <option value="Project Management">Project Management</option>
              <option value="General Management">General Management</option>
              <option value="Finance / Financial Controller">Finance / Financial Controller</option>
            </select>

            <button style={{paddingInline: "50px", paddingBlock: "10px"}} onClick={handleCreateCaseStudy} disabled={disableCreate}>Create</button>
          </div>
        </div>
        <BarLoader
          color={"#ffffff"}
          loading={loadingCaseStudy}
        />
        {caseStudy &&
          <div style={{display: "flex", justifyContent: "space-evenly", flexDirection: "column", minHeight: "100vh", textAlign: "center"}}>
            <button style={{paddingInline: "50px", paddingBlock: "10px", marginInline: "25%"}} onClick={handleResetCreate}>Start Again</button>
            <div id="caseStudy" style={{border: "2px solid azure", padding: "10px", borderRadius: "12px"}}>
              <h2>Introduction</h2>
              <p>This case study is looking at the {lens.toLowerCase()} aspects of the Apollo program.</p>
              <p>{caseStudy["introduction"]}</p>
              <h2>Objectives / Goals</h2>
              <p>{caseStudy["goal"]}</p>
              <h2>Approach / Solution</h2>
              <p>{caseStudy["solution"]}</p>
              <h2>Conclusion</h2>
              <p>{caseStudy["conclusion"]}</p>
            </div>
          
          </div>
        }
        <div style={{display: "flex", justifyContent: "space-evenly", height: "25vh", flexDirection: "column", textAlign: "center"}}>
          <h3>References</h3>
          <p><a href="https://en.wikipedia.org/wiki/Apollo_program">Wikipedia</a></p>
          <p><a href="https://www.nasa.gov/wp-content/uploads/2023/04/sp-4029.pdf">Apollo By The Numbers</a></p>
          <p><a href="https://ntrs.nasa.gov/api/citations/19750013242/downloads/19750013242.pdf">Apollo Program Summary Report</a></p>
          <p><a href="https://ntrs.nasa.gov/api/citations/20040084534/downloads/20040084534.pdf">Apollo Retrospective</a></p>
          <p><a href="https://wdhb.com/wp-content/uploads/2021/05/Exploring-a-New-Frontier.pdf">Exploring A New Frontier</a></p>
        </div>
    </>
  )
}

export default CreateCaseStudy