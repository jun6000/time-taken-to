#! /usr/bin/env node

import { performance } from "node:perf_hooks";
import { exec } from "node:child_process";
import { program } from "commander";
import chalk from "chalk";

// Get command-line options and arguments

program
    .option("-r, --round-to <count>", "Round the result to <count> digits.")
    .option("-s, --show-stdout", "Show stdout from the command being run.")
    .option("-i, --iterations <count>", "Run for <count> iterations and return the average for a more accurate value.")
    .usage(`[options] command_string
       ttt [options] command_string`)
    .description(`Measures time taken to execute the command specified in command_string and displays it.
If not installed globally on system can also be executed using 'npx time-taken-to'.`)
    .addHelpText("after", `
Examples:

    $ ttt ls -s
        This measures the time taken by the "ls" command and displays the stdout.
    
    $ ttt "ls -s"
        This measures the time taken by the "ls -s" command. Enclose the command string in quotes to ensure options are parsed properly.
    
For more information visit the github: https://github.com/jun6000/time-take-to`)
    .version("v1.4.0", "-v, --version", "Display the current version of time-taken-to.")
    .parse(process.argv);

// Handle options

const opts = program.opts();

if (opts.roundTo) {
    const roundTo = opts.roundTo;

    if (/[^0-9]/.test(roundTo) || parseFloat(roundTo) > 15)
        program.error(`error: option '-r, --round-to <count>' argument invalid (whole numbers <=15 only)`);
}

if (opts.iterations) {
    const iterations = opts.iterations;

    if (/[^0-9]/.test(iterations) || parseFloat(iterations) > 100 || parseFloat(iterations) === 0)
        program.error(`error: option '-i, --iterations <count>' argument invalid (natural numbers <=100 only)`);
}

// Handle command to test

if (program.args.length > 1) {
    console.error(`error: Invalid argument(s) specified`);
    process.exit(0);
}

const cmd = program.args[0];

if (!cmd) {
    console.error(`error: Specify a command as command-line string argument to measure its execution time`);
    process.exit(0);
}

// Promisify the exec method to execute synchronously

const execPromise = async (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout) => {
            if (err)
                reject(err);
            resolve(stdout);
        });
    });
}

// Measure execution time

const iterations = opts.iterations ? parseFloat(opts.iterations) : 1;

let execTimeAvg = 0;

for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    await execPromise(cmd)
        .then(async (stdout) => {
            const stopTime = performance.now();
            const execTime = stopTime - startTime;  // Execution time measured in milliseconds
            execTimeAvg += execTime;

            if (i === 0 && opts.showStdout)
                console.log(stdout);                // Log the output if any to stdout (only once)
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

// Calculate average execution time

execTimeAvg /= iterations;

// Log results

if (execTimeAvg > 999)
    console.log(chalk.cyan(`Time taken: ${ parseFloat((execTimeAvg / 1000).toFixed(opts.roundTo ? opts.roundTo : 6)) } s`));
else
    console.log(chalk.cyan(`Time taken: ${ parseFloat(execTimeAvg.toFixed(opts.roundTo ? opts.roundTo : 6)) } ms`));