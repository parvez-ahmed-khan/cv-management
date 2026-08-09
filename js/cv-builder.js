let currentStep = 1;
const totalSteps = 7;
let currentUser = null;
let photoData = "";

const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const saveBtn = document.getElementById('saveBtn');

function showStep(step) {
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  document.getElementById('step-' + step).classList.add('active');

  document.querySelectorAll('.progress-step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'completed');
    if (s === step) el.classList.add('active');
    if (s < step) el.classList.add('completed');
  });

  prevBtn.disabled = (step === 1);
  nextBtn.style.display = (step === totalSteps) ? 'none' : 'block';
  saveBtn.style.display = (step === totalSteps) ? 'block' : 'none';
}

nextBtn.addEventListener('click', () => {
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
  }
});

prevBtn.addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
});

document.querySelectorAll('.template-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    document.getElementById('selectedTemplate').value = card.dataset.template;
    renderPreview();
  });
});

// Photo upload -> base64
document.getElementById('photoInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 500 * 1024) {
    alert("Please choose an image smaller than 500 KB.");
    e.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    photoData = evt.target.result;
    document.getElementById('photoPreview').innerHTML = '<img src="' + photoData + '" alt="photo">';
    renderPreview();
  };
  reader.readAsDataURL(file);
});

function collectFormData() {
  return {
    template: document.getElementById('selectedTemplate').value,
    photo: photoData,
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('cvEmail').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    summary: document.getElementById('summary').value,
    education: {
      degree: document.getElementById('degree').value,
      institution: document.getElementById('institution').value,
      year: document.getElementById('eduYear').value
    },
    skills: document.getElementById('skills').value,
    experience: {
      jobTitle: document.getElementById('jobTitle').value,
      company: document.getElementById('company').value,
      period: document.getElementById('jobPeriod').value,
      description: document.getElementById('jobDesc').value
    },
    experience2: {
      jobTitle: document.getElementById('jobTitle2').value,
      company: document.getElementById('company2').value,
      period: document.getElementById('jobPeriod2').value,
      description: document.getElementById('jobDesc2').value
    },
    reference: {
      name: document.getElementById('refName').value,
      title: document.getElementById('refTitle').value,
      email: document.getElementById('refEmail').value,
      phone: document.getElementById('refPhone').value
    }
  };
}

function renderPreview() {
  const cv = collectFormData();
  const sheet = document.getElementById('livePreview');

  if (!cv.fullName && !cv.email) {
    sheet.className = 'cv-sheet';
    sheet.innerHTML = '<p style="text-align:center; color:#999;">Your CV preview will appear here as you type.</p>';
    return;
  }

  sheet.className = 'cv-sheet template-' + cv.template;

  if (cv.template === 'sidebar') {
    sheet.innerHTML = buildSidebarHTML(cv);
  } else {
    sheet.innerHTML = buildStandardHTML(cv);
  }
}

function buildStandardHTML(cv) {
  const skillsList = cv.skills
    ? cv.skills.split(',').map(s => '<span class="skill-tag">' + s.trim() + '</span>').join('')
    : '';

  let html = '<div class="cv-header"><h1>' + (cv.fullName || 'Your Name') + '</h1><p>' +
    (cv.email || '') + (cv.phone ? ' | ' + cv.phone : '') + (cv.address ? ' | ' + cv.address : '') + '</p></div>';

  if (cv.summary) html += '<div class="cv-section"><h3>Summary</h3><p>' + cv.summary + '</p></div>';

  if (cv.education.degree || cv.education.institution) {
    html += '<div class="cv-section"><h3>Education</h3><p><strong>' + (cv.education.degree || '') +
      '</strong></p><p>' + (cv.education.institution || '') +
      (cv.education.year ? ' (' + cv.education.year + ')' : '') + '</p></div>';
  }

  if (skillsList) html += '<div class="cv-section"><h3>Skills</h3><div class="skills-wrap">' + skillsList + '</div></div>';

  if (cv.experience.jobTitle) {
    html += '<div class="cv-section"><h3>Experience</h3><p><strong>' + cv.experience.jobTitle + '</strong>' +
      (cv.experience.company ? ' - ' + cv.experience.company : '') +
      (cv.experience.period ? ' (' + cv.experience.period + ')' : '') + '</p><p>' + (cv.experience.description || '') + '</p></div>';
  }

  if (cv.experience2.jobTitle) {
    html += '<div class="cv-section"><p><strong>' + cv.experience2.jobTitle + '</strong>' +
      (cv.experience2.company ? ' - ' + cv.experience2.company : '') +
      (cv.experience2.period ? ' (' + cv.experience2.period + ')' : '') + '</p><p>' + (cv.experience2.description || '') + '</p></div>';
  }

  if (cv.reference.name) {
    html += '<div class="cv-section"><h3>Reference</h3><p><strong>' + cv.reference.name + '</strong>' +
      (cv.reference.title ? ' - ' + cv.reference.title : '') + '</p><p>' +
      (cv.reference.email || '') + (cv.reference.phone ? ' | ' + cv.reference.phone : '') + '</p></div>';
  }

  return html;
}

function buildSidebarHTML(cv) {
  const skillsItems = cv.skills
    ? cv.skills.split(',').map(s => '<li>' + s.trim() + '</li>').join('')
    : '';

  let leftCol = '<div class="sidebar-left">';
  leftCol += '<div class="sidebar-photo">' + (cv.photo ? '<img src="' + cv.photo + '" alt="photo">' : '<div class="sidebar-photo-placeholder">Photo</div>') + '</div>';

  leftCol += '<div class="sidebar-block"><h4>Contact</h4>';
  if (cv.phone) leftCol += '<p>' + cv.phone + '</p>';
  if (cv.email) leftCol += '<p>' + cv.email + '</p>';
  if (cv.address) leftCol += '<p>' + cv.address + '</p>';
  leftCol += '</div>';

  if (skillsItems) {
    leftCol += '<div class="sidebar-block"><h4>Skills</h4><ul>' + skillsItems + '</ul></div>';
  }

  if (cv.education.degree || cv.education.institution) {
    leftCol += '<div class="sidebar-block"><h4>Education</h4><p><strong>' + (cv.education.degree || '') + '</strong></p><p>' +
      (cv.education.institution || '') + (cv.education.year ? ' - ' + cv.education.year : '') + '</p></div>';
  }

  if (cv.reference.name) {
    leftCol += '<div class="sidebar-block"><h4>Reference</h4><p><strong>' + cv.reference.name + '</strong></p>' +
      (cv.reference.title ? '<p>' + cv.reference.title + '</p>' : '') +
      (cv.reference.email ? '<p>' + cv.reference.email + '</p>' : '') +
      (cv.reference.phone ? '<p>' + cv.reference.phone + '</p>' : '') + '</div>';
  }

  leftCol += '</div>';

  let rightCol = '<div class="sidebar-right">';
  rightCol += '<h1>' + (cv.fullName || 'Your Name') + '</h1>';

  if (cv.summary) {
    rightCol += '<div class="cv-section"><h3>Summary</h3><p>' + cv.summary + '</p></div>';
  }

  if (cv.experience.jobTitle || cv.experience2.jobTitle) {
    rightCol += '<div class="cv-section"><h3>Work History</h3>';
    if (cv.experience.jobTitle) {
      rightCol += '<div class="sidebar-job"><p class="job-title">' + cv.experience.jobTitle +
        (cv.experience.period ? ' <span class="job-period">' + cv.experience.period + '</span>' : '') + '</p>' +
        '<p class="job-company">' + (cv.experience.company || '') + '</p>' +
        '<p>' + (cv.experience.description || '') + '</p></div>';
    }
    if (cv.experience2.jobTitle) {
      rightCol += '<div class="sidebar-job"><p class="job-title">' + cv.experience2.jobTitle +
        (cv.experience2.period ? ' <span class="job-period">' + cv.experience2.period + '</span>' : '') + '</p>' +
        '<p class="job-company">' + (cv.experience2.company || '') + '</p>' +
        '<p>' + (cv.experience2.description || '') + '</p></div>';
    }
    rightCol += '</div>';
  }

  rightCol += '</div>';

  return leftCol + rightCol;
}

document.getElementById('cvForm').addEventListener('input', renderPreview);

auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
  } else {
    window.location.href = "login.html";
  }
});

document.getElementById('cvForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const messageEl = document.getElementById('message');

  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('cvEmail').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!fullName || !email || !phone) {
    messageEl.textContent = "Please fill in your name, email, and phone (step 2) before saving.";
    messageEl.style.color = "red";
    return;
  }

  if (!currentUser) {
    messageEl.textContent = "Please log in first.";
    messageEl.style.color = "red";
    return;
  }

  const cvData = collectFormData();
  cvData.updatedAt = new Date();

  db.collection('cvs').doc(currentUser.uid).set(cvData)
    .then(() => {
      messageEl.textContent = "CV saved successfully!";
      messageEl.style.color = "green";
      setTimeout(() => window.location.href = "preview-cv.html", 1200);
    })
    .catch((error) => {
      messageEl.textContent = "Error: " + error.message;
      messageEl.style.color = "red";
    });
});

showStep(1);