const list = document.getElementById('assignment-list');
let index = 1;

async function checkAndAppendFiles() {
  while (true) {
    const file = `${basePath}${index}.pdf`;

    try {
      const res = await fetch(file, { method: 'HEAD' });
      if (!res.ok) break;

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = file;
      a.download = '';
      a.textContent = `Assignment ${index}`;
      li.appendChild(a);
      list.appendChild(li);

      index++;
    } catch (err) {
      break;
    }
  }
}

checkAndAppendFiles();
