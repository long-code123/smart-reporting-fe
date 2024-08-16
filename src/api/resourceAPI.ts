// resourceAPI.ts
import axiosInstance from './axiosConfig';

// Định nghĩa kiểu Resource
interface Resource {
    _id: string;
    name: string;
    dateOfBirth: string;
    sex: string;
    account: string;
    status: string;
    phoneNumber: string;
    identityCard: string;
    email: string;
    contract: string;
    startDate: string;
    endDate: string;
    projects: string[];
}

// Create
export const createResource = async (resourceData: Partial<Resource>) => {
    const response = await axiosInstance.post('/resources', resourceData);
    return response.data;
};

// Read
export const getResources = async () => {
    const response = await axiosInstance.get('/resources');
    return response.data;
};

export const getResourceById = async (id: string) => {
    const response = await axiosInstance.get(`/resources/${id}`);
    return response.data;
};

// Update
export const updateResource = async (id: string, updatedData: Partial<Resource>) => {
    const response = await axiosInstance.put(`/resources/${id}`, updatedData);
    return response.data;
};

// Delete
export const deleteResource = async (id: string) => {
    const response = await axiosInstance.delete(`/resources/${id}`);
    return response.data;
};
