const templates = {
    71: 'print("Hello World")',
    63: 'console.log("Hello World");',
    50: '#include <stdio.h>\n\nint main() {\n  printf("Hello World");\n  return 0;\n}',
    54: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello World";\n  return 0;\n}',
    62: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}',
    51: 'using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello World");\n  }\n}',
    60: 'package main\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello World")\n}',
    73: 'fn main() {\n  println!("Hello World");\n}',
    68: '<?php\n echo "Hello World";\n?>'
};

function setTemplate() {
    const lang = document.getElementById("language").value;
    document.getElementById("code").value = templates[lang] || "";
}

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const langId = urlParams.get('lang');

    if (langId && templates[langId]) {
        document.getElementById("language").value = langId;
    }
    setTemplate(); 
}

async function runCode() {
    const code = document.getElementById("code").value;
    const languageId = document.getElementById("language").value;
    const outputDiv = document.getElementById("output");

    outputDiv.innerText = "Futtatás...";

    try {
        const response = await fetch("https://ce.judge0.com/submissions?wait=true", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                source_code: code,
                language_id: Number(languageId)
            })
        });

        const result = await response.json();

        if (result.stdout) {
            outputDiv.innerText = result.stdout;
        } else if (result.stderr) {
            outputDiv.innerText = "Runtime hiba:\n" + result.stderr;
        } else if (result.compile_output) {
            outputDiv.innerText = "Fordítási hiba:\n" + result.compile_output;
        } else {
            outputDiv.innerText = "Nincs kimenet.";
        }

    } catch (error) {
        outputDiv.innerText = "API hiba: " + error.message;
    }
}

window.onload = checkUrlParams;