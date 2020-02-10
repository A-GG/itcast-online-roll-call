
function saveClassList(data) {
  data.classList.forEach(v => {
    v.studentsList = v.studentsList.filter(vv => vv);
  })
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(data, function(r) {
      resolve(r);
    });
  });
}

async function addOrEditClass(classInfo) {
  let result = await getClassList();
  result.classList = result.classList.length ? result.classList : [];
  if (classInfo.id) {
    let tempClass = result.classList.find(v => classInfo.id == v.id);
    tempClass.className = classInfo.className;
    tempClass.studentsList = classInfo.studentsList;
  } else {
    classInfo.id = result.classList.length
      ? result.classList[result.classList.length - 1].id + 1
      : 1;
    result.classList.push(classInfo);
  }
  return saveClassList(result);
}

async function deleteClass(id) {
  let result = await getClassList();
  result.classList = result.classList.filter(v => v.id != id);
  return saveClassList(result);
}

function getClassList() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["classList"], function(result) {
      resolve(result);
    });
  });
}

async function getClassInfo(id) {
  let result = await getClassList();
  return result.classList.find(v => v.id == id);
}