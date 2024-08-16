// pages/index.tsx
import React from 'react';
import AppLayout from '@/components/layout';
import ProjectTeam from '@/components/ProjectTeam';

export default function Home() {
    return (
        <AppLayout activeMenuKey="/">
            <div>
                <h1>Welcome to the Dashboard</h1>
                {/* Nội dung khác cho trang Home */}
                <ProjectTeam/>
            </div>
        </AppLayout>
    );
}
