function printPersonInfo({name, address: {town, country}}) {
    return `I am ${name} from ${town}, ${country}.`;
}