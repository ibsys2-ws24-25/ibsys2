'use client';

import { Setting } from "@prisma/client";
import { useEffect, useState } from "react";

interface SettingsListProps {
    settings: Setting[];
}

export default function SettingsList({ settings }: SettingsListProps) {
    const [localSettings, setLocalSettings] = useState<Setting[]>([]);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const updateSetting = async (name: string, value: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/setting/${name}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value }),
        });
    
        if (!response.ok) {
            throw new Error(`Failed to update setting: ${name}`);
        }
    };
    

    const handleInputChange = (name: string, newValue: string) => {
        setLocalSettings((prevSettings) =>
            prevSettings.map((setting) =>
                setting.name === name ? { ...setting, value: newValue } : setting
            )
        );
    };

    const handleSave = async (name: string, value: string) => {
        try {
            await updateSetting(name, value);
            alert(`Setting ${name} updated successfully!`);
        } catch (error) {
            console.error(error);
            alert(`Failed to update setting ${name}`);
        }
    };

    return (
        <div>
            {localSettings.map((setting) => (
                <div key={setting.name} className="mb-4">
                    <label className="block text-lg font-medium mb-1">{setting.name}</label>
                    <input
                        type="text"
                        value={setting.value}
                        onChange={(e) => handleInputChange(setting.name, e.target.value)}
                        className="border border-gray-300 rounded p-2 mb-2 w-full"
                    />
                    <button
                        onClick={() => handleSave(setting.name, setting.value)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
            ))}
        </div>
    );
};