# time-taken-to
A simple idea I came up with while working on something else. Seemed like a fun mini-project, so decided to package it xD

![ttt-demo](https://imgur.com/fTUydrA.gif)
## Installation
```
npm i -g time-taken-to
```
This installs the binary to PATH after which it can be accessed either using `time-taken-to` or `ttt`.  
  
Alternatively, can be run using `npx` without local installation.

## Usage
> ⚠️ **If your command is interactive (requires runtime input)**, time-taken-to will stall and not do anything. This case is currently not handled and will be fixed in a later patch.  
> 🟢 Hence if interactive, hard-code your command.
```
time-taken-to [OPTIONS] <your_command>
```
Measures the time taken to execute `<your_command>`.  
```
ttt [OPTIONS] <your_command>
```
Also does the same thing.  
  
Using `npx`,
```
npx time-taken-to <your_command>
```
`<your_command>` must be specified as a string if it consists of more than one word.
```
$ ttt "ls -s"
```
is different from
```
$ ttt ls -s
```

### Options
The various available options can be viewed by running
```
ttt -h
```
- `--round-to` or `-r` - Rounds off the result to the number of digits provided as argument. The default value is 6.
- `--show-stdou` or `-s` - If specified, `ttt` also displays the `stdout` produced by the command.
- `--iterations` or `-i` - Runs the command for the specified number of times and returns the average for a more accurate result. Default is 1.
- `--version` or `-v` - Displays current version of `time-taken-to`.
- `--help` or `-h` - Displays the help page.
