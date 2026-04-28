// const { exec } = require("child_process");
// const { promisify } =  require("util");
// const fs = require("fs");
// const path = require("path");
// const mime = require("mime-types");
// const { PutObjectCommand , S3Client} = require("@aws-sdk/client-s3");


// const execAsync = promisify(exec);

// const s3Client = new S3Client({
//   region: "ap-southeast-2",
//   credentials: {
//     accessKeyId: "AKIA5VJXPQIRY46URRVE",
//     secretAccessKey: "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",
//   },
// });
// const PROJECT_ID = process.env.PROJECT_ID;
// const init = async () => {
//   try {
//     console.log("Executing the script.js");

//     const outDirPath = path.join(__dirname, "output");
//     const distFolderPath = path.join(outDirPath, "dist"); 

//     if (!fs.existsSync(outDirPath)) {
//       console.error(`Output directory not found: ${outDirPath}`);
//       console.error("Expected a build output directory. Create 'output' or update the path in script.js.");
//       return;
//     }

//     await execAsync(`cd ${outDirPath} && npm install && npm run build`);

//     const files = fs.readdirSync(distFolderPath, { recursive: true });

//     for (const file of files) {
//       const filePath = path.join(distFolderPath, file);

//       if (fs.lstatSync(filePath).isDirectory()) continue;

//       const command = new PutObjectCommand({
//         Bucket: "deployforgeproject",
//         Key: `__outputs/${PROJECT_ID}/${file}`,
//         Body: fs.createReadStream(filePath),
//         ContentType: mime.lookup(filePath) || "application/octet-stream",
//       });

//       await s3Client.send(command);

//       console.log("Uploaded:", filePath);
//     }

//   } catch (err) {
//     console.error("Error in init:", err);
//   }
// };
// init();


const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");








// Create S3 client to communicate with AWS

// Project id coming from environment variable
// Each deployment will be stored in a separate folder
const PROJECT_ID = process.env.PROJECT_ID;



const init = async () => {
  console.log("Executing the script.js");
  const outDirPath = path.join(__dirname, "output");
  console.log("📁 Output directory:", outDirPath);

  console.log("📦 Installing dependencies and building project...");

  // Npm run build will give the browser /dist folder
  const p = exec(`cd ${outDirPath} && npm install && npm run build`);

  p.stdout.on("data", function (data) {
    console.log(data.toString());
    // publishLog(data.toString());
  });
  p.stderr.on("data", function (data) {
    console.log("Error :" + data.toString());
    // publishLog(`Error : ${data.toString()}`);
  });
  p.on("close", async function (data) {
    console.log("Build Complete");
    // await publishLog("Build Complete");
    const distFolderPath = path.join(__dirname, "output", "dist");

    if (!fs.existsSync(distFolderPath)) {
      console.error("dist folder not found");
    //   await publishLog("dist folder not found");
      process.exit(1);
    }

    const readDistFolder = fs.readdirSync(distFolderPath, { recursive: true });
    console.log(`📄 Found ${readDistFolder.length} files to upload`);
    // await publishLog(`📄 Found ${readDistFolder.length} files to upload`);

    for (const file of readDistFolder) {
      const filePath = path.join(distFolderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue; // If its a directory then skip it

      console.log("Uploading:", filePath);
    //   await publishLog(`Uploading: ${filePath}`);
      const command = new PutObjectCommand({
        Bucket: "deployforgeproject",
        Key: `__outputs/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath) || "application/octet-stream",
      });

      await s3Client.send(command);
      console.log("Uploaded:", filePath);
    }

    console.log("🎉 Deployment upload completed successfully!");
    process.exit(0);
  });
};

init();