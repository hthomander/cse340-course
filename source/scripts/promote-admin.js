import db from '../models/db.js';
import { promoteUserToAdmin } from '../models/users.js';

const email = process.argv[2] ? process.argv[2].trim() : '';

try {
    if (!email) {
        throw new Error('Provide the email address of an existing user.');
    }

    const user = await promoteUserToAdmin(email);
    if (!user) {
        throw new Error(`No registered user found with email "${email}".`);
    }

    console.log(`Administrator role granted to ${user.name} (${user.email}).`);
} catch (error) {
    console.error(`Unable to grant administrator role: ${error.message}`);
    process.exitCode = 1;
} finally {
    if (typeof db.end === 'function') {
        await db.end();
    } else {
        await db.close();
    }
}
