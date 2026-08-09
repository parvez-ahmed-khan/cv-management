let currentStep = 1;
const totalSteps = 6;
let currentUser = null;

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

function collectFormData() {
  return {
    template: document.getElementById('selectedTemplate').value,
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
      description: document.getElementById('jobDesc').value
    },
    project: {
      name: document.getElementById('projectName').value,
      description: document.getElementById('projectDesc').value
    }
  };
}

function renderPreview() {
  const cv = collectFormData();
  const sheet = document.getElementById('livePreview');

  if (!cv.fullName && !cv.email) {
    sheet.innerHTML = '<p style="text-align:center; color:#999;">Your CV preview will appear here as you type.</p>';
    return;
  }

  sheet.className = 'cv-sheet template-' + cv.template;

  const skillsList = cv.skills
    ? cv.skills.split(',').map(s => '<span class="skill-tag">' + s.trim() + '</span>').join('')
    : '';

  sheet.innerHTML =
    '<div class="cv-header">' +
      '<h1>' + (cv.fullName || 'Your Name') + '</h1>' +
      '<p>' + (cv.email || '') + (cv.phone ? ' | ' + cv.phone : '') + (cv.address ? ' | ' + cv.address : '') + '</p>' +
    '</div>' +
    (cv.summary ? '<div class="cv-section"><h3>Summary</h3><p>' + cv.summary + '</p></div>' : '') +
    ((cv.education.degree || cv.education.institution) ?
      '<div class="cv-section"><h3>Education</h3><p><strong>' + (cv.education.degree || '') + '</strong></p><p>' +
      (cv.education.institution || '') + (cv.education.year ? ' (' + cv.education.year + ')' : '') + '</p></div>' : '') +
    (skillsList ? '<div class="cv-section"><h3>Skills</h3><div class="skills-wrap">' + skillsList + '</div></div>' : '') +
    (cv.experience.jobTitle ?
      '<div class="cv-section"><h3>Experience</h3><p><strong>' + cv.experience.jobTitle + '</strong>' +
      (cv.experience.company ? ' - ' + cv.experience.company : '') + '</p><p>' + (cv.experience.description || '') + '</p></div>' : '') +
    (cv.project.name ?
      '<div class="cv-section"><h3>Projects</h3><p><strong>' + cv.project.name + '</strong></p><p>' +
      (cv.project.description || '') + '</p></div>' : '');
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