import React from "react";
import { useState } from "react";
import { DropdownList, JobList, MessageBox } from "../components";
import { useStaticData } from "../context/StaticDataProvider";
import { Job } from "../static/types";
import { mapDropdownSkills, mapDropdownStates } from "../static/utils";
import axios from "axios";


function orderJobs(job1: Job, job2: Job): number {
    // Higher compatibility scores first
    if (job1.score > job2.score) {
        return -1;
    } else if (job1.score < job2.score) {
        return 1;
    }

    // Then higher salaries first
    if (job1.minSalary > job2.minSalary) {
        return -1;
    } else if (job1.minSalary < job2.minSalary) {
        return 1;
    }

    // Then alphabetical
    if (job1.title > job2.title) {
        return 1;
    } else if (job1.title < job2.title) {
        return -1;
    } else {
        return 0;
    }
}


interface JobSearchFormProps {
    onSubmit: (
        location: number[], education: string,
        experience: number, skills: number[]
    ) => void
};

function JobSearchForm({ onSubmit }: JobSearchFormProps) {
    // Get static data (states, education levels, and skills)
    const staticData = useStaticData();
    const locationValues = staticData.states;
    const educationValues = staticData.eduLevels;
    const skillValues = staticData.skills;
    const experienceValues = staticData.experience;

    // State variables
    const [locations, setLocations] = useState([-1]);
    const [education, setEducation] = useState("none");
    const [experience, setExperience] = useState(0);
    const [skills, setSkills] = useState([-1]);

    // Event handlers
    function handleSubmit(event: React.FormEvent): void {
        event.preventDefault();
        onSubmit(locations, education, experience, skills);
    }

    function handleSkillDropdownChange(index: number, id: number): void {
        // Copy list of dropdown selections
        const updatedSkills = [...skills];
        // Update dropdown list at index of changed dropdown
        updatedSkills[index] = id;
        // Update dropdown state variable with new list
        setSkills(updatedSkills);
    }

    function handleRemoveSkillDropdown(index: number): void {
        // Remove the skill at the selected index
        setSkills(skills.filter((_, i) => i !== index));
    }

    function handleStateDropdownChange(index: number, id: number): void {
        const updatedLocations = [...locations];
        updatedLocations[index] = id;
        setLocations(updatedLocations);
    }

    function handleRemoveStateDropdown(index: number): void {
        setLocations(locations.filter((_, i) => i !== index));
    }

    // Create dropdown options
    const educationOptions = educationValues.map(edu =>
        <option key={edu.value} value={edu.value}>{edu.level}</option>
    );

    const experienceOptions = experienceValues.map(exp =>
        <option key={exp.id} value={exp.id}>{exp.years}</option>
    );

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <p>States:</p>
                    <DropdownList 
                        values={mapDropdownStates(locationValues)}
                        selections={locations}
                        categories={false}
                        onChange={handleStateDropdownChange}
                        onRemove={handleRemoveStateDropdown}/>
            </label>

            <label>
                <p>Education level:</p>
                <select
                    required
                    value={education}
                    onChange={e => {
                        e.preventDefault();
                        setEducation(e.currentTarget.value);
                    }}>
                    <option disabled key={-1} value={"none"}>
                        Select an education level
                    </option>
                    {educationOptions}
                </select>
            </label>

            <label>
                <p>Years of experience:</p>
                <select
                    required
                    value={experience}
                    onChange={e => {
                        e.preventDefault();
                        setExperience(Number(e.currentTarget.value));
                    }}>
                    {experienceOptions}
                </select>
            </label>
            
            <label>
                <p>Skills:</p>
                <DropdownList 
                    values={mapDropdownSkills(skillValues)}
                    selections={skills}
                    categories={true}
                    onChange={handleSkillDropdownChange}
                    onRemove={handleRemoveSkillDropdown}/>
            </label>
            <div>
                <button type="submit">Search jobs</button>
            </div>
        </form>
    )
}


function JobSearch() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [error, setError] = useState("");

    function handleJobSearch(locations: number[], education: string,
        experience: number, skills: number[]): void {
        // Reset error message box
        setError("");

        // Filter out empty location and skill dropboxes
        locations = locations.filter(loc => loc !== -1);
        skills = skills.filter(skill => skill !== -1);

        console.log("Locations: " + locations 
            + "\nEducation: " + education + "\nExperience: "
            + experience + "\nSkills: " + skills);

        // Set resulting jobs by retrieving job data from the back-end
        setJobs([]);

        if (locations.length === 0) {
            setError("You must select a location.");
            return;
        } else if (education === "none") {
            setError("You must select an education level.");
            return;
        }

        const params = {
            stateID: locations,
            education: education,
            yearsExperience: experience,
            skills: skills
        };

        const headers = {
            "Content-Type": "application/json"
        };

        axios.get("http://127.0.0.1:8000/api/job-search/", {params: params, headers: headers})
        .then((res) => {
            const jobData: Job[] = res.data.jobs;
            // Sort job data in decreasing order by compatibility score
            jobData.sort(orderJobs);
            setJobs(jobData);
        })
        .catch((err) => console.log(err));
    }

    return (
        <div>
            <h1>Search jobs</h1>
            {error !== "" && <MessageBox type={"error"} text={error}/>}
            <JobSearchForm onSubmit={handleJobSearch} />
            { jobs.length === 0 ?
                <></>
            :
                <JobList jobs={jobs} />
            }
        </div>
    )
}

export default JobSearch;
