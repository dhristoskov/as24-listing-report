import path from 'path';

export const createFilePath = (dir: string): string => {
    return path.join(__dirname, '../data', dir);
}