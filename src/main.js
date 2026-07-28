import './style.css'

const API = '/api/content'

async function fetchContent() {
  try {
    const res = await fetch(API)
    if (!res.ok) throw new Error('Failed to fetch content')
    return await res.json()
  } catch (err) {
    console.error('Error loading content:', err)
    return null
  }
}

function esc(str) {
  if (!str) return ''
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function populateHero(data) {
  if (!data) return
  document.getElementById('heroTitle').innerHTML = data.hero.title.replace(/\n/g, '<br>')
  document.getElementById('heroDesc').innerHTML = data.hero.subtitle.replace(/\n/g, '<br>')
  document.getElementById('heroCta').textContent = data.hero.ctaText
  document.getElementById('heroCta').href = data.hero.ctaLink
  document.getElementById('heroSecondary').textContent = data.hero.secondaryText
  document.getElementById('heroSecondary').href = data.hero.secondaryLink
  document.getElementById('heroBadge').textContent =
    data.about.stats.find(s => s.label.includes('Selections'))
      ? `Trusted by ${data.about.stats.find(s => s.label.includes('Selections')).value}+ Students`
      : 'Trusted by 5000+ Students'
  document.title = `${data.site.name} - ${data.site.tagline}`
}

function populateAbout(data) {
  if (!data) return
  document.getElementById('aboutTitle').textContent = data.about.title
  document.getElementById('aboutDesc').textContent = data.about.description
  const statsContainer = document.getElementById('aboutStats')
  statsContainer.innerHTML = (data.about.stats || []).map(s => `
    <div class="about-stat">
      <span class="about-stat-value">${s.value}</span>
      <span class="about-stat-label">${s.label}</span>
    </div>
  `).join('')
}

function populateCourses(data) {
  if (!data) return
  const grid = document.getElementById('coursesGrid')
  grid.innerHTML = data.courses.map(c => `
    <div class="course-card ${c.featured ? 'featured' : ''}">
      <div class="course-category">${c.category}</div>
      <h3 class="course-title">${c.title}</h3>
      <p class="course-desc">${c.description}</p>
      <div class="course-meta">
        <span><i class="ri-time-line"></i> ${c.duration}</span>
      </div>
      <div class="course-fee">${c.fee}</div>
      <ul class="course-highlights">
        ${(c.highlights || []).map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>
  `).join('')
}

function populateFeatures(data) {
  if (!data) return
  const grid = document.getElementById('featuresGrid')
  const iconMap = {
    'book-open': 'ri-book-open-line',
    'monitor': 'ri-computer-line',
    'file-text': 'ri-file-text-line',
    'bar-chart': 'ri-bar-chart-line',
    'users': 'ri-team-line',
    'trending-up': 'ri-line-chart-line',
  }
  grid.innerHTML = data.features.map(f => `
    <div class="feature-card">
      <div class="feature-icon"><i class="${iconMap[f.icon] || 'ri-star-line'}"></i></div>
      <h3>${f.title}</h3>
      <p>${f.description}</p>
    </div>
  `).join('')
}

function populateTestimonials(data) {
  if (!data) return
  const grid = document.getElementById('testimonialsGrid')
  grid.innerHTML = (data.testimonials || []).map(t => {
    const initials = t.name.split(' ').map(w => w[0]).join('').toUpperCase()
    return `
      <div class="testimonial-card">
        <p class="testimonial-text">${t.text}</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${initials}</div>
          <div>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-exam">${t.exam}</div>
          </div>
        </div>
      </div>
    `
  }).join('')
}

function populateBlogs(data) {
  if (!data) return
  const grid = document.getElementById('blogsGrid')
  const blogs = data.blogs || []
  if (blogs.length === 0) {
    grid.innerHTML = '<div class="no-content">No blog posts yet. Admin can add blog content from the panel.</div>'
    return
  }
  grid.innerHTML = blogs.map(b => `
    <div class="blog-card">
      <div class="blog-img">
        ${b.image ? `<img src="${b.image}" alt="${esc(b.title)}" style="width:100%;height:100%;object-fit:cover" />` : '<i class="ri-article-line"></i>'}
      </div>
      <div class="blog-body">
        <div class="blog-date">${b.date}</div>
        <h3 class="blog-title">${esc(b.title)}</h3>
        <p class="blog-excerpt">${esc(b.excerpt || '')}</p>
      </div>
    </div>
  `).join('')
}

function populateSuccessStories(data) {
  if (!data) return
  const grid = document.getElementById('storiesGrid')
  const stories = data.successStories || []
  if (stories.length === 0) return
  grid.innerHTML = stories.map(s => {
    const initials = s.name.split(' ').map(w => w[0]).join('').toUpperCase()
    const avatarHtml = s.photo
      ? `<div class="story-avatar" style="background-image:url('${s.photo}');background-size:cover;background-position:center"></div>`
      : `<div class="story-avatar">${initials}</div>`
    return `
      <div class="story-card">
        ${avatarHtml}
        <h3 class="story-name">${esc(s.name)}</h3>
        <div class="story-exam">${esc(s.exam)}</div>
        <div class="story-rank">${esc(s.rank)}</div>
        <div class="story-state">${esc(s.state)}</div>
        <p class="story-text">${esc(s.story)}</p>
      </div>
    `
  }).join('')
}

function populateTestSeries(data) {
  if (!data) return
  const ts = data.testSeries
  if (!ts) return

  document.getElementById('tsTitle').textContent = ts.title || 'Daily & Weekly Test Series'
  document.getElementById('tsDesc').textContent = ts.description || ''

  const pricing = ts.pricing || {}
  const pricingContainer = document.getElementById('tsPricing')
  pricingContainer.innerHTML = `
    <div class="ts-price-card">
      <div class="ts-price-label">Monthly</div>
      <div class="ts-price-value">${pricing.monthly || 'Rs. 499'}</div>
    </div>
    <div class="ts-price-card featured-price">
      <div class="ts-price-label">Quarterly</div>
      <div class="ts-price-value">${pricing.quarterly || 'Rs. 1,299'}</div>
    </div>
    <div class="ts-price-card">
      <div class="ts-price-label">Yearly</div>
      <div class="ts-price-value">${pricing.yearly || 'Rs. 3,999'}</div>
    </div>
  `

  const dailyTests = ts.dailyTests || []
  document.getElementById('tsDailyContent').innerHTML = `
    <table class="ts-table">
      <thead><tr><th>Day</th><th>Subject</th><th>Topics</th><th>Questions</th><th>Time</th></tr></thead>
      <tbody>
        ${dailyTests.map(t => `
          <tr>
            <td class="ts-day">${esc(t.day)}</td>
            <td>${esc(t.subject)}</td>
            <td>${esc(t.topics)}</td>
            <td>${t.questions}</td>
            <td>${t.time}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  const weeklyTests = ts.weeklyTests || []
  document.getElementById('tsWeeklyContent').innerHTML = `
    <table class="ts-table">
      <thead><tr><th>Test Name</th><th>Subjects</th><th>Questions</th><th>Time</th><th>Mode</th></tr></thead>
      <tbody>
        ${weeklyTests.map(t => `
          <tr>
            <td class="ts-day">${esc(t.name)}</td>
            <td>${esc(t.subjects)}</td>
            <td>${t.questions}</td>
            <td>${t.time}</td>
            <td>${esc(t.mode)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  const tsFeatures = ts.features || []
  document.getElementById('tsFeaturesContent').innerHTML = `
    <div class="ts-features-list">
      ${tsFeatures.map(f => `<div class="ts-feature-item"><i class="ri-check-line"></i> ${esc(f)}</div>`).join('')}
    </div>
  `

  document.querySelectorAll('.ts-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ts-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      const tabName = tab.dataset.tab
      document.getElementById('tsDailyContent').classList.toggle('hidden', tabName !== 'daily')
      document.getElementById('tsWeeklyContent').classList.toggle('hidden', tabName !== 'weekly')
      document.getElementById('tsFeaturesContent').classList.toggle('hidden', tabName !== 'ts-features')
    })
  })
}

function populateStudyMaterials(data) {
  if (!data) return
  const sm = data.studyMaterials
  if (!sm) return
  document.getElementById('smTitle').textContent = sm.title || 'Study Material & Resources'
  document.getElementById('smDesc').textContent = sm.description || ''

  const iconMap = {
    'newspaper': 'ri-newspaper-line',
    'translate': 'ri-translate-2',
    'file-pdf': 'ri-file-pdf-line',
    'book': 'ri-book-open-line',
    'history': 'ri-history-line',
    'play-circle': 'ri-play-circle-line',
  }

  const grid = document.getElementById('materialsGrid')
  grid.innerHTML = (sm.resources || []).map(r => `
    <div class="material-card">
      <div class="material-icon"><i class="${iconMap[r.icon] || 'ri-file-text-line'}"></i></div>
      <h3>${esc(r.title)}</h3>
      <p>${esc(r.description)}</p>
    </div>
  `).join('')
}

function populateFaculty(data) {
  if (!data) return
  const faculty = data.faculty || []
  if (faculty.length === 0) return
  const grid = document.getElementById('facultyGrid')
  grid.innerHTML = faculty.map(f => {
    const initials = f.name.split(' ').map(w => w[0]).join('').toUpperCase()
    return `
      <div class="faculty-card">
        <div class="faculty-avatar">${initials}</div>
        <h3>${esc(f.name)}</h3>
        <div class="faculty-subject">${esc(f.subject)}</div>
        <div class="faculty-exp">${esc(f.experience)}</div>
        <div class="faculty-qual">${esc(f.qualification)}</div>
        <p class="faculty-bio">${esc(f.bio)}</p>
      </div>
    `
  }).join('')
}

function populateBatches(data) {
  if (!data) return
  const batches = data.batches || []
  if (batches.length === 0) return
  const body = document.getElementById('batchesBody')
  body.innerHTML = batches.map(b => {
    let availClass = 'batch-available'
    if (b.seats && b.seats.includes('Unlimited')) availClass = 'batch-unlimited'
    else if (b.seats && parseInt(b.seats) < 20) availClass = 'batch-filling'
    return `
      <tr>
        <td class="batch-name">${esc(b.name)}</td>
        <td>${esc(b.time)}</td>
        <td>${esc(b.days)}</td>
        <td>${esc(b.mode)}</td>
        <td>${esc(b.subjects)}</td>
        <td class="batch-availability ${availClass}">${esc(b.seats)}</td>
      </tr>
    `
  }).join('')
}

function populateFAQ(data) {
  if (!data) return
  const faq = data.faq || []
  if (faq.length === 0) return
  const list = document.getElementById('faqList')
  list.innerHTML = faq.map((item, i) => `
    <div class="faq-item">
      <button class="faq-question">
        <span>${esc(item.question)}</span>
        <i class="ri-add-line"></i>
      </button>
      <div class="faq-answer"><p>${esc(item.answer)}</p></div>
    </div>
  `).join('')

  list.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement
      const wasActive = item.classList.contains('active')
      list.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'))
      if (!wasActive) item.classList.add('active')
    })
  })
}

function populateExamNotifications(data) {
  if (!data) return
  const notifs = data.examNotifications || []
  const list = document.getElementById('notificationsList')
  if (notifs.length === 0) {
    list.innerHTML = '<div class="no-content">No notifications yet. Check back soon.</div>'
    return
  }
  list.innerHTML = notifs.map(n => {
    const d = new Date(n.date)
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
    return `
      <div class="notification-card">
        <div class="notification-date">
          <span class="notif-day">${d.getDate()}</span>
          <span class="notif-month">${months[d.getMonth()]}</span>
        </div>
        <div class="notification-body">
          <h4>${esc(n.title)}</h4>
          <span class="notif-exam">${esc(n.exam)}</span>
          <p>${esc(n.summary)}</p>
        </div>
      </div>
    `
  }).join('')
}

function populateGallery(data) {
  if (!data) return
  const gallery = data.gallery || []
  const grid = document.getElementById('galleryGrid')
  if (gallery.length === 0) {
    grid.innerHTML = '<div class="no-content">No gallery items yet.</div>'
    return
  }
  renderGalleryItems(gallery)

  document.querySelectorAll('.gfilter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gfilter').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      const cat = btn.dataset.cat
      const filtered = cat === 'all' ? gallery : gallery.filter(g => g.category === cat)
      renderGalleryItems(filtered)
    })
  })
}

function renderGalleryItems(items) {
  const grid = document.getElementById('galleryGrid')
  grid.innerHTML = items.map(g => `
    <div class="gallery-card">
      <div class="gallery-img">
        ${g.image ? `<img src="${g.image}" alt="${esc(g.title)}" />` : '<i class="ri-image-line"></i>'}
      </div>
      <div class="gallery-info">
        <h4>${esc(g.title)}</h4>
        <p>${esc(g.description)}</p>
        <div class="gallery-meta">
          <span class="gallery-cat">${esc(g.category)}</span>
          <span class="gallery-date">${g.date}</span>
        </div>
      </div>
    </div>
  `).join('')
}

function populateCourseSelect(data) {
  if (!data) return
  const select = document.getElementById('cfCourse')
  data.courses.forEach(c => {
    const opt = document.createElement('option')
    opt.value = c.title
    opt.textContent = `${c.title} (${c.category})`
    select.appendChild(opt)
  })
}

async function init() {
  const data = await fetchContent()
  populateHero(data)
  populateAbout(data)
  populateCourses(data)
  populateFeatures(data)
  populateTestimonials(data)
  populateSuccessStories(data)
  populateTestSeries(data)
  populateStudyMaterials(data)
  populateFaculty(data)
  populateBatches(data)
  populateFAQ(data)
  populateExamNotifications(data)
  populateBlogs(data)
  populateGallery(data)
  populateCourseSelect(data)

  document.getElementById('loader').classList.add('hidden')
}

document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const btn = e.target.querySelector('button[type="submit"]')
  const status = document.getElementById('formStatus')
  btn.disabled = true
  status.className = 'form-status'
  status.textContent = 'Sending...'

  const formData = {
    name: document.getElementById('cfName').value.trim(),
    email: document.getElementById('cfEmail').value.trim(),
    phone: document.getElementById('cfPhone').value.trim(),
    course: document.getElementById('cfCourse').value,
    message: document.getElementById('cfMessage').value.trim(),
  }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    const data = await res.json()

    if (res.ok) {
      status.className = 'form-status success'
      status.textContent = data.message
      e.target.reset()
    } else {
      status.className = 'form-status error'
      status.textContent = data.error || 'Something went wrong'
    }
  } catch (err) {
    status.className = 'form-status error'
    status.textContent = 'Network error. Please try again.'
  } finally {
    btn.disabled = false
  }
})

const navbar = document.getElementById('navbar')
const navToggle = document.getElementById('navToggle')
const navLinks = document.getElementById('navLinks')

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50)
})

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active')
  navLinks.classList.toggle('active')
})

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active')
    navLinks.classList.remove('active')
  })
})

init()
