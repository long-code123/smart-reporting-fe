// projectAPI.ts
import axiosInstance from './axiosConfig';

// Định nghĩa kiểu Project
interface Project {
    _id: string;
    projectName: string;
    status: string;
    leader: string;
    members: string[];
    cost: number;
    progress: number;
    startDate: string;
    endDate: string;
}

// Create
export const createProject = async (projectData: Partial<Project>) => {
    const response = await axiosInstance.post('/projects', projectData);
    return response.data;
};

// Read
export const getProjects = async () => {
    const response = await axiosInstance.get('/projects');
    return response.data;
};

export const getProjectById = async (id: string) => {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data;
};

// Update
export const updateProject = async (id: string, updatedData: Partial<Project>) => {
    const response = await axiosInstance.put(`/projects/${id}`, updatedData);
    return response.data;
};

// Delete
export const deleteProject = async (id: string) => {
    const response = await axiosInstance.delete(`/projects/${id}`);
    return response.data;
};
