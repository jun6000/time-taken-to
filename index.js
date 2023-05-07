#! /usr/bin/env node

import { performance } from "perf_hooks";
import { exec } from "child_process";
import { program } from "commander";
import chalk from "chalk";

// Get command-line options and arguments

program
    .option("-r, --round-to <count>", "Round the result to <count> digits.")
    .option("-s, --show-stdout", "Show stdout from the command being run.")
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
    .version("v1.3.0", "-v, --version", "Display the current version of time-taken-to.")
    .parse(process.argv);

// Handle options

const opts = program.opts();

if (opts.roundTo) {
    const roundTo = opts.roundTo;

    if (/[^0-9]/.test(roundTo) || parseFloat(roundTo) > 15)
        program.error(`error: option '-r, --round-to <count>' argument invalid (whole numbers <=15 only)`);
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

// Measure execution time

const startTime = performance.now();

const subShell = exec(cmd, (err, stdout, stderr) => {
    const stopTime = performance.now();

    if (err) {
        console.error(err);
        process.exit(1);
    }

    if (opts.showStdout)
        console.log(stdout);                        // Log the output if any to stdout

    const execTime = stopTime - startTime;          // Execution time measured in milliseconds

    if (execTime > 999)
        console.log(chalk.cyan(`Time taken: ${ parseFloat((execTime / 1000).toFixed(opts.roundTo ? opts.roundTo : 6)) } s`));
    else
        console.log(chalk.cyan(`Time taken: ${ parseFloat(execTime.toFixed(opts.roundTo ? opts.roundTo : 6)) } ms`));
});