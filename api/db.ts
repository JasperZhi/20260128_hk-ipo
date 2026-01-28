
import { JSONFilePreset } from 'lowdb/node';
import { User, SystemLog, IPOAnalysis } from '../types';

interface Data {
    users: User[];
    logs: SystemLog[];
    searchHistory: { username: string; analysis: IPOAnalysis }[];
}

const defaultData: Data = { users: [], logs: [], searchHistory: [] };

export const getDb = async () => {
    const db = await JSONFilePreset<Data>('db.json', defaultData);
    return db;
};
