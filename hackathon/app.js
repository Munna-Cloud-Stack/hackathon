// Authentication functions
function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => alert("Signup successful!"))
      .catch((error) => alert("Signup Error: " + error.message));
  }
  
  function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert("Login Error: " + error.message));
  }
  
  function logout() {
    auth.signOut();
  }
  
  // Attendance Tracker
  function saveAttendance() {
    const subject = document.getElementById("subject").value;
    const present = parseInt(document.getElementById("present").value);
    const total = parseInt(document.getElementById("total").value);
    const user = auth.currentUser;
  
    if (user && subject && !isNaN(present) && !isNaN(total)) {
      db.collection("users").doc(user.uid).collection("attendance").add({ subject, present, total })
        .then(loadAttendance);
    }
  }
  
  function loadAttendance() {
    const list = document.getElementById("attendance-list");
    list.innerHTML = "";
    const user = auth.currentUser;
    db.collection("users").doc(user.uid).collection("attendance").get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const { subject, present, total } = doc.data();
          const percent = ((present / total) * 100).toFixed(1);
          list.innerHTML += `<div class="bg-white/20 p-2 rounded">${subject}: ${percent}% (${present}/${total})</div>`;
        });
      });
  }
  
  // Timetable Manager
  function saveTimetable() {
    const timetable = document.getElementById("timetable").value;
    const user = auth.currentUser;
    db.collection("users").doc(user.uid).set({ timetable }, { merge: true })
      .then(loadTimetable);
  }
  
  function loadTimetable() {
    const display = document.getElementById("timetable-display");
    const user = auth.currentUser;
    db.collection("users").doc(user.uid).get().then((doc) => {
      if (doc.exists && doc.data().timetable) {
        display.textContent = doc.data().timetable;
      }
    });
  }
  
  // Handle login state
  auth.onAuthStateChanged((user) => {
    document.getElementById("auth-section").style.display = user ? "none" : "block";
    document.getElementById("app-section").style.display = user ? "block" : "none";
  
    if (user) {
      loadAttendance();
      loadTimetable();  
      loadTasks(); 
    }
  });
  // 📌 Study Planner Functions
function addTask() {
    const subject = document.getElementById("task-subject").value;
    const deadline = document.getElementById("task-deadline").value;
    const user = auth.currentUser;
  
    if (user && subject && deadline) {
      db.collection("users").doc(user.uid).collection("tasks").add({
        subject,
        deadline,
        completed: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(loadTasks);
    }
  }
  
  function toggleTask(id, completed) {
    const user = auth.currentUser;
    db.collection("users").doc(user.uid).collection("tasks").doc(id).update({
      completed: !completed
    }).then(loadTasks);
  }
  
  function loadTasks() {
    const user = auth.currentUser;
    const list = document.getElementById("task-list");
    list.innerHTML = "";
  
    db.collection("users").doc(user.uid).collection("tasks")
      .orderBy("createdAt", "desc").get().then((snapshot) => {
        snapshot.forEach((doc) => {
          const task = doc.data();
          const done = task.completed ? "line-through text-green-400" : "";
          list.innerHTML += `
            <div onclick="toggleTask('${doc.id}', ${task.completed})" 
                 class="cursor-pointer bg-white/20 p-2 rounded ${done}">
              📚 <strong>${task.subject}</strong> — Due: ${task.deadline}
            </div>`;
        });
      });
  }
  