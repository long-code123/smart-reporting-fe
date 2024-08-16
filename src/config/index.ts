const API_ENDPOINT = process.env.API_ENDPOINT

export const getMainApi = () => {
    const API = API_ENDPOINT
    const c = (path = '') => API + path
    return {
        resource: c('/resources'),
        project: c('/projects'),
    }
}
