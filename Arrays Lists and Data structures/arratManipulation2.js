function processArrayComands(input) {
    let array = input[0].split(' ').map(Number);
    let commands = input.slice(1);

    for (let commandLine of commands) {
        let [command, ...args] = commandLine.split(' ');
        switch (command) {
            case 'Add':
                array.push(Number(args[0]));
                break;
            case 'Remove':
                array = array.filter(num => num !== Number(args[0]));
                break;
            case 'RemoveAt':
                array.splice(Number(args[0]), 1);
                break;
            case 'Insert':
                array.splice(Number(args[1]), 0, Number(args[0]));
                break;
        }
    }

    return array.join(' ');
}