const tpl = `
    <div class="class-info">
      <div class="class-name">当前班级：{{className}}</div>
      <div class="total-students">学生总数：{{totalStudents}}</div>
      <div class="online-students">在线学生数量：{{onlineStudents}}</div>
      <div class="online-attendance">班级出勤率：{{attendance}}</div>
      <div class="online-teachers">在线老师数量：{{onlineTeachers}}</div>
      <div class="offline-students">缺勤数量：{{offlineStudents}}</div>
      <div class="offline-students-details">缺勤学生：
        {{each offlineStudentsDetails v i}}
          <span>{{v}}</span>
        {{/each}}
      </div>
    </div>
`;

async function loadData() {
  const roomId = $("#roomId").val();
  const userId = $("#userId").val();

  let render = template.compile(tpl);
  let className = document.title.split("-")[0];
  let classInfo = await getClassByName(className);

  let renderObj = {
    className: classInfo.className,
    totalStudents: classInfo.studentsList.length,
    onlineStudents: 0,
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
      renderObj.onlineStudents = onlineStudentsList.length;
      renderObj.onlineTeachers = data.onlineUsers.filter(
        v => v.role == "teacher" || v.role == "publisher"
      ).length;
      renderObj.attendance = `${(
        renderObj.onlineStudents / renderObj.totalStudents
      ).toFixed(4) * 100}%`;
      renderObj.offlineStudents =
        renderObj.totalStudents - renderObj.onlineStudents;
      // renderObj.offlineStudentsDetails =
      classInfo.studentsList.forEach(student => {
        if (!onlineStudentsList.find(v => v.name.indexOf(student) != -1)) {
          renderObj.offlineStudentsDetails.push(student);
        }
      });
      $(".numo").append(render(renderObj));
    }
  });
}

$(() => {
  $(`<span class="pull-right mr10 btn-attendance">出勤统计</span>`)
    .click(() => {
      $(".class-info").toggle();
    })
    .appendTo($(".numo"));
  loadData();
});
