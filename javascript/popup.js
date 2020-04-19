const schoolList = $(`
<option value="">请选择校区</option>
<option value="深圳">深圳</option>
<option value="广州">广州</option>
<option value="上海">上海</option>
<option value="郑州">郑州</option>
<option value="武汉">武汉</option>
<option value="哈尔滨">哈尔滨</option>
<option value="长沙">长沙</option>
<option value="西安">西安</option>
<option value="济南">济南</option>
<option value="重庆">重庆</option>
<option value="南京">南京</option>
<option value="杭州">杭州</option>
<option value="成都">成都</option>
<option value="石家庄">石家庄</option>
<option value="北京-金燕龙">北京</option>
<option value="北京-金燕龙">北京金燕龙</option>
<option value="北京昌平">北京昌平</option>
<option value="北京顺义">北京顺义</option>
<option value="北京修正">北京修正</option>
<option value="沭阳">沭阳</option>
<option value="合肥">合肥</option>
<option value="太原">太原</option>
<option value="厦门">厦门</option>
<option value="沈阳">沈阳</option>
<option value="天津">天津</option>`);

const classNumberList = $(`
<option value="">请选择班号</option>
<option value="1班">1班</option>
<option value="2班">2班</option>
<option value="3班">3班</option>
<option value="4班">4班</option>
<option value="5班">5班</option>
<option value="6班">6班</option>
<option value="7班">7班</option>
<option value="8班">8班</option>
<option value="9班">9班</option>
<option value="10班">10班</option>`);


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
    $("#prefix-type").val(classInfo.prefixType);
    changePrefixList(classInfo.prefixType)
    $("#class-prefix").val(classInfo.classPrefix);
    $("#students-list").val(classInfo.studentsList.join("\r\n"));
    $("#myModal").modal("show");
  });

  $("#myModal").on("hide.bs.modal",function(){
    $("#formAddClass")[0].reset();
  })

  let prefixList = $("#class-prefix");
  let prefixExample1 = $("#prefix-example1")
  let prefixExample2 = $("#prefix-example2")

  function changePrefixList (prefixType) {
    prefixList.empty()
    prefixExample1.empty()
    prefixExample2.empty()
    switch(prefixType){
      case "classnumber":
        prefixList.append(classNumberList)
        prefixExample1.text("班级号-学员姓名")
        break
      case "school":
        prefixList.append(schoolList)
        prefixExample1.text("校区-学员姓名")
        break
    }
  }

  $("#prefix-type").change(e => {
    changePrefixList(e.target.value);
  })

  prefixList.change(e => {
    prefixExample2.text(`例如：${e.target.value}-张三`)
  })
});
