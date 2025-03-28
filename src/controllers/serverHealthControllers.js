const os = require("os");


const getHealth =  (req, res) => {
    const cpuLoad = os.loadavg()[0];  // 1-minute CPU load
    const freeMem = os.freemem();  // Free memory in bytes
    const totalMem = os.totalmem();
    const memUsage = ((totalMem - freeMem) / totalMem) * 100;
    
    res.json({
        cpu: cpuLoad.toFixed(2),
        memoryUsage: memUsage.toFixed(2),
        freeMemory: (freeMem / 1024 / 1024).toFixed(2) + " MB",
        timestamp: new Date()
    });
}


module.exports = getHealth;
