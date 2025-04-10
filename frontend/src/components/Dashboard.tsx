import { useState } from "react";
import { Job, SkillCategory, ChartSkillData, 
    StateDensityData, StateData } from "../static/types";
import { mapDropdownSkills } from "../static/utils";
import { useAuthContext } from "../context/AuthProvider";
import { SkillChart, JobList, DashboardMap, 
    CountyMap, Dropdown } from "../components";
import axiosInstance from "../api/axiosInstance";


const placeholderMapData: StateDensityData = {
    stateData: {
        stateID: 3,
        stateName: "Delaware",
        stateCode: "DE"
    },
    countyData: [
        {countyID: 1, countyName: "Kent", 
            countyFips: "10001", density: 0.2, numJobs: 3},
        {countyID: 2, countyName: "New Castle", 
            countyFips: "10003", density: 0.1, numJobs: 2},
        {countyID: 3, countyName: "Sussex", 
            countyFips: "10005", density: 0.9, numJobs: 27}
    ],
    skillData: {
        skillID: 3,
        skillName: "Python"
    }
};

interface DashboardProps {
    chartData: ChartSkillData,
    jobs: Job[],
    userSkills: SkillCategory[],
    blankMapData: StateData
}

function Dashboard({ chartData, jobs, userSkills, blankMapData }: DashboardProps) {
    const [selected, setSelected] = useState(-1);
    const [mapData, setMapData] = useState<StateDensityData | null>(null);

    const authContext = useAuthContext();
    const user = authContext.user;
    const logoutUser = authContext.logoutUser;

    function handleSkillChange(id: number): void {
        setSelected(id);
        console.log("Changing to skill " + id);

        if (!user) {
            logoutUser();
            return;
        }

        // Call to back-end to get map data for selected skill
        axiosInstance.get("api/get-density-data/", {params: {
            id: user.user_id,
            skill: selected
        }}).then(res => {
            console.log(res.data);
            setMapData(res.data);
        }).catch(err => console.log(err))
    }

    return (
        <div>
            <div>
                <Dropdown 
                    values={mapDropdownSkills(userSkills)}
                    selected={selected}
                    categories={true}
                    onChange={handleSkillChange} />
                {selected !== -1 && mapData != null ? (
                    <DashboardMap stateDensity={placeholderMapData} />
                ) : (
                    <CountyMap stateData={blankMapData} />
                )}
            </div>
            <div style={{ height: "300px" }}>
                <SkillChart title={"test"} skillData={chartData.skills} />
            </div>
            <div>
                <JobList jobs={jobs}/>
            </div>
        </div>
    )
}

export default Dashboard;
