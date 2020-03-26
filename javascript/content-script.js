const tpl = `
      <div class="class-name">当前班级：{{className}}</div>
      <div class="online-students-count">在线学生数量：{{userCount}}</div>
      <div class="online-but-not-displayed-studens">在线但未在直播间显示的学生数量: {{userCount - onlineTeachers - onlineStudentsCount}}</div>
      <div class="online-teachers">在线老师数量：{{onlineTeachers}}</div>
      <div class="online-students">各班级在线数量：
        {{each onlineStudents v k}}
          <span>{{k}}:{{v.length}}人</span>
        {{/each}}
      </div>
      <div class="total-students">{{classPrefix}}应出勤学生总数：{{totalStudents}}</div>
      <div class="online-attendance">{{classPrefix}}出勤率：{{attendance}}</div>
      <div class="offline-students">{{classPrefix}}缺勤数量：{{offlineStudents}}</div>
      <div class="offline-students-details">{{classPrefix}}缺勤学生：
        {{each offlineStudentsDetails v i}}
          <span>{{v}}</span>
        {{/each}}
      </div>
`;
let runCount = 0;

let params = {
  userId: $("#userId").val(),
  roomId: $("#roomId").val(),

  chat: {
    host: $("#chatHost").val(),
    spareHost: $("#backupChatHost").val()
  },

  user: {
    id: $("#viewerId").val(),
    name: $("#viewerName").val(),
    role: $("#viewerRole").val(),
    sessionId: $.cookie("asessionid")
  },

  render: async function(data) {
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
      classPrefix: classInfo.classPrefix,
      className: classInfo.className,
      totalStudents: classInfo.studentsList.length,
      onlineStudents: {},
      onlineStudentsCount: 0,
      attendance: 0,
      onlineTeachers: 0,
      offlineStudents: 0,
      offlineStudentsDetails: [],
      userCount: data.userCount
    };

    let onlineStudentsList = data.onlineUsers.filter(v => v.role == "student");

    renderObj.onlineStudentsCount = onlineStudentsList.length;

    renderObj.onlineTeachers = data.onlineUsers.filter(
      v => v.role == "teacher" || v.role == "publisher"
    ).length;

    classInfo.studentsList.forEach(student => {
      if (
        !onlineStudentsList.find(
          v => v.name == `${renderObj.classPrefix}-${student}`
        )
      ) {
        renderObj.offlineStudentsDetails.push(student);
      }
    });

    renderObj.onlineStudents = _.groupBy(
      onlineStudentsList,
      v => v.name.split("-")[0]
    );

    let currentClassOnlineStudents =
      renderObj.onlineStudents[renderObj.classPrefix] || [];
    renderObj.attendance = `${(
      currentClassOnlineStudents.length / renderObj.totalStudents
    ).toFixed(4) * 100}%`;

    renderObj.offlineStudents = renderObj.offlineStudentsDetails.length;

    $(".class-info").empty();
    $(".class-info").html(render(renderObj));
  }
};

$(() => {
  // 添加 出勤统计按钮到页面中

  $(`<span class="pull-right mr10 btn-attendance">出勤统计</span>`)
    .click(() => {
      $(".class-info").toggle();
    })
    .appendTo($(".numo"));

  $(".numo").append(`<div class="class-info"></div>`);

  WS(params);
});
