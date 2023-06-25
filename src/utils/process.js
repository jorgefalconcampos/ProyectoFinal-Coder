exports.processFunction = () => {
    console.log("cwd", process.cwd());
    console.log("pid", process.pid);
    console.log("memory", process.memoryUsage());
}