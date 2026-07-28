import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.join(__dirname, '..', 'data', 'content.json')

const router = Router()

function readContent() {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw)
}

function writeContent(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}

router.get('/', (_req, res) => {
  const content = readContent()
  res.json(content)
})

router.put('/site', (req, res) => {
  const content = readContent()
  content.site = { ...content.site, ...req.body }
  writeContent(content)
  res.json({ success: true, site: content.site })
})

router.put('/hero', (req, res) => {
  const content = readContent()
  content.hero = { ...content.hero, ...req.body }
  writeContent(content)
  res.json({ success: true, hero: content.hero })
})

router.put('/about', (req, res) => {
  const content = readContent()
  content.about = { ...content.about, ...req.body }
  writeContent(content)
  res.json({ success: true, about: content.about })
})

router.get('/courses', (_req, res) => {
  const content = readContent()
  res.json(content.courses)
})

router.post('/courses', (req, res) => {
  const content = readContent()
  const newCourse = {
    id: Date.now(),
    ...req.body,
    featured: req.body.featured || false,
    highlights: req.body.highlights || []
  }
  content.courses.push(newCourse)
  writeContent(content)
  res.json({ success: true, course: newCourse })
})

router.put('/courses/:id', (req, res) => {
  const content = readContent()
  const id = Number(req.params.id)
  const index = content.courses.findIndex(c => c.id === id)
  if (index === -1) return res.status(404).json({ error: 'Course not found' })
  content.courses[index] = { ...content.courses[index], ...req.body, id }
  writeContent(content)
  res.json({ success: true, course: content.courses[index] })
})

router.delete('/courses/:id', (req, res) => {
  const content = readContent()
  const id = Number(req.params.id)
  content.courses = content.courses.filter(c => c.id !== id)
  writeContent(content)
  res.json({ success: true })
})

router.get('/features', (_req, res) => {
  const content = readContent()
  res.json(content.features)
})

router.put('/features', (req, res) => {
  const content = readContent()
  content.features = req.body
  writeContent(content)
  res.json({ success: true, features: content.features })
})

router.get('/testimonials', (_req, res) => {
  const content = readContent()
  res.json(content.testimonials)
})

router.post('/testimonials', (req, res) => {
  const content = readContent()
  const newTestimonial = { id: Date.now(), ...req.body }
  content.testimonials.push(newTestimonial)
  writeContent(content)
  res.json({ success: true, testimonial: newTestimonial })
})

router.delete('/testimonials/:id', (req, res) => {
  const content = readContent()
  const id = Number(req.params.id)
  content.testimonials = content.testimonials.filter(t => t.id !== id)
  writeContent(content)
  res.json({ success: true })
})

router.get('/posters', (_req, res) => {
  const content = readContent()
  res.json(content.posters || [])
})

router.post('/posters', (req, res) => {
  const content = readContent()
  const newPoster = { id: Date.now(), ...req.body }
  if (!content.posters) content.posters = []
  content.posters.push(newPoster)
  writeContent(content)
  res.json({ success: true, poster: newPoster })
})

router.delete('/posters/:id', (req, res) => {
  const content = readContent()
  const id = Number(req.params.id)
  content.posters = (content.posters || []).filter(p => p.id !== id)
  writeContent(content)
  res.json({ success: true })
})

router.get('/blogs', (_req, res) => {
  const content = readContent()
  res.json(content.blogs || [])
})

router.post('/blogs', (req, res) => {
  const content = readContent()
  const newBlog = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...req.body }
  if (!content.blogs) content.blogs = []
  content.blogs.push(newBlog)
  writeContent(content)
  res.json({ success: true, blog: newBlog })
})

router.put('/blogs/:id', (req, res) => {
  const content = readContent()
  const id = Number(req.params.id)
  const index = (content.blogs || []).findIndex(b => b.id === id)
  if (index === -1) return res.status(404).json({ error: 'Blog not found' })
  content.blogs[index] = { ...content.blogs[index], ...req.body, id }
  writeContent(content)
  res.json({ success: true, blog: content.blogs[index] })
})

router.delete('/blogs/:id', (req, res) => {
  const content = readContent()
  const id = Number(req.params.id)
  content.blogs = (content.blogs || []).filter(b => b.id !== id)
  writeContent(content)
  res.json({ success: true })
})

router.get('/success-stories', (_req, res) => {
  const content = readContent()
  res.json(content.successStories || [])
})

router.post('/success-stories', (req, res) => {
  const content = readContent()
  const story = { id: Date.now(), ...req.body }
  if (!content.successStories) content.successStories = []
  content.successStories.push(story)
  writeContent(content)
  res.json({ success: true, story })
})

router.delete('/success-stories/:id', (req, res) => {
  const content = readContent()
  const id = Number(req.params.id)
  content.successStories = (content.successStories || []).filter(s => s.id !== id)
  writeContent(content)
  res.json({ success: true })
})

router.get('/test-series', (_req, res) => {
  const content = readContent()
  res.json(content.testSeries || {})
})

router.put('/test-series', (req, res) => {
  const content = readContent()
  content.testSeries = { ...content.testSeries, ...req.body }
  writeContent(content)
  res.json({ success: true, testSeries: content.testSeries })
})

router.put('/test-series/daily', (req, res) => {
  const content = readContent()
  if (!content.testSeries) content.testSeries = { dailyTests: [], weeklyTests: [], pricing: {}, features: [] }
  content.testSeries.dailyTests = req.body
  writeContent(content)
  res.json({ success: true })
})

router.put('/test-series/weekly', (req, res) => {
  const content = readContent()
  if (!content.testSeries) content.testSeries = { dailyTests: [], weeklyTests: [], pricing: {}, features: [] }
  content.testSeries.weeklyTests = req.body
  writeContent(content)
  res.json({ success: true })
})

router.get('/study-materials', (_req, res) => {
  const content = readContent()
  res.json(content.studyMaterials || {})
})

router.put('/study-materials', (req, res) => {
  const content = readContent()
  content.studyMaterials = { ...content.studyMaterials, ...req.body }
  writeContent(content)
  res.json({ success: true })
})

router.put('/study-materials/resources', (req, res) => {
  const content = readContent()
  if (!content.studyMaterials) content.studyMaterials = { resources: [] }
  content.studyMaterials.resources = req.body
  writeContent(content)
  res.json({ success: true })
})

router.get('/faculty', (_req, res) => {
  const content = readContent()
  res.json(content.faculty || [])
})

router.post('/faculty', (req, res) => {
  const content = readContent()
  const member = { id: Date.now(), ...req.body }
  if (!content.faculty) content.faculty = []
  content.faculty.push(member)
  writeContent(content)
  res.json({ success: true, member })
})

router.put('/faculty/:id', (req, res) => {
  const content = readContent()
  const id = Number(req.params.id)
  const index = (content.faculty || []).findIndex(f => f.id === id)
  if (index === -1) return res.status(404).json({ error: 'Faculty not found' })
  content.faculty[index] = { ...content.faculty[index], ...req.body, id }
  writeContent(content)
  res.json({ success: true, member: content.faculty[index] })
})

router.delete('/faculty/:id', (req, res) => {
  const content = readContent()
  const id = Number(req.params.id)
  content.faculty = (content.faculty || []).filter(f => f.id !== id)
  writeContent(content)
  res.json({ success: true })
})

router.get('/faq', (_req, res) => {
  const content = readContent()
  res.json(content.faq || [])
})

router.put('/faq', (req, res) => {
  const content = readContent()
  content.faq = req.body
  writeContent(content)
  res.json({ success: true })
})

router.get('/batches', (_req, res) => {
  const content = readContent()
  res.json(content.batches || [])
})

router.put('/batches', (req, res) => {
  const content = readContent()
  content.batches = req.body
  writeContent(content)
  res.json({ success: true })
})

router.get('/exam-notifications', (_req, res) => {
  const content = readContent()
  res.json(content.examNotifications || [])
})

router.post('/exam-notifications', (req, res) => {
  const content = readContent()
  const notif = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...req.body }
  if (!content.examNotifications) content.examNotifications = []
  content.examNotifications.push(notif)
  writeContent(content)
  res.json({ success: true, notification: notif })
})

router.delete('/exam-notifications/:id', (req, res) => {
  const content = readContent()
  const id = Number(req.params.id)
  content.examNotifications = (content.examNotifications || []).filter(n => n.id !== id)
  writeContent(content)
  res.json({ success: true })
})

export default router
