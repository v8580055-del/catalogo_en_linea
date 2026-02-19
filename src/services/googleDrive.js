import axios from 'axios';
import { GOOGLE_DRIVE_CONFIG } from '../config';

const API_KEY = GOOGLE_DRIVE_CONFIG.API_KEY;

// Helper to extract clean ID from different URL formats
export const cleanFolderId = (folderId) => {
    let cleanId = folderId;
    if (folderId.includes('folders/')) {
        cleanId = folderId.split('folders/')[1].split('?')[0].split('/')[0];
    } else if (folderId.includes('id=')) {
        cleanId = folderId.split('id=')[1].split('&')[0];
    }
    return cleanId;
};

export const fetchFolderFiles = async (folderId, pageToken = null, pageSize = 12, orderBy = 'name') => {
    if (folderId === 'all' || folderId === 'latest') {
        const isLatest = folderId === 'latest';
        // To avoid 403 Forbidden with API Keys, we fetch folders individually and merge
        const validFolders = GOOGLE_DRIVE_CONFIG.FOLDERS.filter(
            f => f.id !== 'all' && f.id !== 'latest' && !f.id.startsWith('FOLDER_ID_')
        );

        let tokens = {};
        try {
            if (pageToken) tokens = JSON.parse(pageToken);
        } catch (e) {
            console.error("Error parsing pageToken for 'all' category:", e);
        }

        try {
            // Fetch next page for each folder that still has results
            const folderResults = await Promise.all(
                validFolders.map(f => {
                    const folderToken = tokens[f.id] || null;
                    if (pageToken && !folderToken) return Promise.resolve({ files: [], nextPageToken: null });
                    return fetchFolderFiles(f.id, folderToken, isLatest ? 6 : pageSize, isLatest ? 'createdTime desc' : 'name');
                })
            );

            let allFiles = folderResults.flatMap(r => r.files);

            // If fetching latest, sort the combined results again
            if (isLatest) {
                allFiles = allFiles.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime)).slice(0, pageSize);
            }

            // Build the next combined token
            const nextTokens = {};
            let hasMore = false;

            folderResults.forEach((res, idx) => {
                const fId = validFolders[idx].id;
                if (res.nextPageToken) {
                    nextTokens[fId] = res.nextPageToken;
                    hasMore = true;
                }
            });

            return {
                files: allFiles,
                nextPageToken: hasMore ? JSON.stringify(nextTokens) : null
            };
        } catch (error) {
            console.error("Error merging folders:", error);
            return { files: [], nextPageToken: null };
        }
    }

    const cleanId = cleanFolderId(folderId);

    if (cleanId.startsWith('FOLDER_ID_')) {
        return { files: [], nextPageToken: null };
    }

    if (!API_KEY || API_KEY === 'YOUR_GOOGLE_DRIVE_API_KEY') {
        return { files: [], nextPageToken: null };
    }

    try {
        const query = `'${cleanId}' in parents AND mimeType contains 'image/' AND trashed = false`;
        const response = await axios.get(
            `https://www.googleapis.com/drive/v3/files`,
            {
                params: {
                    q: query,
                    fields: 'nextPageToken, files(id, name, thumbnailLink, description, createdTime)',
                    pageSize: pageSize,
                    pageToken: pageToken,
                    orderBy: orderBy,
                    key: API_KEY,
                },
            }
        );

        const files = response.data.files.map(file => ({
            id: file.id,
            name: file.name.split('.')[0],
            description: file.description || '',
            createdTime: file.createdTime,
            // Use high-res thumbnail
            image: file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+$/, '=s1000') : null,
            thumbnail: file.thumbnailLink,
            driveUrl: `https://drive.google.com/open?id=${file.id}`
        }));

        return {
            files,
            nextPageToken: response.data.nextPageToken || null
        };
    } catch (error) {
        console.error('Error fetching files from Google Drive:', error);
        return { files: [], nextPageToken: null };
    }
};

export const uploadFileToDrive = async (accessToken, folderId, file, metadata) => {
    const cleanId = cleanFolderId(folderId);

    // 1. Metadata part
    const fileMetadata = {
        name: metadata.name,
        description: metadata.description,
        parents: [cleanId]
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
    formData.append('file', file);

    try {
        const response = await axios.post(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/related'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error.response?.data || error.message);
        throw error;
    }
};

export const updateFileMetadata = async (accessToken, fileId, metadata) => {
    try {
        const response = await axios.patch(
            `https://www.googleapis.com/drive/v3/files/${fileId}`,
            {
                name: metadata.name,
                description: metadata.description
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating metadata:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteFileFromDrive = async (accessToken, fileId) => {
    try {
        await axios.delete(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return true;
    } catch (error) {
        console.error('Error deleting file:', error.response?.data || error.message);
        throw error;
    }
};
