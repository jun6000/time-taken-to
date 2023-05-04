#! /usr/bin/env node

import { performance } from "perf_hooks";
import { exec } from "child_process";
import { program } from "commander";

// Get command-line options and arguments

program
    .option("-r, --round-to <count>", "Round the result to <count> digits.");

program.parse(process.argv);

// Handle options

const opts = program.opts();

if (opts.roundTo) {
    const roundTo = opts.roundTo;

    if (/[^0-9]/.test(roundTo) || parseFloat(roundTo) > 15)
        program.error(`error: option '-r, --round-to <count>' argument invalid (whole numbers <=15 only)`);
}

// Handle command to test

const cmd = program.args.join(' ');

if (!cmd) {
    console.error(`error: Specify a command as command-line argument to measure its execution time`);
    process.exit(0);
}

// Measure execution time

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
        console.log(`Time taken: ${ parseFloat((execTime / 1000).toFixed(opts.roundTo ? opts.roundTo : 6)) } s`);
    else
        console.log(`Time taken: ${ parseFloat(execTime.toFixed(opts.roundTo ? opts.roundTo : 6)) } ms`);
});