var lastDPS = null,
  lastHPS = null,
  firstCombat = false,
  _ = "";
var barSize = new Array(),
  encounterArray = new Array(),
  overallObject,
  encounterCount = 1;

var onStopFlag = false;

function onOverlayDataUpdate(e) {
  lastDPS = lastCombat;
  lastHPS = new Combatant(e, "enchps");

  //console.log(lastDPS.isActive)
  //console.log(onStopFlag)

  if (lastDPS.isActive == "true") {
    if (view != "settings") {
      if (!firstCombat) {
        $("[name=notice], [name=history]").fadeOut(0);
        $("[name=main]").fadeIn(0);
        view = "main";
        firstCombat = true;
      }
      update(lastDPS, lastHPS);
      hiddenTable();
    }
    onStopFlag = true;
  } else {
    if (!onStopFlag) return;
    else {
      if (view != "settings") {
        if (!firstCombat) {
          $("[name=notice], [name=history]").fadeOut(0);
          $("[name=main]").fadeIn(0);
          view = "main";
          firstCombat = true;
        }
        saveLog();
        update(lastDPS, lastHPS);
        hiddenTable();
      }
      onStopFlag = false;
    }
  }
}

function update(lastDPS, lastHPS) {
  if (lastDPS.zone == "HAERU") {
    _ = "_P";
  } else _ = "";
  if (true) { //(!lastDPS.overallData) {
    if (init.q.pets == 0) {
      lastDPS.summonerMerge = false;
      lastDPS.DetachPets();
      lastDPS.resort("damage", 1);
      lastHPS.summonerMerge = false;
      lastHPS.DetachPets();
      lastHPS.resort("healed", 1);
    } else {
      lastDPS.summonerMerge = true;
      lastDPS.AttachPets();
      lastDPS.resort("mergedDamage", 1);
      lastHPS.summonerMerge = true;
      lastHPS.AttachPets();
      lastHPS.resort("mergedHealed", 1);
    }
    if (init.q.act == 2) {
      $("nav table[name=ACT_2line]").fadeIn(0);
      $("nav table[name=ACT_1line]").fadeOut(0);
    } else {
      $("nav table[name=ACT_2line]").fadeOut(0);
      $("nav table[name=ACT_1line]").fadeIn(0);
    }
    $("[name=target]").text(lastDPS.Encounter.title);
    $("[name=time]").text(lastDPS.Encounter.duration);
    if (init.q.tableOrder == 1)
      $("div[name=main" + _ + "]").html(
        '<div id="DPSHeader' +
          _ +
          '"><div id="DPSoldHeader' +
          _ +
          '"></div></div><div id="DPSBody' +
          _ +
          '"><div id="DPSoldBody' +
          _ +
          '"></div></div><div id="HPSHeader' +
          _ +
          '"><div id="HPSoldHeader' +
          _ +
          '"></div></div><div id="HPSBody' +
          _ +
          '"><div id="HPSoldBody' +
          _ +
          '"></div></div>'
      );
    else
      $("div[name=main" + _ + "]").html(
        '<div id="HPSHeader' +
          _ +
          '"><div id="HPSoldHeader' +
          _ +
          '"></div></div><div id="HPSBody' +
          _ +
          '"><div id="HPSoldBody' +
          _ +
          '"></div></div><div id="DPSHeader' +
          _ +
          '"><div id="DPSoldHeader' +
          _ +
          '"></div></div><div id="DPSBody' +
          _ +
          '"><div id="DPSoldBody' +
          _ +
          '"></div></div>'
      );

    if (
      lastDPS.Combatant["YOU"] == undefined &&
      lastDPS.Combatant["YOU"] == null
    ) {
      $("[name=rps]").text(l.NAV.main.tt.rps[lang]);
    } else {
      var rd = "Total DPS " + addComma(lastDPS.Encounter.ENCDPS) + "　";
      var rh = "Total HPS " + addComma(lastHPS.Encounter.ENCHPS) + "　";
      var md = "My DPS " + addComma(lastDPS.Combatant.YOU.encdps) + "　";
      var mh = "My HPS " + addComma(lastHPS.Combatant.YOU.enchps) + "　";
      var rk =
        "Rank " +
        parseInt(lastDPS.Combatant.YOU.rank + 1) +
        "/" +
        parseInt(lastHPS.Combatant.YOU.rank + 1) +
        "/" +
        lastDPS.partys +
        "　";
      var msg = "";
      if (init.q.swap == 0)
        var max =
          '<span name="swapBtn">MaxHit </span>' +
          addData("maxhit", null, lastDPS.Combatant.YOU)
            .replace('<font class="ex">', "")
            .replace("</font>", "");
      else
        var max =
          '<span name="swapBtn">MaxHeal </span>' +
          addData("maxheal", null, lastHPS.Combatant.YOU)
            .replace('<font class="ex">', "")
            .replace("</font>", "");
      if (init.q.act_rd) msg += rd;
      if (init.q.act_rh) msg += rh;
      if (init.q.act_md) msg += md;
      if (init.q.act_mh) msg += mh;
      if (init.q.act_rank) msg += rk;
      if (init.q.act_max)
        msg += max.replace('<font class="ex">', "").replace("</font>", "");

      $("[name=rps]").html(msg);
      $("[name=swapBtn]").on({
        click: function () {
          if (init.q.swap == 0) {
            init.q.swap = 1;
          } else {
            init.q.swap = 0;
          }
          localStorage.setItem("Mopi2_HAERU", JSON.stringify(init));
          update(lastDPS, lastHPS);
        },
        mouseover: function () {
          $(this).css({ color: "#" + init.Color.accent });
        },
        mouseleave: function () {
          $(this).css({ color: "" });
        },
      });
      if (
        (lastDPS.partys >= init.q.view24_Number && init.q.view24) ||
        view == "preview24"
      ) {
        if (init.q.viewDPS == 1) onRaidCombatDataUpdate("DPS", lastDPS);
        if (init.q.viewHPS == 1) onRaidCombatDataUpdate("HPS", lastHPS);
      } else {
        if (init.q.viewDPS == 1) onCombatDataUpdate("DPS", lastDPS);
        if (init.q.viewHPS == 1) onCombatDataUpdate("HPS", lastHPS);
      }
    }
  } else {
    if (init.q.act == 2) {
      $("nav table[name=ACT_2line]").fadeIn(0);
      $("nav table[name=ACT_1line]").fadeOut(0);
    } else {
      $("nav table[name=ACT_2line]").fadeOut(0);
      $("nav table[name=ACT_1line]").fadeIn(0);
    }
    $("[name=target]").text(lastDPS.Encounter.title);
    $("[name=time]").text(lastDPS.Encounter.duration);
    if (init.q.tableOrder == 1)
      $("div[name=main" + _ + "]").html(
        '<div id="DPSHeader' +
          _ +
          '"><div id="DPSoldHeader' +
          _ +
          '"></div></div><div id="DPSBody' +
          _ +
          '"><div id="DPSoldBody' +
          _ +
          '"></div></div><div id="HPSHeader' +
          _ +
          '"><div id="HPSoldHeader' +
          _ +
          '"></div></div><div id="HPSBody' +
          _ +
          '"><div id="HPSoldBody' +
          _ +
          '"></div></div>'
      );
    else
      $("div[name=main" + _ + "]").html(
        '<div id="HPSHeader' +
          _ +
          '"><div id="HPSoldHeader' +
          _ +
          '"></div></div><div id="HPSBody' +
          _ +
          '"><div id="HPSoldBody' +
          _ +
          '"></div></div><div id="DPSHeader' +
          _ +
          '"><div id="DPSoldHeader' +
          _ +
          '"></div></div><div id="DPSBody' +
          _ +
          '"><div id="DPSoldBody' +
          _ +
          '"></div></div>'
      );
    var rd = "Total DPS " + addComma(lastDPS.Encounter.ENCDPS) + "　";
    var rh = "Total HPS " + addComma(lastHPS.Encounter.ENCHPS) + "　";
    var md = "My DPS " + addComma(lastDPS.persons.YOU.encdps) + "　";
    var mh = "My HPS " + addComma(lastHPS.persons.YOU.enchps) + "　";
    var rk =
      "Rank " +
      parseInt(lastDPS.persons.YOU.rank + 1) +
      "/" +
      parseInt(lastHPS.persons.YOU.rank + 1) +
      "　";
    var msg = "";
    if (init.q.swap == 0)
      var max =
        '<span name="swapBtn">MaxHit </span>' +
        addData("maxhit", null, lastDPS.persons.YOU)
          .replace('<font class="ex">', "")
          .replace("</font>", "");
    else
      var max =
        '<span name="swapBtn">MaxHeal </span>' +
        addData("maxheal", null, lastHPS.persons.YOU)
          .replace('<font class="ex">', "")
          .replace("</font>", "");
    if (init.q.act_rd) msg += rd;
    if (init.q.act_rh) msg += rh;
    if (init.q.act_md) msg += md;
    if (init.q.act_mh) msg += mh;
    if (init.q.act_rank) msg += rk;
    if (init.q.act_max)
      msg += max.replace('<font class="ex">', "").replace("</font>", "");

    $("[name=rps]").html(msg);
    $("[name=swapBtn]").on({
      click: function () {
        if (init.q.swap == 0) {
          init.q.swap = 1;
        } else {
          init.q.swap = 0;
        }
        localStorage.setItem("Mopi2_HAERU", JSON.stringify(init));
        update(lastDPS, lastHPS);
      },
      mouseover: function () {
        $(this).css({ color: "#" + init.Color.accent });
      },
      mouseleave: function () {
        $(this).css({ color: "" });
      },
    });
    if (view == "preview24") {
      if (init.q.viewDPS == 1) onRaidCombatDataUpdate("DPS", lastDPS);
      if (init.q.viewHPS == 1) onRaidCombatDataUpdate("HPS", lastHPS);
    } else {
      if (init.q.viewDPS == 1) onCombatDataUpdate("DPS", lastDPS);
      if (init.q.viewHPS == 1) onCombatDataUpdate("HPS", lastHPS);
    }
  }
  ui();
}
function onRaidCombatDataUpdate(flag, last) {
  if (last.Combatant["YOU"] != undefined || last.Combatant["YOU"] != null) {
    var row = $('<div class="rRow"></div>'),
      set = 1,
      newBody = $('<div id="' + flag + "Body" + _ + '"></div>');
    for (var d in last.persons) {
      var a = last.persons[d];
      var userName = a.name
        .replace(/ /g, "")
        .replace("(", "")
        .replace(")", "")
        .replace(/'/g, "_");
      if ((init.q.pets == 1 && a.Job == "AVA") || a.Class == "") {
      } else {
        if (flag == "HPS") {
          if (
            (init.q.HPS_T == 1 && a.role == "Tanker") ||
            (init.q.HPS_H == 1 && a.role == "Healer") ||
            (init.q.HPS_D == 1 && a.role == "DPS") ||
            (init.q.HPS_C == 1 && a.Job == "CBO") ||
            (init.q.HPS_M == 1 && a.role == "Crafter") ||
            (init.q.HPS_M == 1 && a.role == "Gathering")
          ) {
            a.mergedHealed = a.healed - a.overHeal;
            a.enchps = parseFloat(
              ((a.healed - a.overHeal) / a.parent.DURATION)
                .nanFix()
                .toFixed(underDot)
            );
            //a.hps = parseFloat(((a.healed - a.overHeal) / a.parent.DURATION).nanFix().toFixed(underDot))
            if (set <= init.Range.size24TableSlice) {
              row.append(createRaidTableBody(flag, a, userName));
              set++;
            } else {
              set = 2;
              newBody.append(row);
              row = $('<div class="rRow"></div>');
              row.append(createRaidTableBody(flag, a, userName));
            }
          }
        } else {
          if (
            (init.q.DPS_T == 1 && a.role == "Tanker") ||
            (init.q.DPS_H == 1 && a.role == "Healer") ||
            (init.q.DPS_D == 1 && a.role == "DPS") ||
            (init.q.DPS_C == 1 && a.Job == "CBO") ||
            (init.q.DPS_M == 1 && a.role == "Crafter") ||
            (init.q.DPS_M == 1 && a.role == "Gathering")
          ) {
            if (set <= init.Range.size24TableSlice) {
              row.append(createRaidTableBody(flag, a, userName));
              set++;
            } else {
              set = 2;
              newBody.append(row);
              row = $('<div class="rRow"></div>');
              row.append(createRaidTableBody(flag, a, userName));
            }
          }
        }
      }
    }
    newBody.append(row);
    $("#" + flag + "Body" + _).replaceWith(newBody);
  }
}
function createRaidTableBody(flag, a, userName) {
  return (
    '<table id="' +
    userName +
    '" class="rCell"><tr><td rowspan="2" class="rIdx" style="background:' +
    graphColor(a.Class, a.role, userName) +
    '"></td><td class="rIcon">' +
    addData("Class", a.Class, a) +
    '</td><td class="rName">' +
    addData("name", a.name, a) +
    '</td></tr><tr><td colspan="2" class="rData">' +
    addData("enc" + flag.toLowerCase(), a["enc" + flag.toLowerCase()], a) +
    "</td></tr></table>"
  );
}
function onCombatDataUpdate(flag, last) {
  if (true){ //(!last.overallData) {
    if (last.Combatant["YOU"] != undefined || last.Combatant["YOU"] != null) {
      var Height = 0;
      var tableHeader = document.getElementById(flag + "Header" + _);
      var oldHeader = document.getElementById(flag + "oldHeader" + _);
      var newHeader = document.createElement("div");
      createTableHeader(flag, newHeader);
      tableHeader.replaceChild(newHeader, oldHeader);
      newHeader.id = flag + "oldHeader" + _;
      var tableBody = document.getElementById(flag + "Body" + _);
      var oldBody = document.getElementById(flag + "oldBody" + _);
      var newBody = document.createElement("div");

      var totalOverheal = 0;
      for (var d in last.persons) {
        var a = last.persons[d];
        totalOverheal += a.overHeal;
      }

      for (var d in last.persons) {
        var a = last.persons[d];
        var userName = a.name
          .replace(/ /g, "")
          .replace("(", "")
          .replace(")", "")
          .replace(/'/g, "_");
        if ((init.q.pets == 1 && a.Job == "AVA") || a.Class == "") {
        } else {
          var bodyHeight =
            parseInt(init.Range.sizeBody) + parseInt(init.Range.sizeLine);
          if (flag == "HPS") {
            if (
              (init.q.HPS_T == 1 && a.role == "Tanker") ||
              (init.q.HPS_H == 1 && a.role == "Healer") ||
              (init.q.HPS_D == 1 && a.role == "DPS") ||
              (init.q.HPS_C == 1 && a.Job == "CBO") ||
              (init.q.HPS_M == 1 && a.role == "Crafter") ||
              (init.q.HPS_M == 1 && a.role == "Gathering")
            ) {
              a["healed%"] = pFloat(
                (a.mergedHealed / (a.parent.Encounter.healed - totalOverheal)) *
                  100
              );
              a.healedPct = pFloat(
                (a.mergedHealed / (a.parent.Encounter.healed - totalOverheal)) *
                  100
              );
              a.mergedHealed = a.healed - a.overHeal;
              a.enchps = parseFloat(
                ((a.healed - a.overHeal) / a.parent.DURATION)
                  .nanFix()
                  .toFixed(underDot)
              );
              //a.hps = parseFloat(((a.healed - a.overHeal) / a.parent.DURATION).nanFix().toFixed(underDot))
              createTableBody(userName, flag, newBody, a);
              if (Height < parseFloat(bodyHeight * init.Range.sizeHPSTable)) {
                Height += bodyHeight;
                $("#HPSBody" + _).height(Height / 10 + "rem");
              }
            }
          } else {
            if (
              (init.q.DPS_T == 1 && a.role == "Tanker") ||
              (init.q.DPS_H == 1 && a.role == "Healer") ||
              (init.q.DPS_D == 1 && a.role == "DPS") ||
              (init.q.DPS_C == 1 && a.Job == "CBO") ||
              (init.q.DPS_M == 1 && a.role == "Crafter") ||
              (init.q.DPS_M == 1 && a.role == "Gathering")
            ) {
              createTableBody(userName, flag, newBody, a);
              if (Height < parseFloat(bodyHeight * init.Range.sizeDPSTable)) {
                Height += bodyHeight;
                $("#DPSBody" + _).height(Height / 10 + "rem");
              }
            }
          }
        }
      }
      tableBody.replaceChild(newBody, oldBody);
      newBody.id = flag + "oldBody" + _;
      if (Height == 0)
        $("#" + flag + "Header" + _).html(
          '<div id="' + flag + "oldHeader" + _ + '"></div>'
        );
      for (var d in last.persons) {
        var a = last.persons[d];
        var userName = a.name
          .replace(/ /g, "")
          .replace("(", "")
          .replace(")", "")
          .replace(/'/g, "_");
        if ((init.q.pets == 1 && a.Job == "AVA") || a.Class == "") {
        } else inputGraph(userName, flag, a.parent.maxdamage, a);
      }
    }
  } else {
    if (last.persons["YOU"] != undefined || last.persons["YOU"] != null) {
      var Height = 0;
      var tableHeader = document.getElementById(flag + "Header" + _);
      var oldHeader = document.getElementById(flag + "oldHeader" + _);
      var newHeader = document.createElement("div");
      createTableHeader(flag, newHeader);
      tableHeader.replaceChild(newHeader, oldHeader);
      newHeader.id = flag + "oldHeader" + _;
      var tableBody = document.getElementById(flag + "Body" + _);
      var oldBody = document.getElementById(flag + "oldBody" + _);
      var newBody = document.createElement("div");

      var totalOverheal = 0;
      for (var d in last.persons) {
        var a = last.persons[d];
        totalOverheal += a.overHeal;
      }

      for (var d in last.persons) {
        var a = last.persons[d];
        var userName = a.name
          .replace(/ /g, "")
          .replace("(", "")
          .replace(")", "")
          .replace(/'/g, "_");
        if ((init.q.pets == 1 && a.Job == "AVA") || a.Class == "") {
        } else {
          var bodyHeight =
            parseInt(init.Range.sizeBody) + parseInt(init.Range.sizeLine);
          if (flag == "HPS") {
            if (
              (init.q.HPS_T == 1 && a.role == "Tanker") ||
              (init.q.HPS_H == 1 && a.role == "Healer") ||
              (init.q.HPS_D == 1 && a.role == "DPS") ||
              (init.q.HPS_C == 1 && a.Job == "CBO") ||
              (init.q.HPS_M == 1 && a.role == "Crafter") ||
              (init.q.HPS_M == 1 && a.role == "Gathering")
            ) {
              a["healed%"] = pFloat(
                (a.mergedHealed / (last.Encounter.healed - totalOverheal)) * 100
              );
              a.healedPct = pFloat(
                (a.mergedHealed / (last.Encounter.healed - totalOverheal)) * 100
              );
              a.mergedHealed = a.healed - a.overHeal;
              a.enchps = parseFloat(
                ((a.healed - a.overHeal) / last.Encounter.DURATION)
                  .nanFix()
                  .toFixed(underDot)
              );
              //a.hps = parseFloat(((a.healed - a.overHeal) / a.parent.DURATION).nanFix().toFixed(underDot))
              createTableBody(userName, flag, newBody, a);
              if (Height < parseFloat(bodyHeight * init.Range.sizeHPSTable)) {
                Height += bodyHeight;
                $("#HPSBody" + _).height(Height / 10 + "rem");
              }
            }
          } else {
            if (
              (init.q.DPS_T == 1 && a.role == "Tanker") ||
              (init.q.DPS_H == 1 && a.role == "Healer") ||
              (init.q.DPS_D == 1 && a.role == "DPS") ||
              (init.q.DPS_C == 1 && a.Job == "CBO") ||
              (init.q.DPS_M == 1 && a.role == "Crafter") ||
              (init.q.DPS_M == 1 && a.role == "Gathering")
            ) {
              createTableBody(userName, flag, newBody, a);
              if (Height < parseFloat(bodyHeight * init.Range.sizeDPSTable)) {
                Height += bodyHeight;
                $("#DPSBody" + _).height(Height / 10 + "rem");
              }
            }
          }
        }
      }
      tableBody.replaceChild(newBody, oldBody);
      newBody.id = flag + "oldBody" + _;
      if (Height == 0)
        $("#" + flag + "Header" + _).html(
          '<div id="' + flag + "oldHeader" + _ + '"></div>'
        );
      for (var d in last.persons) {
        var a = last.persons[d];
        var userName = a.name
          .replace(/ /g, "")
          .replace("(", "")
          .replace(")", "")
          .replace(/'/g, "_");
        if ((init.q.pets == 1 && a.Job == "AVA") || a.Class == "") {
        } else inputGraph(userName, flag, "0", a);
      }
    }
  }
}
function createTableHeader(flag, newHeader) {
  var tableHeader = document.createElement("TABLE");
  tableHeader.className = "tableHeader";
  var tr = tableHeader.insertRow();
  for (var i in init.Order[flag]) {
    var n = init.Order[flag][i];
    var td = tr.insertCell();
    td.innerHTML = init.ColData[n].tt;
    td.className = n + " cell";
  }
  newHeader.appendChild(tableHeader);
}
function createTableBody(userName, flag, newBody, a) {
  var wrap = document.createElement("div");
  wrap.id = userName;
  wrap.className = "tableWrap";
  if ((a.Job == "AVA" || a.Job == "CBO") && userName.indexOf("YOU") > -1) {
    wrap.className = "tableWrap myPet";
  }
  var table = document.createElement("TABLE");
  table.className = "tableBody";
  var bar = document.createElement("div");
  bar.className = "bar";
  var barBg = document.createElement("div");
  barBg.className = "barBg";
  var tr = table.insertRow();
  for (var i in init.Order[flag]) {
    var n = init.Order[flag][i];
    if (init.ColData[n][flag] == true) {
      var td = tr.insertCell();
      td.innerHTML = addData(n, a[n], a);
      td.className = n + " cell";
    }
  }
  wrap.appendChild(table);
  var miniBar = document.createElement("div");
  miniBar.className = "mini";
  if (flag == "DPS") {
    if (init.q.bar_pet == 1) {
      var bar1 = document.createElement("div");
      bar1.className = "pet";
      miniBar.appendChild(bar1);
    }
  } else {
    if (init.q.bar_oh == 1) {
      var bar1 = document.createElement("div");
      bar1.className = "oh";
      miniBar.appendChild(bar1);
    }
    if (init.q.bar_ds == 1) {
      var bar2 = document.createElement("div");
      bar2.className = "ds";
      miniBar.appendChild(bar2);
    }
    if (init.q.bar_pet == 1) {
      var bar3 = document.createElement("div");
      bar3.className = "pet";
      miniBar.appendChild(bar3);
    }
  }
  wrap.appendChild(bar);
  wrap.appendChild(miniBar);
  wrap.appendChild(barBg);
  newBody.appendChild(wrap);
}
function printName(name) {
  var tmp = name.split(" ");
  if (tmp.length >= 2) {
    if (init.q.cnt == 1) return name;
    else if (init.q.cnt == 2) return tmp[0] + " " + tmp[1].substr(0, 1) + ".";
    else if (init.q.cnt == 3) return tmp[0].substr(0, 1) + ". " + tmp[1];
    else return tmp[0].substr(0, 1) + ". " + tmp[1].substr(0, 1) + ".";
  } else return name;
}
function cutName(name) {
  if (name.indexOf("(") > -1) {
    var tmp = name.split("(");
    var cn = tmp[1].substr(0, tmp[1].length - 1);
    if (myName == "") myName = "YOU";
    if (init.q.myName == false && cn == "YOU")
      return tmp[0] + " (" + printName(myName) + ")";
    else return tmp[0] + " (" + printName(cn) + ")";
  } else {
    return printName(name);
  }
}
function petName(job, name) {
  if (job == "CBO") {
    return d.CBO.tt[lang] + " (YOU)";
  } else return name.split("(")[0] + "(YOU)";
}
function addData(colName, a, p) {
  switch (colName) {
    case "Class":
      if (a != undefined)
        return (
          '<img src="./images/icon/' +
          init.q.iconSet +
          "/" +
          p.Job.toUpperCase() +
          '.png"/>'
        );
      else return "";
    case "name":
      var name = "";
      if (init.q.hideName == false) {
        if (a == "YOU" && init.q.myName == false) {
          if (myName != "") name = cutName(myName);
          else name = a;
        } else {
          if (
            (p.petOwner == myName || p.petOwner == "YOU") &&
            p.petOwner != "" &&
            init.q.myName == true
          )
            name = petName(p.Job, a);
          else {
            name = cutName(a);
          }
        }
      } else {
        if (a == "YOU") {
          name = a;
        } else {
          if ((p.petOwner == myName || p.petOwner == "YOU") && myName != "")
            name = petName(p.Job, a);
          else {
            if (p.Job == "LMB") name = d.LMB.tt[lang];
            else name = "";
          }
        }
      }
      if (init.q.rank == 1) return p.rank + 1 + ". " + name;
      else return name;
    case "duration":
    case "EncounterDuration":
      return a;
    case "ParryPct":
    case "BlockPct":
      return addComma(a) + '<font class="ex">%</font>';
    case "dps":
    case "mergedLast10DPS":
    case "mergedLast30DPS":
    case "mergedLast60DPS":
    case "mergedLast180DPS":
    case "encdps":
    case "enchps":
      if (a != "Infinity") {
        if (a >= 10000 && init.q.unit == 1)
          return addComma(a, 1000, init.q.ns * init.q.dpsType);
        else return addComma(a, null, init.q.ns * init.q.dpsType);
      } else return "∞";
    case "mergedDamage":
    case "mergedSwings":
    case "mergedHits":
    case "mergedDirectHitCount":
    case "mergedCrithits":
    case "mergedCritDirectHitCount":
    case "mergedMisses":
    case "hitfailed":
    case "mergedDamagetaken":
    case "mergedHealstaken":
    case "mergedHealed":
    case "mergedEffHealed":
    case "mergedDamageShield":
    case "mergedOverHeal":
    case "mergedHeals":
    case "mergedCritheals":
    case "mergedCures":
    case "mergedAbsorbHeal":
    case "powerheal":
    case "deaths":
      if (a >= 1000000 && init.q.unit == 1)
        return addComma(a, 1000000, init.q.ns * init.q.dmgType);
      else if (a >= 10000 && init.q.unit == 1)
        return addComma(a, 1000, init.q.ns * init.q.dmgType);
      else return addComma(a);
    case "maxhit":
    case "maxheal":
      var val = "merged" + colName + "val";
      var str = "merged" + colName + "str";
      var unit = "merged" + colName + "unit";
      var data = "";
      var abb = p[str];
      for (var i in init.Alias) {
        if (p[str] == i) {
          abb = init.Alias[i];
          break;
        }
      }
      if (p[unit] == "K")
        data = addComma(p[val], 1000, init.q.ns * init.q.dmgType);
      else if (p[unit] == "M")
        data = addComma(p[val], 1000000, init.q.ns * init.q.dmgType);
      else {
        if (p[val] >= 1000 && init.q.max_unit == 1)
          data = addComma(p[val], 1000, init.q.ns * init.q.dmgType);
        else if (p[val] >= 1000000 && init.q.max_unit == 1)
          data = addComma(p[val], 1000000, init.q.ns * init.q.dmgType);
        else data = addComma(p[val]);
      }
      if (init.q.mhh == 1)
        return (
          '<font class="ex">' + abb + " " + init.q.mhh_unit + " </font>" + data
        );
      else if (init.q.mhh == 2)
        return (
          data + '<font class="ex"> ' + init.q.mhh_unit + " " + abb + "</font>"
        );
      else if (init.q.mhh == 3) return abb;
      else return data;
    default:
      return (
        addComma(a, null, init.q.ns * init.q.perType) +
        '<font class="ex">%</font>'
      );
  }
}
function addComma(num, dd, ds) {
  if (num == "NaN" || num == undefined || num == Infinity || num == "--")
    return 0;
  else {
    if (dd == null) dd = 1;
    if (ds == null) ds = 0;
    num = (num / dd).toFixed(ds);
    if (init.q.ds == "_") num = num.toString().replace(".", " ");
    else num = num.toString().replace(".", init.q.ds);
    if (init.q.gs == 0)
      num = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "");
    else if (init.q.gs == "_")
      num = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    else num = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, init.q.gs);
    if (dd == 1000) return num + '<font class="ex">k</font>';
    else if (dd == 1000000) return num + '<font class="ex">M</font>';
    else return num;
  }
}
function inputGraph(userName, flag, maxDamage, p) {
  if (flag == "DPS")
    var userWidth = parseInt((p.mergedDamage / maxDamage) * 100);
  else {
    var userWidth = parseInt((p.mergedHealed / maxDamage) * 100);
    var overheal = Math.min(
      100,
      parseInt((p.mergedOverHeal / p.mergedHealed) * 100)
    );
    var shield = Math.min(
      100,
      parseInt((p.mergedDamageShield / p.mergedHealed) * 100)
    );
  }
  var width = graphAnimate(userWidth, "bar", flag, userName, p.Class, p.role);
  $("#" + flag + "Body" + _)
    .find("#" + userName)
    .find(".mini")
    .css({
      width: width + "%",
    });
  if (init.q.pets == 1) {
    if (flag == "DPS") {
      var petWidth = Math.min(
        100,
        parseInt(((p.mergedDamage - p.damage) / maxDamage) * 100)
      );
      graphAnimate(petWidth, "pet", flag, userName, "pet");
    } else {
      var fairyEffHeal = parseInt(p.mergedEffHealed - p.effHealed);
      var petWidth = Math.min(100, parseInt((fairyEffHeal / maxDamage) * 100));
      graphAnimate(petWidth, "pet", flag, userName, "pet");
      graphAnimate(shield, "ds", flag, userName, "ds");
      graphAnimate(overheal, "oh", flag, userName, "oh");
    }
  } else {
    if (flag == "HPS") {
      graphAnimate(shield, "ds", flag, userName, "ds");
      graphAnimate(overheal, "oh", flag, userName, "oh");
    }
  }
}
function graphAnimate(width, bar, flag, userName, job, role) {
  if (init.q.gradient == 1) {
    if (bar == "bar")
      var bg =
        "-webkit-linear-gradient(" +
        init.q.direction +
        ", rgba(0,0,0,0)," +
        graphColor(job, role, userName) +
        ")";
    else
      var bg =
        "-webkit-linear-gradient(" +
        init.q.direction +
        ", rgba(0,0,0,0)," +
        graphColor(job, role, userName) +
        ")";
  } else var bg = graphColor(job, role, userName);
  if (barSize[userName + bar + flag] == undefined) {
    $("#" + flag + "Body" + _)
      .find("#" + userName)
      .find("." + bar)
      .css({
        width: 0 + "%",
        background: bg,
        opacity: parseFloat(init.Range[bar] / 100),
      });
    barSize[userName + bar + flag] = 0;
  } else {
    if (isNaN(width)) barSize[userName + bar + flag] = 0;
    $("#" + flag + "Body" + _)
      .find("#" + userName)
      .find("." + bar)
      .css({
        width: parseInt(barSize[userName + bar + flag]) + "%",
        background: bg,
        opacity: parseFloat(init.Range[bar] / 100),
      });
  }
  if (init.q.ani == 1 && view != "settings") {
    $("#" + flag + "Body" + _)
      .find("#" + userName)
      .find("." + bar)
      .animate({
        width: width + "%",
        background: bg,
        opacity: parseFloat(init.Range[bar] / 100),
      });
  } else {
    $("#" + flag + "Body" + _)
      .find("#" + userName)
      .find("." + bar)
      .css({
        width: width + "%",
        background: bg,
        opacity: parseFloat(init.Range[bar] / 100),
      });
  }
  barSize[userName + bar + flag] = width;
  return width;
}
function graphColor(job, role, userName) {
  switch (init.q.palette) {
    case "job":
      if (
        init.q.myColorUse == 1 &&
        userName.indexOf("YOU") > -1 &&
        job != "ds" &&
        job != "oh" &&
        job != "pet"
      )
        return "#" + init.Color.myColor;
      else return "#" + init.Color[job];
    case "role":
      if (
        init.q.myColorUse == 1 &&
        userName.indexOf("YOU") > -1 &&
        job != "ds" &&
        job != "oh" &&
        job != "pet"
      )
        return "#" + init.Color.myColor;
      else {
        if (role != undefined || role != null) {
          if (job == "LMB") return "#" + init.Color[job];
          else return "#" + init.Color[role];
        } else return "#" + init.Color[job];
      }
    case "meYou":
      if (
        job == "ds" ||
        job == "oh" ||
        job == "LMB" ||
        job == "CBO" ||
        job == "pet"
      )
        return "#" + init.Color[job];
      else {
        if (userName == "YOU") return "#" + init.Color.YOU;
        else return "#" + init.Color.Other;
      }
  }
}
function saveLog() {
  if (lastDPS == null) return;
  else {
    if (String(lastCombat.isActive) == "false") {
      encounterArray.unshift({
        lastDPS: lastDPS,
        lastHPS: lastHPS,
        combatKey: lastCombat.combatKey,
      });
      if (encounterArray.length >= 2) {
        if (encounterArray[1].combatKey == lastDPS.combatKey)
          encounterArray.shift();
        else historyAddRow();
      } else historyAddRow();
    }
    barSize.length = 0;
  }
}
function historyAddRow() {
  var wrap = document.getElementById("HISTORYBody");
  var newHistory = document.createElement("div");
  newHistory.className = "tableWrap";
  var oldHistory = document.getElementById("HISTORYoldBody");
  $("#HISTORYBody").find("td#viewIcon").html("");
  var table = document.createElement("TABLE");
  table.id = lastDPS.zone + "_" + lastDPS.combatKey;
  table.className = "tableBody";
  var tr = table.insertRow();
  var td = tr.insertCell();
  td.innerHTML = '<img src="./images/menu/eye.svg" style="width:1.5rem"/>';
  td.className = "cell_5";
  td.id = "viewIcon";
  var td = tr.insertCell();
  if (lastDPS.title != "Encounter")
    td.innerHTML =
      lastDPS.title + '<span class="ex"> / ' + lastDPS.zone + "</span>";
  else
    td.innerHTML =
      "No Data" + '<span class="ex"> / ' + lastDPS.zone + "</span>";
  td.className = "cell_1";
  var td = tr.insertCell();
  td.innerHTML = lastDPS.Encounter.duration;
  td.className = "cell_5";
  var td = tr.insertCell();
  td.innerHTML = addComma(lastDPS.Encounter.ENCDPS);
  td.className = "cell_6";
  var td = tr.insertCell();
  td.innerHTML = addComma(lastHPS.Encounter.ENCHPS);
  td.className = "cell_6";
  var td = tr.insertCell();
  if (lastDPS.persons.YOU != null)
    td.innerHTML = addComma(lastDPS.persons.YOU.ENCDPS);
  else td.innerHTML = "No Data";
  td.className = "cell_6 ac";
  var td = tr.insertCell();
  if (lastHPS.persons.YOU != null)
    td.innerHTML = addComma(lastHPS.persons.YOU.ENCHPS);
  else td.innerHTML = "No Data";
  td.className = "cell_6 ac";
  var td = tr.insertCell();
  td.className = "cell_5";
  td.id = "CNT";

  var newHistory2 = undefined;
  if (encounterArray.length == 1) td.innerText = 1;
  else {
    if (
      encounterArray[0].lastDPS.Encounter.CurrentZoneName ==
      encounterArray[1].lastDPS.Encounter.CurrentZoneName
    ) {
      encounterCount++;
      td.innerText = addComma(parseInt(encounterCount));

      if (encounterArray.length > 1) {
        let estimatedOverallHTML = wrap.querySelector(
          `[id^="${lastDPS.zone + "_OVERALL_"}"]`
        );

        if (estimatedOverallHTML) {
          let index = encounterArray.findIndex(
            (a) =>
              a.lastDPS.combatKey == estimatedOverallHTML.getAttribute("id")
          );
          encounterArray.splice(index, 1);
          estimatedOverallHTML.parentElement.remove();
        }

        let res = addOverallData(encounterCount);
        newHistory2 = document.createElement("div");
        newHistory2.className = "tableWrap";
        newHistory2.appendChild(res[0]);
        newHistory2.appendChild(res[1]);
        newHistory2.id = "HISTORYoldBody";
      }
    } else {
      encounterCount = 1;
      td.innerText = encounterCount;
      console.log(encounterArray);
      //Handle overall
      let estimatedOverallHTML = wrap.querySelectorAll(
        `[id^="${encounterArray[1].lastDPS.Encounter.CurrentZoneName}"]`
      );
      for (let res of estimatedOverallHTML) {
        let oldID = res.getAttribute("id");
        res.setAttribute("id", "Done_" + oldID);
      }
    }
  }
  var barBg = document.createElement("div");
  barBg.className = "barBg";
  newHistory.appendChild(table);
  newHistory.appendChild(barBg);
  oldHistory = document.getElementById("HISTORYoldBody");
  if (oldHistory == null) wrap.appendChild(newHistory);
  else wrap.insertBefore(newHistory, oldHistory);
  if (newHistory2) wrap.insertBefore(newHistory2, newHistory);
  newHistory.id = "HISTORYoldBody";
  $("#HISTORYBody .tableWrap").on({
    mouseover: function () {
      if (init.Range.bar == 0) var tmp = 25;
      else var tmp = init.Range.bar;
      $(this)
        .find(".barBg")
        .css({
          background: oHexColor(init.Color.accent, parseFloat(tmp / 100)),
        });
    },
    mouseleave: function () {
      $(this)
        .find(".barBg")
        .css({
          background: oHexColor(
            init.Color.tableBg,
            parseFloat(init.Range.tableBg / 100)
          ),
        });
    },
    click: function () {
      $("#HISTORYBody").find("td#viewIcon").html("");
      var listName = $(this).find("table").attr("id");
      for (var i in encounterArray) {
        if (listName.contains(encounterArray[i].combatKey)) {
          lastDPS = encounterArray[i].lastDPS;
          lastHPS = encounterArray[i].lastHPS;
          $(this)
            .find("#viewIcon")
            .html(
              '<img src="./images/menu/eye.svg" style="width:' +
                parseFloat(init.Range.sizeBodyIcon / 10) +
                "rem" +
                '"/>'
            );
          $("#DPSBody").html('<div id="DPSoldBody"></div>');
          $("#HPSBody").html('<div id="HPSoldBody"></div>');
          update(lastDPS, lastHPS);
          button("Back", "main");
        }
      }
    },
  });
  firstCombat = false;
  hiddenTable();
}

function addOverallData(counter) {
  let relevantEncounters = [];
  let currentCounter = -1;
  for (let i = 0; i < encounterArray.length; i++) {
    if (encounterArray[i].lastDPS.zone == lastDPS.zone) {
      if (
        !encounterArray[i].lastDPS.overallData &&
        encounterArray[i].lastDPS.persons &&
        encounterArray[i].lastHPS.persons
      ) {
        relevantEncounters.push(encounterArray[i]);
      }
    } else {
      break;
    }
  }
  let resObj = {
    lastDPS: { Encounter: {}, overallData: true, title: "Overall Data" },
    lastHPS: { Encounter: {}, overallData: true, title: "Overall Data" },
  };

  resObj.lastDPS.AttachPets = function() {
    resObj.lastDPS.summonerMerge = !0;
    for (var i in resObj.lastDPS.Combatant) {
        resObj.lastDPS.Combatant[i].returnOrigin();
        resObj.lastDPS.Combatant[i].recalculate();
        resObj.lastDPS.Combatant[i].parent = resObj.lastDPS
  
        if (resObj.lastDPS.Combatant[i].Job == "AVA") {
            if (resObj.lastDPS.Combatant[i].petOwner == myName || resObj.lastDPS.Combatant[i].petOwner == tmpMyName)
                var owner = resObj.lastDPS.Combatant['YOU']
            else
                var owner = resObj.lastDPS.Combatant[resObj.lastDPS.Combatant[i].petOwner]
  
            if (resObj.lastDPS.Combatant[i].maxhitval > owner.mergedmaxhitval) {
                owner.mergedmaxhitval = resObj.lastDPS.Combatant[i].maxhitval
                owner.mergedmaxhitstr = resObj.lastDPS.Combatant[i].maxhitstr
            }
            if (resObj.lastDPS.Combatant[i].maxhealval > owner.mergedmaxhealval) {
                owner.mergedmaxhealval = resObj.lastDPS.Combatant[i].maxhealval
                owner.mergedmaxhealstr = resObj.lastDPS.Combatant[i].maxhealstr
            }
        }
  
    }
  }
    resObj.lastDPS.DetachPets = function() {
    resObj.lastDPS.summonerMerge = !1;
    for (var i in resObj.lastDPS.Combatant) {
        resObj.lastDPS.Combatant[i].returnOrigin();
        resObj.lastDPS.Combatant[i].recalculate();
        resObj.lastDPS.Combatant[i].parent = resObj.lastDPS
        resObj.lastDPS.Combatant[i].mergedmaxhitval = resObj.lastDPS.Combatant[i].maxhitval
        resObj.lastDPS.Combatant[i].mergedmaxhitstr = resObj.lastDPS.Combatant[i].maxhitstr
        resObj.lastDPS.Combatant[i].mergedmaxhealval = resObj.lastDPS.Combatant[i].maxhealval
        resObj.lastDPS.Combatant[i].mergedmaxhealstr = resObj.lastDPS.Combatant[i].maxhealstr
    }
  }
    resObj.lastDPS.sortkeyChange = function(key) {
    resObj.lastDPS.resort(key, !0)
  };
    resObj.lastDPS.sortkeyChangeDesc = function(key) {
    resObj.lastDPS.resort(key, !1)
  };
    resObj.lastDPS.resort = function(key, vector) {
    if (key == undefined)
        resObj.lastDPS.sortkey = activeSort(resObj.lastDPS.sortkey);
    else resObj.lastDPS.sortkey = activeSort(key);
    if (vector == undefined)
        vector = resObj.lastDPS.sortvector;
    resObj.lastDPS.sort(vector)
  };

  resObj.lastHPS.AttachPets = function() {
    resObj.lastHPS.summonerMerge = !0;
    for (var i in resObj.lastHPS.Combatant) {
        resObj.lastHPS.Combatant[i].returnOrigin();
        resObj.lastHPS.Combatant[i].recalculate();
        resObj.lastHPS.Combatant[i].parent = resObj.lastHPS
  
        if (resObj.lastHPS.Combatant[i].Job == "AVA") {
            if (resObj.lastHPS.Combatant[i].petOwner == myName || resObj.lastHPS.Combatant[i].petOwner == tmpMyName)
                var owner = resObj.lastHPS.Combatant['YOU']
            else
                var owner = resObj.lastHPS.Combatant[resObj.lastHPS.Combatant[i].petOwner]
  
            if (resObj.lastHPS.Combatant[i].maxhitval > owner.mergedmaxhitval) {
                owner.mergedmaxhitval = resObj.lastHPS.Combatant[i].maxhitval
                owner.mergedmaxhitstr = resObj.lastHPS.Combatant[i].maxhitstr
            }
            if (resObj.lastHPS.Combatant[i].maxhealval > owner.mergedmaxhealval) {
                owner.mergedmaxhealval = resObj.lastHPS.Combatant[i].maxhealval
                owner.mergedmaxhealstr = resObj.lastHPS.Combatant[i].maxhealstr
            }
        }
  
    }
  }
    resObj.lastHPS.DetachPets = function() {
    resObj.lastHPS.summonerMerge = !1;
    for (var i in resObj.lastHPS.Combatant) {
        resObj.lastHPS.Combatant[i].returnOrigin();
        resObj.lastHPS.Combatant[i].recalculate();
        resObj.lastHPS.Combatant[i].parent = resObj.lastHPS
        resObj.lastHPS.Combatant[i].mergedmaxhitval = resObj.lastHPS.Combatant[i].maxhitval
        resObj.lastHPS.Combatant[i].mergedmaxhitstr = resObj.lastHPS.Combatant[i].maxhitstr
        resObj.lastHPS.Combatant[i].mergedmaxhealval = resObj.lastHPS.Combatant[i].maxhealval
        resObj.lastHPS.Combatant[i].mergedmaxhealstr = resObj.lastHPS.Combatant[i].maxhealstr
    }
  }
    resObj.lastHPS.sortkeyChange = function(key) {
    resObj.lastHPS.resort(key, !0)
  };
    resObj.lastHPS.sortkeyChangeDesc = function(key) {
    resObj.lastHPS.resort(key, !1)
  };
    resObj.lastHPS.resort = function(key, vector) {
    if (key == undefined)
        resObj.lastHPS.sortkey = activeSort(resObj.lastHPS.sortkey);
    else resObj.lastHPS.sortkey = activeSort(key);
    if (vector == undefined)
        vector = resObj.lastHPS.sortvector;
    resObj.lastHPS.sort(vector)
  };

  let dontTouch = {};
  if (relevantEncounters.length > 0) dontTouch = relevantEncounters[0];
  resObj.lastDPS = populateOuterObjects(
    resObj.lastDPS,
    dontTouch.lastDPS,
    true
  );
  resObj.lastHPS = populateOuterObjects(
    resObj.lastHPS,
    dontTouch.lastHPS,
    true
  );
  for (let i = 1; i < relevantEncounters.length; i++) {
    resObj.lastDPS = populateOuterObjects(
      resObj.lastDPS,
      relevantEncounters[i].lastDPS
    );
    resObj.lastHPS = populateOuterObjects(
      resObj.lastHPS,
      relevantEncounters[i].lastHPS
    );

    for (var d in resObj.lastDPS.persons) {
      try {
        var a = resObj.lastDPS.persons[d];
        var b = relevantEncounters[i].lastDPS.persons[d];
        a = populateInnerObjects(a, b, resObj);
        var c = resObj.lastHPS.persons[d];
        var d = relevantEncounters[i].lastHPS.persons[d];
        c = populateInnerObjects(c, d, resObj);
      } catch (err) {
        console.log(err, [
          resObj.lastDPS.persons[d],
          relevantEncounters[i].lastDPS.persons[d],
          resObj.lastHPS.persons[d],
          relevantEncounters[i].lastHPS.persons[d],
        ]);
      }
    }
  }
  let rankArray = [];
  for (var d in resObj.lastDPS.persons) {
    var a = resObj.lastDPS.persons[d];
    rankArray.push({
      name: a.name,
      dps: a.ENCDPS,
      dpsRank: 0,
      hps: a.ENCHPS,
      hpsRank: 0,
    });
  }
  rankArray = calculateRanks(rankArray);
  console.log("rank calculated", rankArray)
  for (var d in resObj.lastDPS.persons) {
    let b = rankArray.filter(i => i.name == resObj.lastDPS.persons[d].name)[0]
    resObj.lastDPS.persons[d].rank = b.dpsRank;
  }
  for (var d in resObj.lastHPS.persons) {
    let b = rankArray.filter(i => i.name == resObj.lastHPS.persons[d].name)[0]
    resObj.lastHPS.persons[d].rank = b.hpsRank;
  }
  console.log("rank calculated", resObj)

  resObj.lastDPS.Combatant = resObj.lastDPS.persons
  resObj.lastDPS.DURATION = resObj.lastDPS.Encounter.DURATION
  resObj.lastDPS.duration = resObj.lastDPS.Encounter.duration
  resObj.lastDPS.isActive = false;
  resObj.lastDPS.partys = rankArray.length
  resObj.lastDPS.sortKey = "mergedDamage"
  resObj.lastDPS.sortvector = 1
  resObj.lastHPS.Combatant = resObj.lastHPS.persons
  resObj.lastHPS.DURATION = resObj.lastHPS.Encounter.DURATION
  resObj.lastHPS.duration = resObj.lastHPS.Encounter.duration
  resObj.lastHPS.isActive = false;
  resObj.lastHPS.partys = rankArray.length
  resObj.lastHPS.sortKey = "mergedHealed"
  resObj.lastHPS.sortvector = 1

  encounterArray.unshift({
    lastDPS: resObj.lastDPS,
    lastHPS: resObj.lastHPS,
    combatKey: resObj.lastDPS.combatKey,
  });

  var table = document.createElement("TABLE");
  table.id = resObj.lastDPS.combatKey;
  table.className = "tableBody";
  var tr = table.insertRow();
  var td = tr.insertCell();
  td.innerHTML = '<img src="./images/menu/eye.svg" style="width:1.5rem"/>';
  td.className = "cell_5";
  td.id = "viewIcon";
  var td = tr.insertCell();
  if (resObj.lastDPS.title != "Encounter")
    td.innerHTML =
      resObj.lastDPS.title +
      '<span class="ex"> / ' +
      resObj.lastDPS.zone +
      "</span>";
  else
    td.innerHTML =
      "No Data" + '<span class="ex"> / ' + resObj.lastDPS.zone + "</span>";
  td.className = "cell_1";
  var td = tr.insertCell();
  td.innerHTML = resObj.lastDPS.Encounter.duration;
  td.className = "cell_5";
  var td = tr.insertCell();
  td.innerHTML = addComma(resObj.lastDPS.Encounter.ENCDPS);
  td.className = "cell_6";
  var td = tr.insertCell();
  td.innerHTML = addComma(resObj.lastHPS.Encounter.ENCHPS);
  td.className = "cell_6";
  var td = tr.insertCell();
  try {
    if (resObj.lastDPS.persons.YOU != null)
      td.innerHTML = addComma(resObj.lastDPS.persons.YOU.ENCDPS);
    else td.innerHTML = "No Data";
  } catch (error) {
    td.innerHTML = "No Data";
  }
  td.className = "cell_6 ac";
  var td = tr.insertCell();
  try {
    if (resObj.lastHPS.persons.YOU != null)
      td.innerHTML = addComma(resObj.lastHPS.persons.YOU.ENCHPS);
    else td.innerHTML = "No Data";
  } catch (error) {
    td.innerHTML = "No Data";
  }
  td.className = "cell_6 ac";
  var td = tr.insertCell();
  td.className = "cell_5";
  td.id = "CNT";
  td.innerText = addComma(parseInt(counter + 1));
  if (encounterArray.length == 1) td.innerText = 1;
  else {
    if (
      encounterArray[0].lastDPS.Encounter.CurrentZoneName ==
      encounterArray[1].lastDPS.Encounter.CurrentZoneName
    ) {
      td.innerText = addComma(parseInt(counter + 1));
    }
  }
  var barBg = document.createElement("div");
  barBg.className = "barBg";
  return [table, barBg];
}

function populateOuterObjects(a, b, init = false) {
  if (init) {
    a.Encounter["DAMAGE-b"] = b.Encounter["DAMAGE-b"];
    a.Encounter["DAMAGE-k"] = b.Encounter["DAMAGE-k"];
    a.Encounter["DAMAGE-m"] = b.Encounter["DAMAGE-m"];
    a.Encounter["DURATION"] = b.Encounter["DURATION"];
    a.Encounter["damage"] = b.Encounter["damage"];
    a.Encounter["CurrentZoneName"] = b.Encounter["CurrentZoneName"];
    a.Encounter["damage-m"] = b.Encounter["damage-m"];
    a.Encounter["healed"] = b.Encounter["healed"];
    a.Encounter["swings"] = b.Encounter["swings"];
    a.Encounter.dps = pFloat(a.Encounter["damage"] / a.Encounter["DURATION"]);
    a.Encounter.encdps = pFloat(
      a.Encounter["damage"] / a.Encounter["DURATION"]
    );
    a.Encounter.hps = pFloat(a.Encounter["healed"] / a.Encounter["DURATION"]);
    a.Encounter.enchps = pFloat(
      a.Encounter["healed"] / a.Encounter["DURATION"]
    );
    a.zone = b.Encounter.CurrentZoneName;
    a.combatKey =
      a.zone + "_OVERALL_" + Math.floor(Math.random() * 100000 + 1000);
    for (const [key, value] of Object.entries(b.persons)) {
      let person = b.persons[key];
      let clone = (({ parent, ...person }) => person)(person);
      if (!a.persons) {
        a.persons = {};
      }
      a.persons[key] = JSON.parse(JSON.stringify(clone));
    }
  } else {
    //number fields for encounter
    a.Encounter["DAMAGE-b"] += b.Encounter["DAMAGE-b"];
    a.Encounter["DAMAGE-k"] += b.Encounter["DAMAGE-k"];
    a.Encounter["DAMAGE-m"] += b.Encounter["DAMAGE-m"];
    a.Encounter["DURATION"] += b.Encounter["DURATION"];
    a.Encounter["damage"] += b.Encounter["damage"];
    a.Encounter["damage-m"] += b.Encounter["damage-m"];
    a.Encounter["healed"] += b.Encounter["healed"];
    a.Encounter["swings"] += b.Encounter["swings"];
    //text fields for encounter
    if (a.Encounter["DURATION"] == 0) a.Encounter["DURATION"] = 1;
    a.Encounter["duration"] =
      Math.floor(a.Encounter["DURATION"] / 60).toString() +
      ":" +
      (a.Encounter["DURATION"] -
        (Math.floor(a.Encounter["DURATION"] / 60) * 60).toString());

    a.Encounter.dps = pFloat(a.Encounter["damage"] / a.Encounter["DURATION"]);
    a.Encounter.encdps = pFloat(
      a.Encounter["damage"] / a.Encounter["DURATION"]
    );
    a.Encounter.hps = pFloat(a.Encounter["healed"] / a.Encounter["DURATION"]);
    a.Encounter.enchps = pFloat(
      a.Encounter["healed"] / a.Encounter["DURATION"]
    );
    a.Encounter.ENCDPS = Math.floor(a.Encounter.encdps);
    a.Encounter.ENCHPS = Math.floor(a.Encounter.enchps);
  }
  return a;
}

function populateInnerObjects(a, b, resObj) {
  //number fields for encounter
  a["DAMAGE-b"] += b["DAMAGE-b"] ? b["DAMAGE-b"] : 0;
  a["DAMAGE-k"] += b["DAMAGE-k"];
  a["DAMAGE-m"] += b["DAMAGE-m"];
  a["DURATION"] += b["DURATION"];
  a["damage"] += b["damage"];
  a["damage-m"] += b["damage-m"];
  a["healed"] += b["healed"];
  a["swings"] += b["swings"];
  a["mergedDamage"] += b["mergedDamage"];
  a["mergedHealed"] += b["mergedHealed"];
  a["mergedOverHeal"] += b["mergedOverHeal"];
  a["mergedCrithits"] += b["mergedCrithits"];
  a["mergedHits"] += b["mergedHits"];
  a["mergedDirectHitCount"] += b["mergedDirectHitCount"];
  a["mergedCritheals"] += b["mergedCritheals"];
  a["mergedSwings"] += b["mergedSwings"];
  a["overHeal"] += b["overHeal"];
  a["deaths"] += b["deaths"];

  //text fields for encounter
  if (a["DURATION"] == 0) a["DURATION"] = 1;
  a["EncounterDuration"] =
    Math.floor(a["DURATION"] / 60).toString() +
    ":" +
    (a["DURATION"] - (Math.floor(a["DURATION"] / 60) * 60).toString());

  a.dps = pFloat(a.mergedDamage / a["DURATION"]);
  a.encdps = pFloat(a.mergedDamage / resObj.lastDPS.Encounter["DURATION"]);
  a.hps = pFloat(a.mergedHealed / a["DURATION"]);
  a.enchps = pFloat(a.mergedHealed / resObj.lastDPS.Encounter["DURATION"]);
  a["DAMAGE-k"] = Math.floor(a.mergedDamage / 1000);
  a["DAMAGE-m"] = Math.floor(a.mergedDamage / 1000000);
  a.DPS = Math.floor(a.dps);
  a["DPS-k"] = Math.floor(a.dps / 1000);
  a.ENCDPS = Math.floor(a.encdps);
  a.ENCHPS = Math.floor(a.enchps);
  a["ENCDPS-k"] = Math.floor(a.encdps / 1000);
  a["ENCHPS-k"] = Math.floor(a.enchps / 1000);
  a["damagePct"] = pFloat(
    (a.mergedDamage / resObj.lastDPS.Encounter["damage"]) * 100
  );
  a["healedPct"] = pFloat(
    (a.mergedHealed / resObj.lastDPS.Encounter["healed"]) * 100
  );
  a["overHealPct"] = pFloat((a.mergedOverHeal / a.mergedHealed) * 100);
  a["crithitPct"] = pFloat((a.mergedCrithits / a.mergedHits) * 100);
  a["DirectHitPct"] = pFloat((a.mergedDirectHitCount / a.mergedHits) * 100);
  a["CritDirectHitPct"] = pFloat(
    (a.mergedCritDirectHitCount / a.mergedHits) * 100
  );
  a["crithealPct"] = pFloat((a.mergedCritheals / a.mergedHeals) * 100);
  a.tohit = pFloat((a.mergedHits / a.mergedSwings) * 100);
  a.mergedHealed = a.healed - a.overHeal;
  a.parent=resObj.lastDPS.Encounter

  a.returnOrigin = function() {
    for (var i in a.original) {
        if (i.indexOf("Last") > -1)
            a["merged" + i] = a[i];
        else if (i == "CritDirectHitCount" || i == "DirectHitCount")
            a["merged" + i] = a[i];
        else a["merged" + i] = a[i.substr(0, 1).toLowerCase() + i.substr(1)]
    }
  };
  a.merge = function(person) {
    a.returnOrigin();
    a.pets[person.name] = person;
    for (var k in a.pets) {
        for (var i in a.original) {
            if (i.indexOf("Last") > -1)
                a["merged" + i] += a.pets[k].original[i];
            else a["merged" + i] += a.pets[k].original[i]
        }
    }
    a.recalculate()
  };
  a.recalculate = function() {
    var dur = a.DURATION;
    if (dur == 0) dur = 1;
    a.dps = pFloat(a.mergedDamage / dur);
    a.encdps = pFloat(a.mergedDamage / a.parent.DURATION);
    a.hps = pFloat(a.mergedHealed / dur);
    a.enchps = pFloat(a.mergedHealed / a.parent.DURATION);
    a["DAMAGE-k"] = Math.floor(a.mergedDamage / 1000);
    a["DAMAGE-m"] = Math.floor(a.mergedDamage / 1000000);
    a.DPS = Math.floor(a.dps);
    a["DPS-k"] = Math.floor(a.dps / 1000);
    a.ENCDPS = Math.floor(a.encdps);
    a.ENCHPS = Math.floor(a.enchps);
    a["ENCDPS-k"] = Math.floor(a.encdps / 1000);
    a["ENCHPS-k"] = Math.floor(a.enchps / 1000);
    a["damagePct"] = pFloat(a.mergedDamage / a.parent.Encounter.damage * 100);
    a["healedPct"] = pFloat(a.mergedHealed / a.parent.Encounter.healed * 100);
    a["overHealPct"] = pFloat(a.mergedOverHeal / a.mergedHealed * 100);
    a["crithitPct"] = pFloat(a.mergedCrithits / a.mergedHits * 100);
    a["DirectHitPct"] = pFloat(a.mergedDirectHitCount / a.mergedHits * 100);
    a["CritDirectHitPct"] = pFloat(a.mergedCritDirectHitCount / a.mergedHits * 100);
    a["crithealPct"] = pFloat(a.mergedCritheals / a.mergedHeals * 100);
    a.tohit = pFloat(a.mergedHits / a.mergedSwings * 100)
    a.mergedHealed = a.healed - a.overHeal
  };
  a.get = function(key) {
    if (a.parent.summonerMerge) {
        switch (key) {
            case "damage":
                key = "mergedDamage";
                break;
            case "healed":
                key = "mergedHealed";
                break;
        }
    }
    return a[key]
  }
  a.rerank = function(vector) {
  a.sort(vector)
};
  a.indexOf = function(person) {
  var v = -1;
  for (var i in a.Combatant) {
      v++;
      if (i == person)
          return v
  }
  return v
};
  a.sort = function(vector) {
  if (vector != undefined)
      a.sortvector = vector;
  if (a.summonerMerge) {
      switch (a.sortkey) {
          case "damage":
              a.sortkey = "mergedDamage";
              break;
          case "healed":
              a.sortkey = "mergedHealed";
      }
  }

  var tmpOwner = [];
  var tmpUser = [];

  for (var i in a.Combatant) {
      if (a.Combatant[i].petOwner == "") {
          tmpUser.push(a.Combatant[i].name);
      } else {
          tmpOwner.push(a.Combatant[i].petOwner);
      }
  }
  for (var i in tmpUser) {
      for (var j in tmpOwner) {
          if (tmpUser[i] == tmpOwner[j]) {
              delete tmpOwner[j];
          }
      }
  }
  tmpMyName = "";
  for (var i = 0; i < tmpOwner.length; i++) {
      if (tmpOwner[i] != undefined) {
          tmpMyName = tmpOwner[i];
      }
  }
  for (var i in a.Combatant) {
      if (a.Combatant[i].isPet && a.summonerMerge) {
          if (a.Combatant["YOU"] != undefined) {
              if (tmpMyName == a.Combatant[i].petOwner)
                  a.Combatant["YOU"].merge(a.Combatant[i]);
          }
          if (a.Combatant[a.Combatant[i].petOwner] != undefined) {
              a.Combatant[a.Combatant[i].petOwner].merge(a.Combatant[i]);
          }
          a.Combatant[i].visible = !1
      } else {
          a.Combatant[i].visible = !0
      }
  }
  var tmp = [];
  var r = 0;
  for (var i in a.Combatant) {
      tmp.push({
          key: a.Combatant[i][a.sortkey],
          val: a.Combatant[i]
      });
  }
  a.Combatant = {};
  if (a.sortvector)
      tmp.sort(function(a, b) {
          return b.key - a.key
      });
  else tmp.sort(function(a, b) {
      return a.key - b.key
  });
  var tmpMax = 0;
  for (var i in tmp) {
      if (a.summonerMerge == true) {
          if (tmp[i].val.Job != "AVA") {
              if (tmpMax < tmp[i].val[a.sortkey])
                  tmpMax = tmp[i].val[a.sortkey];
          }
      } else {
          if (tmpMax < tmp[i].val[a.sortkey])
              tmpMax = tmp[i].val[a.sortkey];
      }
  }
  a.maxdamage = tmpMax;
  a.maxValue = tmpMax;

  for (var i in tmp) {
      a.Combatant[tmp[i].val.name] = tmp[i].val
  }
  for (var i in a.Combatant) {
      if (!a.Combatant[i].visible) continue;
      a.Combatant[i].rank = r++;
      a.Combatant[i].maxdamage = a.maxdamage
  }
  a.partys = r
  a.persons = a.Combatant
};
  a.AttachPets = function() {
  a.summonerMerge = !0;
  for (var i in a.Combatant) {
      a.Combatant[i].returnOrigin();
      a.Combatant[i].recalculate();
      a.Combatant[i].parent = a

      if (a.Combatant[i].Job == "AVA") {
          if (a.Combatant[i].petOwner == myName || a.Combatant[i].petOwner == tmpMyName)
              var owner = a.Combatant['YOU']
          else
              var owner = a.Combatant[a.Combatant[i].petOwner]

          if (a.Combatant[i].maxhitval > owner.mergedmaxhitval) {
              owner.mergedmaxhitval = a.Combatant[i].maxhitval
              owner.mergedmaxhitstr = a.Combatant[i].maxhitstr
          }
          if (a.Combatant[i].maxhealval > owner.mergedmaxhealval) {
              owner.mergedmaxhealval = a.Combatant[i].maxhealval
              owner.mergedmaxhealstr = a.Combatant[i].maxhealstr
          }
      }

  }
}
  a.DetachPets = function() {
  a.summonerMerge = !1;
  for (var i in a.Combatant) {
      a.Combatant[i].returnOrigin();
      a.Combatant[i].recalculate();
      a.Combatant[i].parent = a
      a.Combatant[i].mergedmaxhitval = a.Combatant[i].maxhitval
      a.Combatant[i].mergedmaxhitstr = a.Combatant[i].maxhitstr
      a.Combatant[i].mergedmaxhealval = a.Combatant[i].maxhealval
      a.Combatant[i].mergedmaxhealstr = a.Combatant[i].maxhealstr
  }
}
  a.sortkeyChange = function(key) {
  a.resort(key, !0)
};
  a.sortkeyChangeDesc = function(key) {
  a.resort(key, !1)
};
  a.resort = function(key, vector) {
  if (key == undefined)
      a.sortkey = activeSort(a.sortkey);
  else a.sortkey = activeSort(key);
  if (vector == undefined)
      vector = a.sortvector;
  a.sort(vector)
};

  return a;
}

function calculateRanks(arr) {
  arr = arr.sort((a, b) => (a.dps < b.dps ? 1 : a.dps > b.dps ? -1 : 0));
  for (let i = 0; i < arr.length; i++) {
    arr[i].dpsRank = i;
  }
  arr = arr.sort((a, b) => (a.hps < b.hps ? 1 : a.hps > b.hps ? -1 : 0));
  for (let i = 0; i < arr.length; i++) {
    arr[i].hpsRank = i;
  }
  return arr;
}