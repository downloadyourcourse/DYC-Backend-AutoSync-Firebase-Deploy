const os = require("os");
const { getRegion, getMongoUri } = require("../config/serverDbUtils")


const getHealth =  (req, res) => {
    const cpuLoad = os.loadavg()[0];  // 1-minute CPU load
    const freeMem = os.freemem();  // Free memory in bytes
    const totalMem = os.totalmem();
    const memUsage = ((totalMem - freeMem) / totalMem) * 100;
    const firebase_function_server_name = process.env.K_SERVICE
    const server_region = getRegion(firebase_function_server_name)
    
    res.json({
        FunctionServerName: firebase_function_server_name,
        serverRegion: server_region,
        cpu: cpuLoad.toFixed(2),
        memoryUsage: memUsage.toFixed(2),
        freeMemory: (freeMem / 1024 / 1024).toFixed(2) + " MB",
        timestamp: new Date()
    });
}


module.exports = getHealth;
