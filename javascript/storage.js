function saveClassList(data) {
  data.classList.forEach(v => {
    v.studentsList = v.studentsList.filter(vv => vv);
  });
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(data, function(r) {
      resolve(r);
    });
  });
}

async function addOrEditClass(classInfo) {
  let result = await getClassList();
  result.classList = result.classList ? result.classList : [];
  if (classInfo.id) {
    let tempClass = result.classList.find(v => classInfo.id == v.id);
    tempClass.className = classInfo.className;
    tempClass.studentsList = classInfo.studentsList;
    tempClass.prefixType = classInfo.prefixType;
    tempClass.classPrefix = classInfo.classPrefix;
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

async function getClassByName(className) {
  let result = await getClassList();
  if (result.classList) {
    return result.classList.find(v => className.indexOf(v.className) != -1);
  } else {
    return null;
  }
}

async function getClassInfo(id) {
  let result = await getClassList();
  if (result.classList) {
    return result.classList.find(v => v.id == id);
  } else {
    return null;
  }
}
