'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FormValues as UserProfile } from '@/app/page';

export type TestResult = {
    id: string;
    date: string;
    hemoglobin: number;
    glucose: number;
    crp: number;
};

export type BiomarkerStatus = 'Normal' | 'At Risk' | 'Needs Attention';

type AppState = {
    userProfile: UserProfile | null;
    testHistory: TestResult[];
    addTestResult: (result: Omit<TestResult, 'id' | 'date'>) => void;
    setUserProfile: (profile: UserProfile) => void;
    getBiomarkerStatus: (biomarker: keyof Omit<TestResult, 'id' | 'date'>, value: number) => BiomarkerStatus;
};

const AppContext = createContext<AppState | undefined>(undefined);

// Reference ranges - these could be moved to a config file
const referenceRanges = {
    hemoglobin: { normal: [12.0, 15.5], atRisk: [11.0, 11.9] }, // g/dL
    glucose: { normal: [70, 99], atRisk: [100, 125] }, // mg/dL
    crp: { normal: [0, 3.0], atRisk: [3.1, 10.0] }, // mg/L
};

const getBiomarkerStatus = (biomarker: keyof typeof referenceRanges, value: number): BiomarkerStatus => {
    const ranges = referenceRanges[biomarker];
    if (biomarker === 'crp') {
        if (value <= ranges.normal[1]) return 'Normal';
        if (value <= ranges.atRisk[1]) return 'At Risk';
        return 'Needs Attention';
    } else {
        if (value >= ranges.normal[0] && value <= ranges.normal[1]) return 'Normal';
        if (value >= ranges.atRisk[0] && value < ranges.normal[0]) return 'At Risk';
        return 'Needs Attention';
    }
};

const initialTestHistory: TestResult[] = [
    { id: '1', date: '2023-10-26', hemoglobin: 13.5, glucose: 98, crp: 1.2 },
    { id: '2', date: '2023-10-19', hemoglobin: 12.8, glucose: 115, crp: 2.5 },
    { id: '3', date: '2023-10-12', hemoglobin: 11.9, glucose: 125, crp: 4.2 },
    { id: '4', date: '2023-10-05', hemoglobin: 13.2, glucose: 95, crp: 0.9 },
];


export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
    const [testHistory, setTestHistory] = useState<TestResult[]>(initialTestHistory);

    useEffect(() => {
        try {
            const storedProfile = localStorage.getItem('userProfile');
            if (storedProfile) {
                setUserProfileState(JSON.parse(storedProfile));
            }
            const storedHistory = localStorage.getItem('testHistory');
            if (storedHistory) {
                setTestHistory(JSON.parse(storedHistory));
            } else {
                setTestHistory(initialTestHistory)
            }
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const setUserProfile = (profile: UserProfile) => {
        setUserProfileState(profile);
        localStorage.setItem('userProfile', JSON.stringify(profile));
    };

    const addTestResult = (result: Omit<TestResult, 'id'| 'date'>) => {
        const newResult: TestResult = {
            ...result,
            id: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0],
        };
        const updatedHistory = [newResult, ...testHistory];
        setTestHistory(updatedHistory);
        localStorage.setItem('testHistory', JSON.stringify(updatedHistory));
    };

    return (
        <AppContext.Provider value={{ userProfile, testHistory, addTestResult, setUserProfile, getBiomarkerStatus }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
