const API_KEY = "ff11622c";
const GAME_KEY = "ELFS_AND_TROLLS";

async function saveResult(name, score) {
  const resp = getResults();

  if (!resp) {
    return;
  }

  resp.then(data => {
    let results = data ? JSON.parse(atob(data)) : {}; // atob base-64 декодировка 

    results[name] = score;

    const request = encodeURI(btoa(JSON.stringify(results))); // btoa - кодировка

    try {
      fetch(`https://api.keyvalue.xyz/${API_KEY}/${GAME_KEY}/${request}`, {
        method: "POST"
      });
    } catch (ex) {
      console.log(`Handle exception: ${ex}`);
    }
  });
}

async function getResults() {
  try {
    const resp = await fetch(`https://api.keyvalue.xyz/${API_KEY}/${GAME_KEY}`);

    return resp.text();
  } catch (ex) {
    console.log(`Handle exception: ${ex}`);
  }

  return null;
}

function showResults() {
  const resp = getResults();

  if (!resp) {
    return 0;
  }

  resp.then(data => {
    if (!data) {
      return;
    }

    const results = JSON.parse(atob(data));

    let table = document.getElementById("table");

    for (const [name, score] of Object.entries(results)) {
      const result = document.createElement("li");
      result.setAttribute("class", "points")

      result.innerText = `${name} - ${score} ⭐`;

      table.appendChild(result);
    }
  });
}