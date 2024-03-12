import React, {useState, useEffect} from "react"
import BarLoader from "react-spinners/BarLoader"

const AnalyseCaseStudy = ({setCaseStudyString, baseUrl, caseStudyString}) => {
  const [role, setRole] = useState("")
  const [loadingRole, setLoadingRole] = useState(false)
  const [disableAnalysis, setDisableAnalysis] = useState(false)

  const handleRoleIdentification = async () => {
    setDisableAnalysis(true)
    setLoadingRole(true)
    try {
      const res = await fetch(`${baseUrl}/analyse`, {
        method: "POST",
        body: JSON.stringify({"caseStudy": caseStudyString})
      })
      const json = await res.json()
      setRole(json["role"])
    } catch {
      setDisableAnalysis(false)
      setLoadingCaseStudy(false)
      console.log("error analysing case study")
    }
  }

  useEffect(() => {
    if (role) {
      setLoadingRole(false)
      setDisableAnalysis(false)
    }
  }, [role])

  return (
    <>
      <h1>Analyse Case Study</h1>
      <textarea value={caseStudyString} onChange={(e) => setCaseStudyString(e.target.value)} placeholder="Enter case study..." style={{width: "90vw", height: "50vh"}} disabled={disableAnalysis}></textarea>
      <button style={{paddingInline: "50px", paddingBlock: "10px", marginInline: "25%"}} onClick={handleRoleIdentification} disabled={disableAnalysis}>Identify Role</button>
      <BarLoader
        color={"#ffffff"}
        loading={loadingRole}
      />
      {role && <>
        <p style={{border: "2px solid azure", padding: "10px", borderRadius: "12px"}}>{role}</p>
        </>}
    </>
  )
}

export default AnalyseCaseStudy