function parseForm(str) {
  let tempArr = str.split("&");
  let result = {};
  tempArr.forEach((v, i) => {
    let kvpair = v.split("=");
    result[kvpair[0].trim()] = kvpair[1].trim();
  });
  result.studentsList = result.studentsList.split(/\s/);
  return result;
}


async function loadData() {
  let classList = await getClassList();

  $("#students-table").html(template("students-table-tpl", classList));
}

template.defaults.imports.uriDecoded = function(value){
  return decodeURI(value);
};

$(() => {
  loadData();
  $("#saveInfo").click(async () => {
    let formInfo = decodeURIComponent($("#formAddClass").serialize());
    formInfo = parseForm(formInfo);
    await addOrEditClass(formInfo);
    $("#myModal").modal("hide");
    loadData();
  });

  $("#students-table").on("click", ".btnDel", async function() {
    let id = $(this).data("id");
    if (confirm(`确认删除`)) {
      await deleteClass(id);
      loadData();
    }
  });

  $("#students-table").on("click", ".btnEdit", async function() {
    let className = $(this).data("id");
    let classInfo = await getClassInfo(className);
    $("#class-id").val(classInfo.id);
    $("#class-name").val(classInfo.className);
    $("#class-school").val(classInfo.classSchool);
    $("#students-list").val(classInfo.studentsList.join("\r\n"));
    $("#myModal").modal("show");
  });

  $("#myModal").on("hide.bs.modal",function(){
    
    $("#formAddClass")[0].reset();
  })
});
