/**
 * This component creates a React context which makes static data (i.e., data
 * which does not change during the course of a user's session) available to
 * all components. This includes education levels, years of experience, U.S.
 * states, and skills, which populate dropdown menus across the website.
 */
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { SkillCategory, State, EducationLevel, Experience } from "../static/types";
import axios from "axios";

const educationValues = [
    {value: "", level: "Less than high school"},
    {value: "high_school", level: "High school diploma"},
    {value: "associate", level: "Associate's degree"},
    {value: "bachelor", level: "Bachelor's degree"},
    {value: "master", level: "Master's degree"},
    {value: "doctorate", level: "Doctorate degree or higher"}
]

function generateExperienceOptions(numOptions: number): Experience[] {
    let experienceOptions = [];
    for (let i = 0; i < numOptions; i++) {
        experienceOptions[i] = {id: i, years: String(i)};
    }
    experienceOptions[numOptions] = {id: numOptions, years: String(numOptions) + "+"};
    return experienceOptions;
}

interface ContextType {
    skills: SkillCategory[],
    eduLevels: EducationLevel[],
    states: State[],
    experience: Experience[]
}

interface StaticDataProviderProps {
    children?: React.ReactNode
}

const StaticDataContext = createContext<ContextType | undefined>(undefined);

export default function StaticDataProvider({ children }: StaticDataProviderProps) {
    const [skills, setSkills] = useState<SkillCategory[]>([]);
    const [states, setStates] = useState<State[]>([]);

    useEffect(() => {
        // Fetch skill and state data from back-end on app load
        let ignore = false;
        setSkills([]);
        setStates([]);

        axios.get("http://127.0.0.1:8000/api/get-static-data/")
        .then(res => {
            if (!ignore) {
                setSkills(res.data.skills);
                setStates(res.data.states);
            }
        });

        return () => {
            ignore = true;
        }
    }, []);

    const data = {
        skills: skills.sort((x, y) => {
            if (x.category < y.category) {
                return -1;
            } else if (x.category > y.category) {
                return 1;
            } else {
                return 0;
            }
        }),
        eduLevels: educationValues,
        states: states,
        experience: generateExperienceOptions(20)
    };

    return (
        <StaticDataContext.Provider value={data}>
            {children}
        </StaticDataContext.Provider>
    )
}

export function useStaticData() {
    const context = useContext(StaticDataContext);
    if (context === undefined) {
        throw new Error("useStaticData must be used within a StaticDataProvider");
    }

    return context
}
