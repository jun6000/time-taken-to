#! /usr/bin/env node

import { performance } from "perf_hooks";
import { exec } from "child_process";

const cmd = process.argv.slice(2).join(' ');

if (!cmd) {
    console.error(`Specify a command after "time-taken" to measure its execution time.`);
    process.exit(0);
}

const startTime = performance.now();

exec(cmd, (err, stdout, stderr) => {
    const stopTime = performance.now();

    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(stdout);                        // Log the output if any to stdout

    const execTime = stopTime - startTime;      // Execution time measured in milliseconds

    if (execTime > 999)
        console.log(`Time taken: ${ parseFloat((execTime / 1000).toFixed(6)) } s`);
    else
        console.log(`Time taken: ${ parseFloat(execTime.toFixed(6)) } ms`);
});