'use client'
import React, {useState, useEffect} from "react"
import styles from "./page.module.css";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CreateCaseStudy from "@/components/CreateCaseStudy";
import AnalyseCaseStudy from "@/components/AnalyseCaseStudy";

const BASE_URL = "http://localhost:5000"

export default function Home() {
  // State used by both components
  const [tab, setTab] = useState(0)
  const [caseStudyString, setCaseStudyString] = useState("")

  const handleTabChange = (event, newValue) => {
    setTab(newValue)
  }

  const handleCaseStudyChange = (event) => {
    setCaseStudyString(event.target.value)
  }
  return (
    <main>
      <Box sx={{ width: '100%' }}>
        <Box>
          <Tabs value={tab} onChange={handleTabChange} centered >
            <Tab label="Create case study" />
            <Tab label="Analyse case study"/>
          </Tabs>
        </Box>
        <CustomTabPanel tab={tab} index={0}>
          <CreateCaseStudy setCaseStudyString={setCaseStudyString} baseUrl={BASE_URL} />
        </CustomTabPanel>

        <CustomTabPanel tab={tab} index={1}>
          <AnalyseCaseStudy handleCaseStudyChange={handleCaseStudyChange} baseUrl={BASE_URL} caseStudyString={caseStudyString}/>
        </CustomTabPanel>

      </Box>
    </main>
  );
}

function CustomTabPanel(props) {
  const { children, tab, index, ...other } = props;

  return (
    <div {...other}>
      {tab === index && (
        <div className={styles.main}>
          {children}
        </div>
      )}
    </div>
  );
}
