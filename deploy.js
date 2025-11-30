import * as ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: "ftp.bloomboxanimation.com",
            user: "bloombox_iaev@bloomboxanimation.com", // Trying full username format
            password: "antigravity03A",
            secure: false
        });

        console.log("Connected to FTP server");

        // Upload dist folder to /public_html/iaev/
        await client.ensureDir("/public_html/iaev");
        await client.clearWorkingDir(); // Optional: clear directory before upload

        console.log("Uploading files...");
        await client.uploadFromDir("dist", "/public_html/iaev");

        console.log("Upload completed successfully!");
    } catch (err) {
        console.error("Deployment failed:", err);
    }
    client.close();
}

deploy();
