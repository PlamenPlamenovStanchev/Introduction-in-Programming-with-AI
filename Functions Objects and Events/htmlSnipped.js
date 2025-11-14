
function printHtmlSnippet(title, text){
    function printAsHTML(text, tag = 'div') {
    return `<${tag}>${text}</${tag}>`;
    }
    const titleHTML = printAsHTML(title, 'h1');
    const textHTML = printAsHTML(text, 'p');
    return printAsHTML(titleHTML + textHTML);
}