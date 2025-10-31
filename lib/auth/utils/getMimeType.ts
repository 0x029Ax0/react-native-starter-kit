export const getExtension = (uri: string): string | undefined => {
    return uri.split('.').pop()?.toLowerCase();
}

export const getMimeType = (uri: string): string => {
    const extension = getExtension(uri);
    switch (extension) {
    case 'jpg':
    case 'jpeg':
        return 'image/jpeg';
    case 'png':
        return 'image/png';
    case 'gif':
        return 'image/gif';
    case 'webp':
        return 'image/webp';
    default:
        return 'image/jpeg'; // fallback
    }
};