import mongoos from 'mongoos';
import { getEnvVar } from '../utils/getEnvVar';
export const initMongoDB = async () => {
    try {
        const user = getEnvVar('MONGODB_USER');
        const pwd = getEnvVar('MONGODB_PASSWORD');
        const url = getEnvVar('MONGODB_URL');
        const db = getEnvVar('MONGODB_DB');
        await mongoos.connect(
            `mongodb+srv://${user}:${pvd}@${url}/${db}?`

        )
    }
};
