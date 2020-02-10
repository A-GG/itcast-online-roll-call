const tpl = `
    <div class="class-info">
      <div class="class-name">当前班级：{{$data.className}}</div>
      <div class="total-students">学生总数：</div>
      <div class="online-students">在线学生数量：</div>
      <div class="online-teachers">在线老师数量：</div>
      <div class="offline-students">缺勤数量：</div>
      <div class="offline-students-details">缺勤学生：</div>
    </div>
`

function loadData(){
  let render = template.compile(tpl);
  let className = document.title.split("-")[0]
  $(".numo").append(render({className}));
}

$(() => {
  $(`<span class="pull-right mr10 btn-attendance">出勤统计</span>`).click(()=>{
    $(".class-info").toggle();
  }).appendTo($(".numo"))
  loadData();
});


