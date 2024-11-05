import SettingsList from '@/components/pages/settings/SettingsList';
import { Setting } from '@prisma/client';

async function fetchSettings(): Promise<Setting[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/setting`, {
        cache: 'no-store',
    });
    if (!response.ok) {
        console.error(response);
        throw new Error('Failed to fetch settings');
    }
    return response.json();
}

export default async function SettingsPage() {
    const settings = await fetchSettings();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-primary">Change the current settings</h1>
            <SettingsList settings={settings} />
        </div>
    );
}