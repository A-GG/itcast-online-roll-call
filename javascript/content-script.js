const tpl = `
      <div class="class-name">当前班级：{{className}}</div>
      <div class="online-teachers">在线老师数量：{{onlineTeachers}}</div>
      <div class="online-students">各校区在线数量：
        {{each onlineStudents v k}}
          <span>{{k}}:{{v.length}}人</span>
        {{/each}}
      </div>
      <div class="total-students">{{school}}校区应出勤学生总数：{{totalStudents}}</div>
      <div class="online-attendance">{{school}}校区班级出勤率：{{attendance}}</div>
      <div class="offline-students">{{school}}校区缺勤数量：{{offlineStudents}}</div>
      <div class="offline-students-details">{{school}}校区缺勤学生：
        {{each offlineStudentsDetails v i}}
          <span>{{v}}</span>
        {{/each}}
      </div>
`;
let runCount = 0;
async function loadData() {
  const roomId = $("#roomId").val();
  const userId = $("#userId").val();

  let render = template.compile(tpl);
  // let className = document.title.split("-")[0];
  let classInfo = await getClassByName(document.title);

  if (!classInfo) {
    if (!runCount) {
      alert(
        "您尚未配置当前班级的学员信息，出勤率功能无法统计\r\n请在插件中添加班级信息"
      );
      runCount++;
    }
    return;
  }

  let renderObj = {
    school: classInfo.classSchool,
    className: classInfo.className,
    totalStudents: classInfo.studentsList.length,
    onlineStudents: {},
    attendance: 0,
    onlineTeachers: 0,
    offlineStudents: 0,
    offlineStudentsDetails: []
  };

  $.ajax({
    url: `https://view.csslcloud.net/api/inline/room/onlineusers?userid=${userId}&roomid=${roomId}&type=2&value=`,
    success(data) {
      let onlineStudentsList = data.onlineUsers.filter(
        v => v.role == "student"
      );

      

      renderObj.onlineTeachers = data.onlineUsers.filter(
        v => v.role == "teacher" || v.role == "publisher"
      ).length;

      classInfo.studentsList.forEach(student => {
        if (!onlineStudentsList.find(v => v.name == `${renderObj.school}-${student}`)) {
          renderObj.offlineStudentsDetails.push(student);
        }
      });

      renderObj.onlineStudents = _.groupBy(
        onlineStudentsList,
        v => v.name.split("-")[0]
      );


      let currentClassOnlineStudents = renderObj.onlineStudents[renderObj.school] || [];
      renderObj.attendance = `${(
        currentClassOnlineStudents.length /
        renderObj.totalStudents
      ).toFixed(4) * 100}%`;

      renderObj.offlineStudents = renderObj.offlineStudentsDetails.length;


      $(".class-info").empty();
      $(".class-info").html(render(renderObj));
    }
  });
}

$(() => {
  $(`<span class="pull-right mr10 btn-attendance">出勤统计</span>`)
    .click(() => {
      $(".class-info").toggle();
    })
    .appendTo($(".numo"));

  $(".numo").append(`<div class="class-info"></div>`);
  loadData();

  $("#users").on("DOMNodeInserted", loadData);
  $("#users").on("DOMNodeRemoved", loadData);
});
