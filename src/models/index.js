import { getDb } from '../db/index.js';

async function all(db, query, values = []) {
  const result = await db.query(query, values);
  return result.rows;
}

async function first(db, query, values = []) {
  const result = await db.query(query, values);
  return result.rows[0];
}

function run(db, query, values = []) {
  return db.query(query, values);
}

async function insertId(db, query, values) {
  const result = await db.query(`${query} RETURNING id`, values);
  return result.rows[0].id;
}

export async function getAllServices() {
  const db = await getDb();
  return all(db, `SELECT * FROM services WHERE is_active = 1 ORDER BY "order" ASC, title ASC`);
}

export async function getServiceById(id) {
  const db = await getDb();
  return first(db, `SELECT * FROM services WHERE id = $1 AND is_active = 1`, [id]);
}

export async function createService(data) {
  const db = await getDb();
  const { title, description, icon, image, order = 0 } = data;
  return insertId(
    db,
    `INSERT INTO services (title, description, icon, image, "order") VALUES ($1, $2, $3, $4, $5)`,
    [title, description, icon, image, order]
  );
}

export async function updateService(id, data) {
  const db = await getDb();
  const { title, description, icon, image, order, is_active } = data;
  await run(
    db,
    `UPDATE services SET title = $1, description = $2, icon = $3, image = $4, "order" = $5, is_active = $6 WHERE id = $7`,
    [title, description, icon, image, order, is_active, id]
  );
}

export async function deleteService(id) {
  const db = await getDb();
  await run(db, `DELETE FROM services WHERE id = $1`, [id]);
}

export async function getAllProjects() {
  const db = await getDb();
  return all(db, `SELECT * FROM projects ORDER BY "order" ASC, created_at DESC`);
}

export async function getProjectsByStatus(status) {
  const db = await getDb();
  return all(db, `SELECT * FROM projects WHERE status = $1 ORDER BY "order" ASC`, [status]);
}

export async function getFeaturedProjects() {
  const db = await getDb();
  return all(db, `SELECT * FROM projects WHERE is_featured = 1 LIMIT 6`);
}

export async function createProject(data) {
  const db = await getDb();
  const { title, description, image, status = 'completed', location, year, is_featured = 0, order = 0 } = data;
  return insertId(
    db,
    `INSERT INTO projects (title, description, image, status, location, year, is_featured, "order")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [title, description, image, status, location, year, is_featured, order]
  );
}

export async function updateProject(id, data) {
  const db = await getDb();
  const { title, description, image, status, location, year, is_featured, order } = data;
  await run(
    db,
    `UPDATE projects SET title = $1, description = $2, image = $3, status = $4, location = $5, year = $6, is_featured = $7, "order" = $8 WHERE id = $9`,
    [title, description, image, status, location, year, is_featured, order, id]
  );
}

export async function deleteProject(id) {
  const db = await getDb();
  await run(db, `DELETE FROM projects WHERE id = $1`, [id]);
}

export async function getAllTeamMembers() {
  const db = await getDb();
  return all(db, `SELECT * FROM team_members WHERE is_active = 1 ORDER BY "order" ASC, name ASC`);
}

export async function getTeamMemberById(id) {
  const db = await getDb();
  return first(db, `SELECT * FROM team_members WHERE id = $1 AND is_active = 1`, [id]);
}

export async function createTeamMember(data) {
  const db = await getDb();
  const { name, role, bio, photo, email, phone, linkedin, order = 0 } = data;
  return insertId(
    db,
    `INSERT INTO team_members (name, role, bio, photo, email, phone, linkedin, "order")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [name, role, bio, photo, email, phone, linkedin, order]
  );
}

export async function updateTeamMember(id, data) {
  const db = await getDb();
  const { name, role, bio, photo, email, phone, linkedin, order, is_active } = data;
  await run(
    db,
    `UPDATE team_members SET name = $1, role = $2, bio = $3, photo = $4, email = $5, phone = $6, linkedin = $7, "order" = $8, is_active = $9 WHERE id = $10`,
    [name, role, bio, photo, email, phone, linkedin, order, is_active, id]
  );
}

export async function deleteTeamMember(id) {
  const db = await getDb();
  await run(db, `DELETE FROM team_members WHERE id = $1`, [id]);
}

export async function getAllTestimonials() {
  const db = await getDb();
  return all(db, `SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC LIMIT 6`);
}

export async function createTestimonial(data) {
  const db = await getDb();
  const { client_name, client_role, client_company, photo, message, rating = 5 } = data;
  return insertId(
    db,
    `INSERT INTO testimonials (client_name, client_role, client_company, photo, message, rating)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [client_name, client_role, client_company, photo, message, rating]
  );
}

export async function deleteTestimonial(id) {
  const db = await getDb();
  await run(db, `DELETE FROM testimonials WHERE id = $1`, [id]);
}

export async function getAllMachines() {
  const db = await getDb();
  return all(db, `SELECT * FROM machine_hires WHERE is_available = 1 ORDER BY "order" ASC, name ASC`);
}

export async function getMachineById(id) {
  const db = await getDb();
  return first(db, `SELECT * FROM machine_hires WHERE id = $1 AND is_available = 1`, [id]);
}

export async function createMachine(data) {
  const db = await getDb();
  const { name, description, image, rate, order = 0 } = data;
  return insertId(
    db,
    `INSERT INTO machine_hires (name, description, image, rate, "order")
     VALUES ($1, $2, $3, $4, $5)`,
    [name, description, image, rate, order]
  );
}

export async function updateMachine(id, data) {
  const db = await getDb();
  const { name, description, image, rate, is_available, order } = data;
  await run(
    db,
    `UPDATE machine_hires SET name = $1, description = $2, image = $3, rate = $4, is_available = $5, "order" = $6 WHERE id = $7`,
    [name, description, image, rate, is_available, order, id]
  );
}

export async function deleteMachine(id) {
  const db = await getDb();
  await run(db, `DELETE FROM machine_hires WHERE id = $1`, [id]);
}

export async function createContactMessage(data) {
  const db = await getDb();
  const { name, email, phone, message } = data;
  return insertId(
    db,
    `INSERT INTO contact_messages (name, email, phone, message) VALUES ($1, $2, $3, $4)`,
    [name, email, phone, message]
  );
}

export async function getAllContactMessages() {
  const db = await getDb();
  return all(db, `SELECT * FROM contact_messages ORDER BY created_at DESC`);
}

export async function getUnreadMessages() {
  const db = await getDb();
  return all(db, `SELECT * FROM contact_messages WHERE is_read = 0 ORDER BY created_at DESC`);
}

export async function markMessageAsRead(id) {
  const db = await getDb();
  await run(db, `UPDATE contact_messages SET is_read = 1 WHERE id = $1`, [id]);
}

export async function deleteContactMessage(id) {
  const db = await getDb();
  await run(db, `DELETE FROM contact_messages WHERE id = $1`, [id]);
}

export async function createConsultationBooking(data) {
  const db = await getDb();
  const { name, email, phone, service_interest, preferred_date, preferred_time, message } = data;
  return insertId(
    db,
    `INSERT INTO consultation_bookings (name, email, phone, service_interest, preferred_date, preferred_time, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [name, email, phone, service_interest, preferred_date, preferred_time, message]
  );
}

export async function getAllBookings() {
  const db = await getDb();
  return all(db, `SELECT * FROM consultation_bookings ORDER BY created_at DESC`);
}

export async function getBookingsByStatus(status) {
  const db = await getDb();
  return all(db, `SELECT * FROM consultation_bookings WHERE status = $1 ORDER BY created_at DESC`, [status]);
}

export async function updateBookingStatus(id, status) {
  const db = await getDb();
  await run(db, `UPDATE consultation_bookings SET status = $1 WHERE id = $2`, [status, id]);
}

export async function deleteBooking(id) {
  const db = await getDb();
  await run(db, `DELETE FROM consultation_bookings WHERE id = $1`, [id]);
}
